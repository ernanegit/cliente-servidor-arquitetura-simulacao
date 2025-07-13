CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir dados de exemplo
INSERT INTO users (name, email) VALUES 
('João Silva', 'joao@example.com'),
('Maria Santos', 'maria@example.com'),
('Pedro Costa', 'pedro@example.com'),
('Ana Oliveira', 'ana@example.com')
ON CONFLICT (email) DO NOTHING;