CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    order_status varchar NOT NULL,
    user_id INTEGER NOT NULL REFERENCES users (id),
    order_date DATE
);
