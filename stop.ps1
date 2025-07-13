# stop.ps1 - Parar todos os serviços

Write-Host "Parando ambiente cliente-servidor..." -ForegroundColor Yellow

docker-compose down

Write-Host "Ambiente parado com sucesso!" -ForegroundColor Green