# start.ps1 - Iniciar todos os serviços

Write-Host "Iniciando ambiente cliente-servidor..." -ForegroundColor Green

# Construir e iniciar containers
docker-compose up --build -d

Write-Host "Aguardando inicialização dos serviços..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Verificar status dos containers
docker-compose ps

Write-Host "`nServiços disponíveis:" -ForegroundColor Green
Write-Host "- API Server: http://localhost:3000" -ForegroundColor Cyan
Write-Host "- Nginx Proxy: http://localhost:80" -ForegroundColor Cyan
Write-Host "- Grafana: http://localhost:3001 (admin/admin)" -ForegroundColor Cyan
Write-Host "- Prometheus: http://localhost:9090" -ForegroundColor Cyan
Write-Host "- PostgreSQL: localhost:5432" -ForegroundColor Cyan

Write-Host "`nPara monitorar: ./monitor.ps1 -Action status" -ForegroundColor Yellow