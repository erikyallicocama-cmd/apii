-- Crear tabla ai_requests si no existe
CREATE TABLE IF NOT EXISTS ai_requests (
    id SERIAL PRIMARY KEY,
    conversation_id VARCHAR(255) NOT NULL,
    message_order INTEGER NOT NULL,
    status VARCHAR(1) NOT NULL DEFAULT 'A',
    prompt TEXT NOT NULL,
    response TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_conversation_id ON ai_requests(conversation_id);
CREATE INDEX IF NOT EXISTS idx_conversation_order ON ai_requests(conversation_id, message_order);
CREATE INDEX IF NOT EXISTS idx_status ON ai_requests(status);
CREATE INDEX IF NOT EXISTS idx_conversation_status ON ai_requests(conversation_id, status);
CREATE INDEX IF NOT EXISTS idx_created_at ON ai_requests(created_at);
