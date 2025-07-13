# monitor.ps1 - Script para monitoramento básico

param(
    [string]$Action = "status"
)

function Show-SystemStatus {
    Write-Host "=== STATUS DO SISTEMA ===" -ForegroundColor Green
    
    Write-Host "`nStatus dos Containers:" -ForegroundColor Yellow
    docker-compose ps
    
    Write-Host "`nVerificando saúde dos serviços..." -ForegroundColor Yellow
    
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:3000/health" -TimeoutSec 5
        Write-Host "✓ API Server: $($response.status)" -ForegroundColor Green
    } catch {
        Write-Host "✗ API Server: Indisponível" -ForegroundColor Red
    }
    
    try {
        Invoke-RestMethod -Uri "http://localhost:80/health" -TimeoutSec 5 | Out-Null
        Write-Host "✓ Nginx Proxy: Funcionando" -ForegroundColor Green
    } catch {
        Write-Host "✗ Nginx Proxy: Indisponível" -ForegroundColor Red
    }
    
    try {
        $stats = Invoke-RestMethod -Uri "http://localhost:3000/api/stats" -TimeoutSec 5
        Write-Host "`nEstatísticas da API:" -ForegroundColor Yellow
        Write-Host "- Usuários no banco: $($stats.users)" -ForegroundColor Cyan
        Write-Host "- Uptime: $($stats.uptime)" -ForegroundColor Cyan
        Write-Host "- Memória: $([math]::Round($stats.memory.heapUsed / 1MB, 2)) MB" -ForegroundColor Cyan
    } catch {
        Write-Host "✗ Não foi possível obter estatísticas da API" -ForegroundColor Red
    }
}

function Start-LoadTest {
    Write-Host "=== TESTE DE CARGA BÁSICO ===" -ForegroundColor Green
    Write-Host "Executando 50 requisições..." -ForegroundColor Yellow
    
    $requests = 0
    $errors = 0
    $responseTimes = @()
    
    for ($i = 1; $i -le 50; $i++) {
        try {
            $start = Get-Date
            Invoke-RestMethod -Uri "http://localhost:3000/api/users" -TimeoutSec 5 | Out-Null
            $responseTime = (Get-Date) - $start
            $responseTimes += $responseTime.TotalMilliseconds
            $requests++
            
            if ($i % 10 -eq 0) {
                Write-Host "Progresso: $i/50 requisições" -ForegroundColor Cyan
            }
        } catch {
            $errors++
        }
        Start-Sleep -Milliseconds 200
    }
    
    $successRate = (($requests - $errors) / $requests) * 100
    $avgResponseTime = ($responseTimes | Measure-Object -Average).Average
    
    Write-Host "`n=== RESULTADOS ===" -ForegroundColor Green
    Write-Host "Total: $requests requisições" -ForegroundColor Cyan
    Write-Host "Erros: $errors" -ForegroundColor Cyan
    Write-Host "Taxa de sucesso: $([math]::Round($successRate, 2))%" -ForegroundColor Cyan
    Write-Host "Tempo médio: $([math]::Round($avgResponseTime, 2)) ms" -ForegroundColor Cyan
}

function Show-Services {
    Write-Host "=== SERVIÇOS DISPONÍVEIS ===" -ForegroundColor Green
    Write-Host "- API Server: http://localhost:3000" -ForegroundColor Cyan
    Write-Host "- Nginx Proxy: http://localhost:80" -ForegroundColor Cyan
    Write-Host "- Grafana: http://localhost:3001 (admin/admin)" -ForegroundColor Cyan
    Write-Host "- Prometheus: http://localhost:9090" -ForegroundColor Cyan
    Write-Host "- PostgreSQL: localhost:5432" -ForegroundColor Cyan
}

switch ($Action.ToLower()) {
    "status" { Show-SystemStatus }
    "loadtest" { Start-LoadTest }
    "services" { Show-Services }
    default {
        Write-Host "Uso: ./monitor.ps1 -Action [status|loadtest|services]" -ForegroundColor Yellow
        Write-Host "`nAções disponíveis:" -ForegroundColor Green
        Write-Host "  status    - Mostra status dos serviços" -ForegroundColor Cyan
        Write-Host "  loadtest  - Executa teste de carga básico" -ForegroundColor Cyan
        Write-Host "  services  - Lista todos os serviços" -ForegroundColor Cyan
    }
}