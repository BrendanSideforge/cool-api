
CREATE TABLE IF NOT EXISTS customers (

    id SERIAL PRIMARY KEY,
    email TEXT,
    uuid TEXT,
    total_vt_credits BIGINT,
    customer_id TEXT,
    plan TEXT,
    currency BIGINT,
    next_bill_date TIMESTAMP,
    created_at TIMESTAMP

);

-- ALTER TABLE customers ADD total_vt_credits BIGINT;