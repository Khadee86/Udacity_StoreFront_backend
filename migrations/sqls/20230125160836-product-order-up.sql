CREATE TABLE product_orders (
    id SERIAL PRIMARY KEY,
    prod_id INTEGER NOT NULL REFERENCES products (id),
    order_id INTEGER NOT NULL REFERENCES orders (id),
    quantity INT NOT NULL
);