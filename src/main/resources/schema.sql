CREATE TABLE IF NOT EXISTS portfolio_content (
    id SMALLINT PRIMARY KEY,
    content_json JSONB NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT portfolio_content_singleton CHECK (id = 1)
);
