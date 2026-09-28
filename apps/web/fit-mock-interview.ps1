$p = "src\app\(dashboard)\interview-kit\mock-interview\page.tsx"
$s = [System.IO.File]::ReadAllText($p)

$s = $s.Replace(
'max-w-[1280px] px-5 py-6 sm:px-7 lg:px-8',
'w-full max-w-none px-5 py-5 sm:px-6 lg:px-7'
)

$s = $s.Replace(
'text-4xl font-black tracking-[-0.045em] sm:text-5xl',
'text-3xl font-black tracking-[-0.045em] sm:text-4xl'
)

$s = $s.Replace(
'rounded-2xl border border-white/10 bg-[#090909] p-5 sm:p-6',
'rounded-2xl border border-white/10 bg-[#090909] p-4 sm:p-5'
)

$s = $s.Replace(
'min-h-[86px] items-center gap-4 rounded-xl border p-4',
'min-h-[78px] items-center gap-3 rounded-xl border p-3.5'
)

$s = $s.Replace(
'h-12 w-12 shrink-0',
'h-10 w-10 shrink-0'
)

$s = $s.Replace(
'rounded-xl bg-blue-500/10',
'rounded-lg bg-blue-500/10'
)

$s = $s.Replace(
'rounded-xl bg-purple-500/10',
'rounded-lg bg-purple-500/10'
)

$s = $s.Replace(
'rounded-xl bg-orange-500/10',
'rounded-lg bg-orange-500/10'
)

$s = $s.Replace(
'rounded-xl bg-white/[0.05]',
'rounded-lg bg-white/[0.05]'
)

$s = $s.Replace(
'h-[72px] items-center justify-center',
'h-[64px] items-center justify-center'
)

$s = $s.Replace(
'h-[72px] flex-col items-center justify-center',
'h-[64px] flex-col items-center justify-center'
)

$s = $s.Replace(
'mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2',
'mt-3 grid grid-cols-1 gap-3 lg:grid-cols-2'
)

$s = $s.Replace(
'mt-4 rounded-2xl',
'mt-3 rounded-2xl'
)

$s = $s.Replace(
'h-12 shrink-0',
'h-11 shrink-0'
)

$s = $s.Replace(
'px-6 text-sm font-black',
'px-5 text-sm font-black'
)

[System.IO.File]::WriteAllText($p, $s)

npm run build
