import client from '../database';

export type Product = {
    id?: string;
    name: string;
    price: number;
    category: string;
    // enter one out of the following categories: mens wear, womens wear, children wear
};

export class ProductModel {
    // INDEX
    //  @ts-ignore
    async index(): Promise<Product[]> {
        try {
            const conn = await client.connect();
            const sql = 'SELECT * FROM products';

            const result = await conn.query(sql);
            conn.release();

            return result.rows;
        } catch (err) {
            throw new Error(`Cannot show Products List: ${err}`);
        }
    }

    //CREATE
    async create(p: Product): Promise<Product> {
        try {
            const sql =
                'INSERT INTO products (name,price,category) VALUES($1, $2,$3) RETURNING *';
            //  @ts-ignore
            const conn = await client.connect();
            const result = await conn.query(sql, [p.name, p.price, p.category]);
            const product = result.rows[0];
            conn.release();

            return product;
        } catch (err) {
            throw new Error(`unable create product: ${err}`);
        }
    }

    //   SHOW
    async show(id: string): Promise<Product> {
        try {
            const conn = await client.connect();
            const sql = 'SELECT * FROM products WHERE id=($1)';
            const result = await conn.query(sql, [id]);

            if (result.rows.length) {
                conn.release();
                return result.rows[0];
            } else {
                throw new Error(`Could not find product.`);
            }
        } catch (err) {
            throw new Error(`Could not show product details, ${err}`);
        }
    }

    // DELETE
    async delete(id: string): Promise<Boolean | Product> {
        try {
            const sql = 'SELECT * FROM products WHERE id=($1)';
            // @ts-ignore
            const conn = await client.connect();

            const result = await conn.query(sql, [id]);

            if (result.rows.length) {
                const sql2 = 'DELETE FROM products WHERE id=($1)';
                await conn.query(sql2, [id]);
                conn.release();
                return true;
            } else {
                return false;
            }
        } catch (err) {
            throw new Error(`Could not delete product ${id}. Error: ${err}`);
        }
    }

    // UPDATE
    async updateProduct(id: string, p: Product): Promise<Product> {
        try {
            // @ts-ignore
            const conn = await client.connect();
            const sql =
                'UPDATE products SET name=($1),price=($2), category=($3) WHERE id=($4) RETURNING *';

            const result = await conn.query(sql, [
                p.name,
                p.price,
                p.category,
                id
            ]);

            if (!result.rows.length) {
                throw new Error(`Could not find product to update. check id`);
            }
            // console.log(result.rows.length);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not update product. Error: ${err}`);
        }
    }
    //   SHOW RPODUCT BY CATEGORY
    async showProductByCategory(cat: string): Promise<Product[]> {
        try {
            const conn = await client.connect();
            const sql = 'SELECT * FROM products WHERE category=($1)';
            const result = await conn.query(sql, [cat]);

            if (result.rows.length) {
                conn.release();
                return result.rows;
            } else {
                throw new Error(`Could not find product in this category.`);
            }
        } catch (err) {
            throw new Error(`Could not show product details, ${err}`);
        }
    }
}
