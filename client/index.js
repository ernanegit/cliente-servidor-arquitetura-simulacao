const axios = require('axios');
const fs = require('fs');
const path = require('path');

const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3000';
const REQUESTS_PER_MINUTE = parseInt(process.env.REQUESTS_PER_MINUTE) || 60;
const LOG_FILE = path.join(__dirname, 'client_logs.json');

class ClientSimulator {
  constructor() {
    this.stats = {
      totalRequests: 0,
      successRequests: 0,
      failedRequests: 0,
      averageResponseTime: 0,
      responseTimes: [],
      errors: []
    };
    
    this.users = [];
    this.isRunning = false;
  }

  async makeRequest(method, endpoint, data = null) {
    const startTime = Date.now();
    
    try {
      const config = {
        method,
        url: `${SERVER_URL}${endpoint}`,
        timeout: 10000
      };
      
      if (data) {
        config.data = data;
      }
      
      const response = await axios(config);
      const responseTime = Date.now() - startTime;
      
      this.stats.totalRequests++;
      this.stats.successRequests++;
      this.stats.responseTimes.push(responseTime);
      
      this.logRequest(method, endpoint, response.status, responseTime, true);
      
      return { success: true, data: response.data, responseTime };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      this.stats.totalRequests++;
      this.stats.failedRequests++;
      this.stats.errors.push({
        endpoint,
        error: error.message,
        timestamp: new Date().toISOString()
      });
      
      this.logRequest(method, endpoint, error.response?.status || 0, responseTime, false, error.message);
      
      return { success: false, error: error.message, responseTime };
    }
  }

  logRequest(method, endpoint, statusCode, responseTime, success, error = null) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      method,
      endpoint,
      statusCode,
      responseTime,
      success,
      error
    };
    
    console.log(`[${logEntry.timestamp}] ${method} ${endpoint} - ${statusCode} (${responseTime}ms) ${success ? '✓' : '✗'}`);
    
    this.saveLog(logEntry);
  }

  saveLog(logEntry) {
    try {
      let logs = [];
      if (fs.existsSync(LOG_FILE)) {
        const fileContent = fs.readFileSync(LOG_FILE, 'utf8');
        logs = JSON.parse(fileContent);
      }
      
      logs.push(logEntry);
      
      if (logs.length > 1000) {
        logs = logs.slice(-1000);
      }
      
      fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2));
    } catch (error) {
      console.error('Error saving log:', error);
    }
  }

  calculateStats() {
    if (this.stats.responseTimes.length === 0) return;
    
    const times = this.stats.responseTimes;
    const sum = times.reduce((a, b) => a + b, 0);
    
    this.stats.averageResponseTime = sum / times.length;
    this.stats.minResponseTime = Math.min(...times);
    this.stats.maxResponseTime = Math.max(...times);
    
    // Calcular percentis
    const sorted = times.sort((a, b) => a - b);
    const p95Index = Math.floor(sorted.length * 0.95);
    const p99Index = Math.floor(sorted.length * 0.99);
    
    this.stats.p95ResponseTime = sorted[p95Index];
    this.stats.p99ResponseTime = sorted[p99Index];
  }

  printStats() {
    this.calculateStats();
    
    console.log('\n=== ESTATÍSTICAS DO CLIENTE ===');
    console.log(`Total de requisições: ${this.stats.totalRequests}`);
    console.log(`Requisições bem-sucedidas: ${this.stats.successRequests}`);
    console.log(`Requisições falhadas: ${this.stats.failedRequests}`);
    console.log(`Taxa de sucesso: ${((this.stats.successRequests / this.stats.totalRequests) * 100).toFixed(2)}%`);
    console.log(`Tempo médio de resposta: ${this.stats.averageResponseTime.toFixed(2)}ms`);
    console.log(`Tempo mínimo de resposta: ${this.stats.minResponseTime}ms`);
    console.log(`Tempo máximo de resposta: ${this.stats.maxResponseTime}ms`);
    console.log(`P95 tempo de resposta: ${this.stats.p95ResponseTime}ms`);
    console.log(`P99 tempo de resposta: ${this.stats.p99ResponseTime}ms`);
    console.log(`Erros únicos: ${this.stats.errors.length}`);
    console.log('================================\n');
  }

  async simulateUserActions() {
    const actions = [
      // Listar usuários
      async () => await this.makeRequest('GET', '/api/users'),
      
      // Buscar usuário específico
      async () => {
        if (this.users.length > 0) {
          const randomUser = this.users[Math.floor(Math.random() * this.users.length)];
          return await this.makeRequest('GET', `/api/users/${randomUser.id}`);
        }
        return { success: false, error: 'No users available' };
      },
      
      // Criar usuário
      async () => {
        const userData = {
          name: `User ${Date.now()}`,
          email: `user${Date.now()}@example.com`
        };
        const result = await this.makeRequest('POST', '/api/users', userData);
        if (result.success) {
          this.users.push(result.data);
        }
        return result;
      },
      
      // Health check
      async () => await this.makeRequest('GET', '/health'),
      
      // Estatísticas
      async () => await this.makeRequest('GET', '/api/stats'),
      
      // Endpoint lento
      async () => await this.makeRequest('GET', '/api/slow')
    ];
    
    // Executar ação aleatória
    const randomAction = actions[Math.floor(Math.random() * actions.length)];
    await randomAction();
  }

  async start() {
    console.log(`Iniciando simulador de cliente...`);
    console.log(`Servidor: ${SERVER_URL}`);
    console.log(`Requisições por minuto: ${REQUESTS_PER_MINUTE}`);
    console.log(`Intervalo entre requisições: ${60000 / REQUESTS_PER_MINUTE}ms\n`);
    
    this.isRunning = true;
    
    // Carregar usuários existentes
    const usersResult = await this.makeRequest('GET', '/api/users');
    if (usersResult.success) {
      this.users = usersResult.data;
    }
    
    // Executar requisições em intervalo
    const interval = setInterval(async () => {
      if (!this.isRunning) {
        clearInterval(interval);
        return;
      }
      
      await this.simulateUserActions();
    }, 60000 / REQUESTS_PER_MINUTE);
    
    // Imprimir estatísticas a cada 30 segundos
    setInterval(() => {
      if (this.isRunning) {
        this.printStats();
      }
    }, 30000);
    
    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('\nParando simulador...');
      this.isRunning = false;
      this.printStats();
      process.exit(0);
    });
    
    process.on('SIGINT', () => {
      console.log('\nParando simulador...');
      this.isRunning = false;
      this.printStats();
      process.exit(0);
    });
  }
}

// Iniciar simulador
const simulator = new ClientSimulator();
simulator.start().catch(console.error);