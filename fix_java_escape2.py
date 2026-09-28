from pathlib import Path

p = Path(r"D:\Jobix\apps\api\app\routers\dsa.py")
s = p.read_text(encoding="utf-8")

old1 = r'''        s = s.replaceAll("[\\[\\]\\"]", "").trim();'''
new1 = '''        s = s.replace("[", "").replace("]", "").replace('"', "").trim();'''

old2 = '''            row = row.replace("[", "")
                     .replace("]", "")
                     .replace(""", "")
                     .trim();'''
new2 = '''            row = row.replace("[", "")
                     .replace("]", "")
                     .replace('"', "")
                     .trim();'''

if old1 in s:
    s = s.replace(old1, new1)
    print("Fixed parseStringArray")
else:
    print("parseStringArray pattern not found")

if old2 in s:
    s = s.replace(old2, new2)
    print("Fixed parseStringMatrix")
else:
    print("parseStringMatrix pattern not found")

p.write_text(s, encoding="utf-8")

print()
print("VERIFYING SOURCE:")
for i, line in enumerate(s.splitlines(), 1):
    if "replaceAll" in line or "replace('\"'" in line or "parseStringArray" in line or "parseStringMatrix" in line:
        print(f"{i}: {line}")
