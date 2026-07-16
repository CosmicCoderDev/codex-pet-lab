[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$SourceDir,

    [string]$CodexHome = (Join-Path $env:USERPROFILE '.codex'),

    [switch]$Force
)

$ErrorActionPreference = 'Stop'
$source = (Resolve-Path -LiteralPath $SourceDir).Path
$manifestPath = Join-Path $source 'pet.json'

if (-not (Test-Path -LiteralPath $manifestPath -PathType Leaf)) {
    throw "Missing pet.json in $source"
}

$manifest = Get-Content -LiteralPath $manifestPath -Raw | ConvertFrom-Json
if ([string]::IsNullOrWhiteSpace($manifest.id)) {
    throw 'pet.json must contain a non-empty id.'
}

$sheetName = if ($manifest.spritesheetPath) { [string]$manifest.spritesheetPath } else { 'spritesheet.webp' }
$sheetPath = Join-Path $source $sheetName
if (-not (Test-Path -LiteralPath $sheetPath -PathType Leaf)) {
    throw "Missing spritesheet: $sheetPath"
}

$petsRoot = Join-Path $CodexHome 'pets'
$target = Join-Path $petsRoot ([string]$manifest.id)

if (Test-Path -LiteralPath $target) {
    if (-not $Force) {
        throw "Pet '$($manifest.id)' already exists. Re-run with -Force to replace it."
    }
    $resolvedRoot = [System.IO.Path]::GetFullPath($petsRoot)
    $resolvedTarget = [System.IO.Path]::GetFullPath($target)
    if (-not $resolvedTarget.StartsWith($resolvedRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
        throw 'Refusing to remove a target outside the Codex pets directory.'
    }
    Remove-Item -LiteralPath $target -Recurse -Force
}

New-Item -ItemType Directory -Path $target -Force | Out-Null
Copy-Item -LiteralPath $manifestPath -Destination (Join-Path $target 'pet.json')
Copy-Item -LiteralPath $sheetPath -Destination (Join-Path $target 'spritesheet.webp')

Write-Output "Installed '$($manifest.displayName)' to $target"
Write-Output 'Open Settings > Pets, select Refresh, then choose the pet.'
