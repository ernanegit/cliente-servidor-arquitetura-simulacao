[COPIAR TODO O CONTEÚDO DO ARTIFACT ACIMA]
# 🚀 Laboratório Cliente-Servidor - Arquitetura e Simulação

Um ambiente completo de **arquitetura cliente-servidor** usando Docker para demonstrar conceitos de **sistemas distribuídos**, **observabilidade** e **Site Reliability Engineering (SRE)**.

## 🎯 Visão Geral

Este projeto implementa uma arquitetura cliente-servidor completa com:
- **API REST** em Node.js com métricas integradas
- **Cliente simulador** automático com logs detalhados
- **Monitoramento em tempo real** com Prometheus e Grafana
- **Proxy reverso** Nginx para load balancing
- **Banco de dados** PostgreSQL com dados de exemplo
- **Scripts de automação** PowerShell para gerenciamento

## 🏗️ Arquitetura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     Cliente     │────│   Nginx Proxy   │────│   API Server    │
│   (Simulador)   │    │  (Load Balance) │    │   (Node.js)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                        │
                       ┌─────────────────┐    ┌─────────────────┐
│   Prometheus    │    │   PostgreSQL    │
                       │  (Métricas)     │    │  (Banco dados)  │
                       └─────────────────┘    └─────────────────┘
                                │
                       ┌─────────────────┐
                       │    Grafana      │
                       │  (Dashboard)    │
                       └─────────────────┘
```

## 🚀 Início Rápido

### Pré-requisitos
- Docker Desktop instalado
- PowerShell (Windows) 
- Portas disponíveis: 80, 3000, 3001, 5432, 9090, 9100

### 1. Clone o repositório
```bash
git clone https://github.com/ernanegit/cliente-servidor-arquitetura-simulacao.git
cd cliente-servidor-arquitetura-simulacao
```

### 2. Iniciar o ambiente
```powershell
./start.ps1
```

### 3. Verificar status
```powershell
./monitor.ps1 -Action status
```

### 4. Executar teste de carga
```powershell
./monitor.ps1 -Action loadtest
```

## 📊 Serviços Disponíveis

| Serviço | URL | Credenciais | Descrição |
|---------|-----|-------------|-----------|
| **API Server** | http://localhost:3000 | - | API REST com Node.js |
| **Nginx Proxy** | http://localhost:80 | - | Proxy reverso e load balancer |
| **Grafana** | http://localhost:3001 | admin/admin | Dashboard de monitoramento |
| **Prometheus** | http://localhost:9090 | - | Coleta de métricas |
| **PostgreSQL** | localhost:5432 | postgres/password | Banco de dados |

## 📊 Dashboards Grafana Pré-configurados

### Dashboard Principal: "Sistema Cliente-Servidor - Monitoramento"

O projeto inclui um dashboard completo com os seguintes painéis:

#### 🎯 **Métricas Principais:**
- **Requisições por Segundo (RPS)**: Throughput em tempo real
- **Tempo de Resposta P95**: Latência no percentil 95
- **Conexões Ativas**: Número de conexões simultâneas 
- **Taxa de Erro (%)**: Porcentagem de requisições com falha

#### 📈 **Gráficos Avançados:**
- **Requisições por Endpoint**: Distribuição por rota da API
- **Percentis de Tempo de Resposta**: P50, P95, P99
- **Análise Temporal**: Tendências e padrões de uso

#### 🔧 **Configuração Automática:**
- **Datasource Prometheus**: Conectado automaticamente
- **Refresh automático**: Dados atualizados a cada 5 segundos
- **Queries otimizadas**: Métricas específicas da aplicação

### 📊 **Queries Prometheus incluídas:**
```promql
# Requisições por segundo
sum(rate(http_requests_total[1m]))

# Latência P95
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))

# Taxa de erro
sum(rate(http_requests_total{status_code!~"2.."}[1m])) / sum(rate(http_requests_total[1m])) * 100

# Conexões ativas
active_connections
```

## 🔧 Scripts de Automação

### Gerenciamento Básico
```powershell
./start.ps1                    # Iniciar todos os serviços
./stop.ps1                     # Parar todos os serviços
./logs.ps1                     # Ver logs de todos os serviços
./logs.ps1 -Service server     # Ver logs de um serviço específico
```

### Monitoramento e Análise
```powershell
./monitor.ps1 -Action status       # Status geral do sistema
./monitor.ps1 -Action loadtest     # Teste de carga básico
./monitor.ps1 -Action services     # Listar todos os serviços
```

## 📈 API Endpoints

### Usuários
- `GET /api/users` - Listar todos os usuários
- `GET /api/users/:id` - Buscar usuário por ID
- `POST /api/users` - Criar novo usuário
- `PUT /api/users/:id` - Atualizar usuário
- `DELETE /api/users/:id` - Deletar usuário

### Monitoramento
- `GET /health` - Health check da aplicação
- `GET /api/stats` - Estatísticas da API
- `GET /api/slow` - Endpoint com delay simulado
- `GET /metrics` - Métricas para Prometheus

### Exemplo de Uso
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

## 🔍 Métricas Disponíveis

### Métricas da Aplicação
- **http_requests_total**: Total de requisições HTTP
- **http_request_duration_seconds**: Duração das requisições
- **active_connections**: Conexões ativas
- **process_cpu_seconds_total**: Uso de CPU
- **process_resident_memory_bytes**: Uso de memória

### Métricas do Sistema
- **node_cpu_seconds_total**: CPU do sistema
- **node_memory_MemTotal_bytes**: Memória total
- **node_filesystem_size_bytes**: Uso do filesystem

## 🎓 Experimentos e Cenários

### 1. **Análise de Performance**
```powershell
# Executar teste de carga e monitorar métricas
./monitor.ps1 -Action loadtest
# Observar no Grafana: RPS, latência, conexões
```

### 2. **Simulação de Falhas**
```powershell
# Parar servidor durante operação
docker-compose stop server
# Observar comportamento do cliente e proxy
./logs.ps1 -Service client

# Recuperar sistema
docker-compose start server
```

### 3. **Teste de Stress**
```powershell
# Múltiplas requisições simultâneas
for ($i=1; $i -le 5; $i++) {
    Start-Job { Invoke-RestMethod "http://localhost:3000/api/users" }
}
```

### 4. **Análise de Logs**
```powershell
# Logs em tempo real do Nginx
./logs.ps1 -Service nginx
# Verificar padrões de tráfego e latência
```

## 📁 Estrutura do Projeto

```
cliente-servidor/
├── 📁 server/                     # API Server Node.js
│   ├── 📄 index.js               # Código principal da API
│   ├── 📄 package.json           # Dependências Node.js
│   └── 📄 Dockerfile             # Container do servidor
├── 📁 client/                     # Cliente Simulador
│   ├── 📄 index.js               # Simulador de requisições
│   ├── 📄 package.json           # Dependências do cliente
│   └── 📄 Dockerfile             # Container do cliente
├── 📁 database/                   # Configuração PostgreSQL
│   └── 📄 init.sql               # Script de inicialização
├── 📁 nginx/                      # Proxy Reverso
│   ├── 📄 nginx.conf             # Configuração do Nginx
│   └── 📁 logs/                  # Logs de acesso
├── 📁 prometheus/                 # Monitoramento
│   └── 📄 prometheus.yml         # Configuração do Prometheus
├── 📁 grafana/                    # Dashboards
│   ├── 📁 dashboards/            # Dashboards pré-configurados
│   │   ├── 📄 dashboard.yml      # Configuração de provisionamento
│   │   └── 📄 cliente-servidor-dashboard.json # Dashboard completo
│   └── 📁 datasources/           # Fontes de dados
│       └── 📄 prometheus.yml     # Conexão com Prometheus
├── 📄 docker-compose.yml         # Orquestração dos containers
├── 📄 start.ps1                  # Script para iniciar
├── 📄 stop.ps1                   # Script para parar
├── 📄 logs.ps1                   # Script para logs
├── 📄 monitor.ps1                # Script de monitoramento
├── 📄 .gitignore                 # Arquivos ignorados
└── 📄 README.md                  # Esta documentação
```

## 🛠️ Troubleshooting

### Containers não iniciam
```powershell
# Verificar logs
docker-compose logs

# Verificar portas em uso
netstat -an | findstr ":3000\|:80\|:5432"

# Reset completo
docker-compose down -v
docker-compose up --build -d
```

### Serviços não respondem
```powershell
# Verificar status
docker-compose ps

# Reiniciar serviço específico
docker-compose restart server

# Verificar logs detalhados
./logs.ps1 -Service server
```

### Métricas não aparecem no Grafana
```powershell
# Verificar conectividade Prometheus
docker exec prometheus wget -qO- http://server:3000/metrics

# Reiniciar serviços de monitoramento
docker-compose restart prometheus grafana
```

## 🎯 Conceitos Demonstrados

### **DevOps e Infraestrutura**
- ✅ **Containerização** com Docker
- ✅ **Orquestração** com Docker Compose
- ✅ **Infrastructure as Code**
- ✅ **Automação** com scripts PowerShell

### **Site Reliability Engineering (SRE)**
- ✅ **Observabilidade** completa (métricas, logs, traces)
- ✅ **Monitoramento** em tempo real
- ✅ **Alertas** e dashboards
- ✅ **Chaos Engineering** (simulação de falhas)

### **Arquitetura de Sistemas**
- ✅ **Microserviços** e comunicação
- ✅ **Load balancing** e proxy reverso
- ✅ **Resiliência** e recuperação automática
- ✅ **Escalabilidade** horizontal

### **Performance Engineering**
- ✅ **Testes de carga** automatizados
- ✅ **Análise de latência** (P50, P95, P99)
- ✅ **Throughput** e capacity planning
- ✅ **Bottleneck** identification

## 🔗 Recursos Adicionais

### Documentação
- [Docker Compose](https://docs.docker.com/compose/)
- [Prometheus](https://prometheus.io/docs/)
- [Grafana](https://grafana.com/docs/)
- [Node.js Express](https://expressjs.com/)

### Livros Recomendados
- "Site Reliability Engineering" - Google
- "Building Microservices" - Sam Newman
- "Prometheus: Up & Running" - Brian Brazil
- "Designing Data-Intensive Applications" - Martin Kleppmann

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Faça commit das mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📜 Licença

Este projeto é educacional e está sob licença MIT. Sinta-se livre para usar, modificar e distribuir.

## 🏆 Autor

**Ernane** - [GitHub](https://github.com/ernanegit)

---

**💡 Projeto desenvolvido para demonstrar conceitos avançados de arquitetura de sistemas, DevOps e Site Reliability Engineering em um ambiente prático e educacional.**