# logs.ps1 - Visualizar logs dos serviços

param(
    [string]$Service = "all"
)

if ($Service -eq "all") {
    docker-compose logs -f
} else {
    docker-compose logs -f $Service
}