import secrets

import jwt
from urllib.parse import urlencode

import requests
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from fastapi.responses import RedirectResponse

from fastapi import APIRouter, Depends, Header, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import User
from app.schemas.auth import (
    LoginRequest,
    RegisterRequest,
    TokenResponse,
    UserResponse,
)
from app.core.config import settings
from app.core.security import (
    create_access_token,
    hash_password,
    verify_password,
)

router = APIRouter(prefix="/auth", tags=["Authentication"])
def send_login_notification(user: User):
    if not settings.resend_api_key or not settings.email_from:
        return

    name = user.full_name or "there"

    html = f"""
    <div style="margin:0;padding:40px 20px;background:#f3f8ff;font-family:Arial,Helvetica,sans-serif;">
      <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:18px;padding:40px;box-shadow:0 8px 30px rgba(7,20,59,0.08);">
        <div style="text-align:center;margin-bottom:30px;">
          <div style="font-size:30px;font-weight:800;color:#07143b;letter-spacing:-1px;">JOBIX</div>
          <div style="font-size:13px;color:#61789f;margin-top:5px;">Career, Smarter.</div>
        </div>
        <h1 style="color:#07143b;font-size:25px;margin:0 0 16px;">You logged in successfully</h1>
        <p style="color:#405577;font-size:16px;line-height:1.7;margin:0 0 12px;">Hi {name},</p>
        <p style="color:#405577;font-size:16px;line-height:1.7;margin:0 0 22px;">You successfully logged in to your JOBIX Career account.</p>
        <div style="background:#f3f8ff;border-radius:12px;padding:18px;margin:20px 0;">
          <p style="margin:0;color:#07143b;font-size:14px;font-weight:600;">Account email</p>
          <p style="margin:7px 0 0;color:#61789f;font-size:14px;">{user.email}</p>
        </div>
        <p style="color:#61789f;font-size:14px;line-height:1.6;margin:24px 0 0;">If you did not make this login, please secure your account and contact JOBIX support.</p>
        <div style="border-top:1px solid #e5edf7;margin-top:30px;padding-top:20px;text-align:center;">
          <p style="margin:0;color:#8a9ab5;font-size:12px;">JOBIX Career · Your career, smarter.</p>
        </div>
      </div>
    </div>
    """

    try:
        requests.post(
            "https://api.resend.com/emails",
            headers={
                "Authorization": f"Bearer {settings.resend_api_key}",
                "Content-Type": "application/json",
            },
            json={
                "from": settings.email_from,
                "to": [user.email],
                "subject": "You logged in to JOBIX Career",
                "html": html,
            },
            timeout=10,
        )
    except Exception:
        pass


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    existing_user = db.scalar(
        select(User).where(User.email == payload.email.lower())
    )

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists.",
        )

    user = User(
        email=payload.email.lower(),
        password_hash=hash_password(payload.password),
        full_name=payload.full_name,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.scalar(
        select(User).where(User.email == payload.email.lower())
    )

    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This account is inactive.",
        )

    token = create_access_token(str(user.id))

    send_login_notification(user)

    return TokenResponse(
        access_token=token,
        user=user,
    )
def social_password():
    return hash_password(secrets.token_urlsafe(32))


def get_or_create_social_user(
    db: Session,
    email: str,
    full_name: str | None,
):
    normalized_email = email.lower()
    user = db.scalar(select(User).where(User.email == normalized_email))

    if user:
        if full_name and not user.full_name:
            user.full_name = full_name
            db.commit()
            db.refresh(user)
        return user

    user = User(
        email=normalized_email,
        password_hash=social_password(),
        full_name=full_name,
        is_email_verified=True,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


@router.get("/google")
def google_login():
    params = {
        "client_id": settings.google_client_id,
        "redirect_uri": f"{settings.backend_url}/auth/google/callback",
        "response_type": "code",
        "scope": "openid email profile",
        "access_type": "offline",
        "prompt": "select_account",
    }

    url = "https://accounts.google.com/o/oauth2/v2/auth?" + urlencode(params)

    return RedirectResponse(url)


@router.get("/google/callback")
def google_callback(
    code: str | None = None,
    error: str | None = None,
    db: Session = Depends(get_db),
):
    frontend_url = settings.frontend_url

    if error or not code:
        return RedirectResponse(
            f"{frontend_url}/login?oauth_error=google"
        )

    token_response = requests.post(
        "https://oauth2.googleapis.com/token",
        data={
            "code": code,
            "client_id": settings.google_client_id,
            "client_secret": settings.google_client_secret,
            "redirect_uri": f"{settings.backend_url}/auth/google/callback",
            "grant_type": "authorization_code",
        },
        timeout=15,
    )

    if not token_response.ok:
        return RedirectResponse(
            f"{frontend_url}/login?oauth_error=google"
        )

    token_data = token_response.json()
    access_token = token_data.get("access_token")

    if not access_token:
        return RedirectResponse(
            f"{frontend_url}/login?oauth_error=google"
        )

    userinfo_response = requests.get(
        "https://openidconnect.googleapis.com/v1/userinfo",
        headers={
            "Authorization": f"Bearer {access_token}",
        },
        timeout=15,
    )

    if not userinfo_response.ok:
        return RedirectResponse(
            f"{frontend_url}/login?oauth_error=google"
        )

    google_user = userinfo_response.json()

    email = google_user.get("email")
    full_name = google_user.get("name")

    if not email:
        return RedirectResponse(
            f"{frontend_url}/login?oauth_error=google"
        )

    user = get_or_create_social_user(db, email, full_name)

    if not user.is_active:
        return RedirectResponse(
            f"{frontend_url}/login?oauth_error=inactive"
        )

    token = create_access_token(str(user.id))

    send_login_notification(user)

    return RedirectResponse(
        f"{frontend_url}/oauth/callback#access_token={token}"
    )

@router.get("/linkedin")
def linkedin_login():
    params = {
        "response_type": "code",
        "client_id": settings.linkedin_client_id,
        "redirect_uri": f"{settings.backend_url}/auth/linkedin/callback",
        "state": secrets.token_urlsafe(32),
        "scope": "openid profile email",
    }

    url = "https://www.linkedin.com/oauth/v2/authorization?" + urlencode(params)

    return RedirectResponse(url)


@router.get("/linkedin/callback")
def linkedin_callback(
    code: str | None = None,
    error: str | None = None,
    db: Session = Depends(get_db),
):
    frontend_url = settings.frontend_url

    if error or not code:
        return RedirectResponse(
            f"{frontend_url}/login?oauth_error=linkedin"
        )

    token_response = requests.post(
        "https://www.linkedin.com/oauth/v2/accessToken",
        data={
            "grant_type": "authorization_code",
            "code": code,
            "client_id": settings.linkedin_client_id,
            "client_secret": settings.linkedin_client_secret,
            "redirect_uri": f"{settings.backend_url}/auth/linkedin/callback",
        },
        timeout=15,
    )

    if not token_response.ok:
        return RedirectResponse(
            f"{frontend_url}/login?oauth_error=linkedin"
        )

    access_token = token_response.json().get("access_token")

    if not access_token:
        return RedirectResponse(
            f"{frontend_url}/login?oauth_error=linkedin"
        )

    userinfo_response = requests.get(
        "https://api.linkedin.com/v2/userinfo",
        headers={
            "Authorization": f"Bearer {access_token}",
        },
        timeout=15,
    )

    if not userinfo_response.ok:
        return RedirectResponse(
            f"{frontend_url}/login?oauth_error=linkedin"
        )

    linkedin_user = userinfo_response.json()

    email = linkedin_user.get("email")
    full_name = linkedin_user.get("name")

    if not email:
        return RedirectResponse(
            f"{frontend_url}/login?oauth_error=linkedin"
        )

    user = get_or_create_social_user(db, email, full_name)

    if not user.is_active:
        return RedirectResponse(
            f"{frontend_url}/login?oauth_error=inactive"
        )

    token = create_access_token(str(user.id))

    send_login_notification(user)

    return RedirectResponse(
        f"{frontend_url}/oauth/callback#access_token={token}&email={urlencode({'value': user.email})[6:]}&full_name={urlencode({'value': user.full_name or ''})[6:]}"
    )

@router.get("/me", response_model=UserResponse)
def get_current_user(
    authorization: str | None = Header(default=None),
    db: Session = Depends(get_db),
):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required.",
        )

    token = authorization.replace("Bearer ", "", 1)

    try:
        payload = jwt.decode(
            token,
            settings.jwt_secret_key,
            algorithms=[settings.jwt_algorithm],
        )
        user_id = payload.get("sub")
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token.",
        )

    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token.",
        )

    user = db.scalar(
        select(User).where(User.id == int(user_id))
    )

    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account is unavailable.",
        )

    return user