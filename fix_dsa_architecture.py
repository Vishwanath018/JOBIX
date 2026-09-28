from pathlib import Path

frontend = Path(r"D:\Jobix\apps\web\src\app\(dashboard)\interview-kit\dsa\[company]\[question]\page.tsx")
backend = Path(r"D:\Jobix\apps\api\app\routers\dsa.py")

# ------------------------------------------------------------
# FRONTEND: function-only Java starter
# ------------------------------------------------------------

s = frontend.read_text(encoding="utf-8")

start = s.find("const starterCode =")
end = s.find("\nconst formatTime =", start)

if start == -1 or end == -1:
    raise SystemExit("Could not locate starterCode block")

new_starter = r'''const starterCode = (title: string, language: string) => {
  if (language === "python") {
    return `class Solution:
    def solve(self):
        # ${title}
        pass
`;
  }

  if (language === "cpp") {
    return `class Solution {
public:
    // ${title}
};
`;
  }

  return `class Solution {
    // ${title}
};
`;
};'''

s = s[:start] + new_starter + s[end:]
frontend.write_text(s, encoding="utf-8")

print("Frontend starter code changed to function-only format.")


# ------------------------------------------------------------
# BACKEND: never pretend unsupported questions work
# ------------------------------------------------------------

s = backend.read_text(encoding="utf-8")

old = '''        else:
            code = f"""
import java.util.*;

class Solution {{
{user_code}
}}

public class Main {{
    public static void main(String[] args) throws Exception {{
        System.out.println("Question harness not configured.");
    }}
}}
"""'''

if old in s:
    new = '''        else:
            raise HTTPException(
                status_code=422,
                detail={
                    "code": "QUESTION_HARNESS_NOT_CONFIGURED",
                    "question_id": question_id,
                    "message": (
                        f"No Java harness is configured yet for "
                        f"question '{question_id}'."
                    ),
                },
            )'''

    s = s.replace(old, new)
else:
    # Locate the existing fallback safely.
    marker = 'System.out.println("Question harness not configured.");'

    pos = s.find(marker)

    if pos != -1:
        block_start = s.rfind("        else:", 0, pos)

        if block_start == -1:
            raise SystemExit(
                "Could not safely locate generic Java harness fallback."
            )

        # Find the next payload declaration after the fallback.
        block_end = s.find("    payload:", pos)

        if block_end == -1:
            raise SystemExit(
                "Could not safely locate end of Java harness block."
            )

        replacement = '''        else:
            raise HTTPException(
                status_code=422,
                detail={
                    "code": "QUESTION_HARNESS_NOT_CONFIGURED",
                    "question_id": question_id,
                    "message": (
                        f"No Java harness is configured yet for "
                        f"question '{question_id}'."
                    ),
                },
            )

'''

        s = s[:block_start] + replacement + s[block_end:]

backend.write_text(s, encoding="utf-8")

print("Backend generic fake harness removed.")
print("")
print("Now compiling backend...")
