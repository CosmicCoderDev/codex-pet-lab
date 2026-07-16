[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [ValidatePattern('^[a-z0-9][a-z0-9-]*$')]
    [string]$PetId,

    [string]$CodexHome = (Join-Path $env:USERPROFILE '.codex')
)

$ErrorActionPreference = 'Stop'
$petsRoot = Join-Path $CodexHome 'pets'
$target = Join-Path $petsRoot $PetId
$resolvedRoot = [System.IO.Path]::GetFullPath($petsRoot)
$resolvedTarget = [System.IO.Path]::GetFullPath($target)

if (-not $resolvedTarget.StartsWith($resolvedRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
    throw 'Refusing to remove a target outside the Codex pets directory.'
}

if (-not (Test-Path -LiteralPath $target)) {
    Write-Output "Pet '$PetId' is not installed."
    exit 0
}

Remove-Item -LiteralPath $target -Recurse -Force
Write-Output "Removed '$PetId'. Refresh Settings > Pets in Codex."
