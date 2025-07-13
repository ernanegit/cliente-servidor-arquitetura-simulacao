# Laboratório Cliente-Servidor com Docker

## 🚀 Início Rápido

1. **Iniciar serviços:**
   ```powershell
   ./start.ps1
   ```

2. **Verificar status:**
   ```powershell
   ./monitor.ps1 -Action status
   ```

3. **Testar carga:**
   ```powershell
   ./monitor.ps1 -Action loadtest
   ```

4. **Parar ambiente:**
   ```powershell
   ./stop.ps1
   ```

## 📊 Serviços Disponíveis

| Serviço | URL | Descrição |
|---------|-----|-----------|
| **API Server** | http://localhost:3000 | API REST com Node.js |
| **Nginx Proxy** | http://localhost:80 | Proxy reverso e load balancer |
| **Grafana** | http://localhost:3001 | Dashboard de monitoramento |
| **Prometheus** | http://localhost:9090 | Coleta de métricas |
| **PostgreSQL** | localhost:5432 | Banco de dados |

### Credenciais
- **Grafana**: admin/admin
- **PostgreSQL**: postgres/password

## 🔧 Comandos Úteis

```powershell
# Ver logs de todos os serviços
./logs.ps1

# Ver logs de um serviço específico
./logs.ps1 -Service server
./logs.ps1 -Service client
./logs.ps1 -Service nginx

# Listar serviços
./monitor.ps1 -Action services

# Reiniciar um serviço
docker-compose restart server
```

## 📈 Endpoints da API

- `GET /api/users` - Listar usuários
- `GET /api/users/:id` - Buscar usuário por ID
- `POST /api/users` - Criar usuário
- `PUT /api/users/:id` - Atualizar usuário
- `DELETE /api/users/:id` - Deletar usuário
- `GET /health` - Health check
- `GET /api/stats` - Estatísticas da API
- `GET /api/slow` - Endpoint com delay simulado
- `GET /metrics` - Métricas para Prometheus

## 🎯 Objetivos de Aprendizado

- **Arquitetura cliente-servidor**: Separação de responsabilidades
- **Containerização**: Uso do Docker para isolamento
- **Monitoramento**: Métricas com Prometheus e Grafana
- **Load balancing**: Distribuição de carga com Nginx
- **Análise de performance**: Latência, throughput, percentis
- **Logs e observabilidade**: Rastreamento de requisições

## 🔍 Exemplos de Uso

### Fazer requisições manuais
```bash
# Listar usuários
curl http://localhost:3000/api/users

# Criar usuário
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "João", "email": "joao@test.com"}'

# Health check
curl http://localhost:3000/health
```

### Verificar métricas
```bash
# Ver métricas do Prometheus
curl http://localhost:3000/metrics

# Acessar Grafana
# http://localhost:3001 (admin/admin)
```

## 📊 Métricas Disponíveis

- **http_requests_total**: Total de requisições HTTP
- **http_request_duration_seconds**: Duração das requisições
- **active_connections**: Conexões ativas
- **process_cpu_seconds_total**: Uso de CPU
- **process_resident_memory_bytes**: Uso de memória

## 🛠️ Troubleshooting

### Containers não iniciam
```powershell
# Verificar logs
docker-compose logs

# Verificar portas em uso
netstat -an | findstr ":3000\|:80\|:5432"

# Limpar e reiniciar
docker-compose down -v
docker-compose up --build
```

### Serviços não respondem
```powershell
# Verificar status
docker-compose ps

# Reiniciar serviço específico
docker-compose restart server

# Verificar logs do serviço
./logs.ps1 -Service server
```

## 📚 Estrutura do Projeto

```
projeto/
├── docker-compose.yml          # Orquestração dos containers
├── server/                     # API Server
│   ├── index.js               # Código principal
│   ├── package.json           # Dependências
│   └── Dockerfile             # Container do servidor
├── client/                     # Cliente simulador
│   ├── index.js               # Simulador de requisições
│   ├── package.json           # Dependências
│   └── Dockerfile             # Container do cliente
├── database/                   # Configuração do banco
│   └── init.sql               # Script de inicialização
├── nginx/                      # Proxy reverso
│   └── nginx.conf             # Configuração do Nginx
├── prometheus/                 # Monitoramento
│   └── prometheus.yml         # Configuração do Prometheus
├── grafana/                    # Dashboards
│   └── datasources/           # Conexão com Prometheus
├── start.ps1                   # Script para iniciar
├── stop.ps1                    # Script para parar
├── logs.ps1                    # Script para logs
└── monitor.ps1                 # Script de monitoramento
```

## 🎓 Experimentos Sugeridos

1. **Análise de Performance**
   - Execute teste de carga e monitore as métricas
   - Compare latência P50, P95 e P99
   - Identifique gargalos

2. **Teste de Falhas**
   - Pare o servidor: `docker-compose stop server`
   - Observe comportamento do cliente
   - Verifique logs do Nginx

3. **Escalabilidade**
   - Aumente requisições por minuto no cliente
   - Monitore uso de recursos
   - Identifique ponto de saturação

4. **Observabilidade**
   - Explore dashboards no Grafana
   - Analise logs em tempo real
   - Configure alertas customizados

---

**💡 Dica**: Mantenha o Grafana aberto (http://localhost:3001) para monitorar as métricas em tempo real!