# Run: $ scripts/convert-to-lf.ps1
# Function: Recursively convert all .ts/.tsx files under ./frontend and ./website from CRLF to LF line endings.
# Note: Assumes UTF-8 (with or without BOM). If your files use other encodings (e.g., UTF-16), verify beforehand.

$targetDirs = 'frontend', 'website'

foreach ($dir in $targetDirs) {
    $root = Join-Path (Get-Location) $dir

    if (-not (Test-Path $root)) {
        Write-Error "Directory '$root' does not exist. Please check the path."
        continue
    }

    Get-ChildItem -Path $root -Include *.ts,*.tsx -Recurse -File |
        Where-Object { $_.FullName -notmatch '\\node_modules\\' } |
        ForEach-Object {
            $path = $_.FullName
            try {
                # Read raw bytes to detect BOM
                $bytes = [System.IO.File]::ReadAllBytes($path)
                if ($bytes.Length -eq 0) {
                    Write-Host "SKIP (empty): $path"
                    return
                }

                $hasBom = ($bytes.Length -ge 3 -and $bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF)

                # Decode as UTF-8 (other encodings may break)
                $text = [System.Text.Encoding]::UTF8.GetString($bytes)

                # Normalize CRLF -> LF
                $newText = $text -replace "`r`n", "`n"

                if ($newText -ne $text) {
                    # Write back, preserving BOM if it existed
                    $enc = if ($hasBom) { New-Object System.Text.UTF8Encoding $true } else { New-Object System.Text.UTF8Encoding $false }
                    [System.IO.File]::WriteAllText($path, $newText, $enc)
                    Write-Host "CONVERTED: $path"
                } else {
                    Write-Host "NO CHANGE: $path"
                }
            } catch {
                Write-Warning "FAILED: $path (`$_.Exception.Message = $($_.Exception.Message))"
            }
        }
}
