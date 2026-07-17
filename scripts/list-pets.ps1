[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'
$petsRoot = Join-Path $PSScriptRoot '..\pets'

if (-not (Test-Path -LiteralPath $petsRoot -PathType Container)) {
    throw "Bundled pets directory not found: $petsRoot"
}

$pets = foreach ($directory in Get-ChildItem -LiteralPath $petsRoot -Directory | Sort-Object Name) {
    $manifestPath = Join-Path $directory.FullName 'pet.json'
    if (-not (Test-Path -LiteralPath $manifestPath -PathType Leaf)) {
        continue
    }
    $manifest = Get-Content -LiteralPath $manifestPath -Raw | ConvertFrom-Json
    [PSCustomObject]@{
        Id = [string]$manifest.id
        Name = [string]$manifest.displayName
        Version = "v$([int]$manifest.spriteVersionNumber)"
        Description = [string]$manifest.description
    }
}

$pets | Format-Table -AutoSize
Write-Output "Install with: .\scripts\install-pet.ps1 -PetId <id> -Force"
