$version = (Get-Content package.json) -join "`n" | ConvertFrom-Json | Select -ExpandProperty "version"
Write-Host "##vso[task.setvariable variable=NPM_VER;]$version"