import client from '../database';
import { Product } from './products';

export type Orders = {
    id?: string;
    order_status?: string;
    user_id: number;
    order_date: string;
    // enter one out of the following status: active or complete order
};

export class OrderModel {
    // INDEX
    //  @ts-ignore
    async index(id: string): Promise<Orders[]> {
        try {
            const conn = await client.connect();
            const sql = 'SELECT * FROM orders WHERE user_id=($1)';
            const result = await conn.query(sql, [id]);
            if (result.rows.length) {
                conn.release();
                return result.rows;
            } else {
                throw new Error(
                    `Cannot show the order list for user with id : ${id}`
                );
            }
        } catch (err) {
            throw new Error(`Cannot show Order List: ${err}`);
        }
    }

    //CREATE
    async create(o: Orders): Promise<Orders> {
        try {
            //  @ts-ignore
            const conn = await client.connect();
            const que = 'SELECT * FROM users WHERE id=($1)';
            const res = await conn.query(que, [o.user_id]);
            if (res.rows.length) {
                const sql =
                    'INSERT INTO orders (user_id,order_status,order_date) VALUES($1, $2,$3) RETURNING *';

                const result = await conn.query(sql, [
                    o.user_id,
                    'active',
                    o.order_date
                ]);
                const order = result.rows[0];
                conn.release();
                return order;
            } else {
                throw new Error(`Cannot create order for a non-existent user.`);
            }
        } catch (err) {
            throw new Error(`unable create order: ${err}`);
        }
    }

    // UPDATE
    async updateOrderStatus(id: string, o: Orders): Promise<Orders> {
        try {
            // @ts-ignore
            const conn = await client.connect();
            const sql =
                'UPDATE orders SET order_status=($1) WHERE id=($2) RETURNING *';

            const result = await conn.query(sql, [o.order_status, id]);

            if (result.rows.length) {
                conn.release();
                return result.rows[0];
            } else {
                throw new Error(
                    `Could not find order to update status. check id`
                );
            }
        } catch (err) {
            throw new Error(`Could not update order status. Error: ${err}`);
        }
    }

    //   SHOW
    async show(id: string): Promise<Orders> {
        try {
            const conn = await client.connect();
            const sql = 'SELECT * FROM orders WHERE id=($1)';
            const result = await conn.query(sql, [id]);

            if (result.rows.length) {
                conn.release();
                return result.rows[0];
            } else {
                throw new Error(`Order does not exist.`);
            }
        } catch (err) {
            throw new Error(`Could not show this speicific Order, ${err}`);
        }
    }

    // DELETE
    async delete(id: string): Promise<Boolean | Orders> {
        try {
            const sql = 'SELECT * FROM orders WHERE id=($1)';
            // @ts-ignore
            const conn = await client.connect();

            const result = await conn.query(sql, [id]);

            if (result.rows.length) {
                const sql2 = 'DELETE FROM orders WHERE id=($1)';
                await conn.query(sql2, [id]);
                conn.release();
                return true;
            } else {
                return false;
            }
        } catch (err) {
            throw new Error(`Could not delete order ${id}. Error: ${err}`);
        }
    }

    // SHOW ORDER BASED ON STATUS
    // cat=active or complete
    async showOrderByStatus(status: string, id: string): Promise<Orders[]> {
        try {
            const conn = await client.connect();
            const sql =
                'SELECT * FROM orders WHERE order_status=($1) AND user_id=($2)';
            const result = await conn.query(sql, [status, id]);

            // if(result.rows.length) {
            while (result.rows.length) {
                conn.release();
                return result.rows;
            }
            // }
            // else{
            throw new Error(`no order with ths status by this user.`);
            // }
        } catch (err) {
            throw new Error(`Could not show this specific Order, ${err}`);
        }
    }

    // ADD PRODUCT TO CART
    async addProdToCart(OrderId: string, prodId: string, qty: string) {
        try {
            const conn = await client.connect();
            const query = 'SELECT * FROM products WHERE id=($1)';
            const result = await conn.query(query, [prodId]);
            if (result.rows.length) {
                const q = 'SELECT * FROM orders WHERE id=($1)';
                const r = await conn.query(q, [OrderId]);
                if (r.rows.length) {
                    const sql =
                        'INSERT INTO product_orders(quantity, order_id, prod_id) VALUES($1, $2, $3) RETURNING *';
                    const result = await conn.query(sql, [
                        qty,
                        OrderId,
                        prodId
                    ]);

                    conn.release();
                    return result.rows[0];
                } else {
                    throw new Error(
                        `Cannot add product to an order that does not exist`
                    );
                }
            } else {
                throw new Error(`Cannot add product because it does not exist`);
            }
        } catch (err) {
            throw new Error(`Could not add product to cart, ${err}`);
        }
    }

    // VIEW PROD IN PARTICULAR ORDER
    async ViewOrderProduct(id: string): Promise<Product[]> {
        try {
            const conn = await client.connect();
            const q =
                'SELECT * FROM products INNER JOIN product_orders ON products.id=product_orders.prod_id WHERE product_orders.order_id=($1)';
            const r = await conn.query(q, [id]);
            if (r.rows.length) {
                conn.release();
                return r.rows;
            } else {
                throw new Error(
                    `Cannot view product to an order that does not exist`
                );
            }
        } catch (err) {
            throw new Error(`Could not add product to cart, ${err}`);
        }
    }
}
