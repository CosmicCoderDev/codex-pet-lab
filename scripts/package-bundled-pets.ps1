[CmdletBinding()]
param(
    [string]$OutputDir = (Join-Path $PSScriptRoot '..\dist')
)

$ErrorActionPreference = 'Stop'
$petsRoot = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..\pets')).Path
$output = [System.IO.Path]::GetFullPath($OutputDir)
New-Item -ItemType Directory -Path $output -Force | Out-Null

$checksums = @()
foreach ($directory in Get-ChildItem -LiteralPath $petsRoot -Directory | Sort-Object Name) {
    $manifestPath = Join-Path $directory.FullName 'pet.json'
    if (-not (Test-Path -LiteralPath $manifestPath -PathType Leaf)) {
        continue
    }
    $manifest = Get-Content -LiteralPath $manifestPath -Raw | ConvertFrom-Json
    $sheetName = if ($manifest.spritesheetPath) { [string]$manifest.spritesheetPath } else { 'spritesheet.webp' }
    $sheetPath = Join-Path $directory.FullName $sheetName
    if (-not (Test-Path -LiteralPath $sheetPath -PathType Leaf)) {
        throw "Missing spritesheet for '$($manifest.id)': $sheetPath"
    }

    $archivePath = Join-Path $output "codex-pet-$($manifest.id)-v2.zip"
    if (Test-Path -LiteralPath $archivePath) {
        Remove-Item -LiteralPath $archivePath -Force
    }
    Compress-Archive -LiteralPath $manifestPath, $sheetPath -DestinationPath $archivePath -CompressionLevel Optimal
    $hash = (Get-FileHash -LiteralPath $archivePath -Algorithm SHA256).Hash.ToLowerInvariant()
    $checksums += "$hash  $([System.IO.Path]::GetFileName($archivePath))"
    Write-Output "Packaged '$($manifest.displayName)' -> $archivePath"
}

$checksumsPath = Join-Path $output 'SHA256SUMS.txt'
[System.IO.File]::WriteAllLines($checksumsPath, $checksums, [System.Text.UTF8Encoding]::new($false))
Write-Output "Checksums -> $checksumsPath"
