from pathlib import Path

p = Path(r"D:\Jobix\apps\api\app\routers\dsa.py")
s = p.read_text(encoding="utf-8")

s = s.replace(
'''        s = s.replaceAll("[\\\\[\\\\]\\\\"]", "").trim();''',
'''        s = s.replace("[", "").replace("]", "").replace('"', "").trim();'''
)

s = s.replace(
'''            row = row.replace("[", "")
                     .replace("]", "")
                     .replace(""", "")
                     .trim();''',
'''            row = row.replace("[", "")
                     .replace("]", "")
                     .replace('"', "")
                     .trim();'''
)

p.write_text(s, encoding="utf-8")
print("Java escaping fixed.")
