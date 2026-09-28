$p = "src\app\(dashboard)\interview-kit\mock-interview\page.tsx"
$s = [System.IO.File]::ReadAllText($p)

# Make the Back button larger and bolder
$s = $s.Replace(
'inline-flex h-10 shrink-0 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.025] px-4 text-xs font-bold',
'inline-flex h-11 shrink-0 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 text-sm font-black'
)

# Make the main page sections slightly larger
$s = $s.Replace(
'rounded-2xl border border-white/10 bg-[#090909] p-4 sm:p-5',
'rounded-2xl border border-white/10 bg-[#090909] p-5 sm:p-6'
)

# Make subject cards larger
$s = $s.Replace(
'min-h-[78px] items-center gap-3 rounded-xl border p-3.5',
'min-h-[88px] items-center gap-4 rounded-xl border p-4'
)

# Make subject icons larger
$s = $s.Replace(
'flex h-10 w-10 shrink-0 items-center',
'flex h-11 w-11 shrink-0 items-center'
)

# Make difficulty cards larger
$s = $s.Replace(
'flex h-[64px] items-center justify-center',
'flex h-[76px] items-center justify-center'
)

# Make duration cards larger
$s = $s.Replace(
'flex h-[64px] flex-col items-center justify-center',
'flex h-[76px] flex-col items-center justify-center'
)

# Increase section heading sizes slightly
$s = $s.Replace(
'text-lg font-black tracking-tight',
'text-xl font-black tracking-tight'
)

# Increase setup/action bar padding
$s = $s.Replace(
'mt-3 rounded-2xl border border-white/10 bg-[#090909] p-4 sm:p-5',
'mt-4 rounded-2xl border border-white/10 bg-[#090909] p-5 sm:p-6'
)

# Make start button slightly larger
$s = $s.Replace(
'inline-flex h-11 shrink-0 items-center justify-center gap-3 rounded-xl',
'inline-flex h-12 shrink-0 items-center justify-center gap-3 rounded-xl'
)

$s = $s.Replace(
'px-5 text-sm font-black text-white',
'px-6 text-sm font-black text-white'
)

[System.IO.File]::WriteAllText($p, $s)

Write-Host "Mock Interview UI resized successfully."
