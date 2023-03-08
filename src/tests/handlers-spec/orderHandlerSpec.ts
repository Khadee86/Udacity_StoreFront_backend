import supertest from 'supertest';
import app from '../../server';
import client from '../../database';
import { Orders } from '../../models/orders';
import { UserModel, User } from '../../models/users';
import { ProductModel, Product } from '../../models/products';

const request = supertest(app);
const userModel = new UserModel();

describe('To test OrderRoutes', () => {
    const testToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRhZUBnbWFpbC5jb20iLCJmbmFtZSI6InRhZSIsImxuYW1lIjoiaHl1bmciLCJpYXQiOjE2NzUxNzI2NDl9.ljIBD0eY9tfePqzmrap_43hP2D7NazJRtGU7Q_DiVpo';
    const time = new Date().toLocaleString();

    const newuser: User = {
        email: 'kim@gmail.com',
        pword: '5678',
        fname: 'kim',
        lname: 'seokjin'
    };
    const newProduct: Product = {
        name: 'Michael Kors Bag',
        price: 51000,
        category: 'mens wear'
    };

    it('It should return 200 if order is properly created', async (): Promise<void> => {
        const u = await request
            .post('/users')
            .set('Authorization', `Bearer ${testToken}`)
            .send(newuser);
        const response3 = await request
            .get('/users')
            .set('Authorization', `Bearer ${testToken}`)
            .send(newuser);
        const userId: number = response3.body[0].id;

        const response = await request
            .post('/orders')
            .set('Authorization', `Bearer ${testToken}`)
            .send({ userId: userId });
        expect(response.status).toBe(200);
        // console.log(response.body);
    });
    it('It should return 200 if Order List is displayed', async (): Promise<void> => {
        const response3 = await request
            .get('/users')
            .set('Authorization', `Bearer ${testToken}`)
            .send(newuser);
        const userId: string = response3.body[0].id.toString();

        const response2 = await request
            .get('/orders')
            .set('Authorization', `Bearer ${testToken}`)
            .send({ userId: userId });
        expect(response2.status).toBe(200);
    });

    it('It should return 200 if order with specific id is displayed', async (): Promise<void> => {
        const response3 = await request
            .get('/users')
            .set('Authorization', `Bearer ${testToken}`)
            .send(newuser);
        const userId: string = response3.body[0].id.toString();

        const response2 = await request
            .get('/orders')
            .set('Authorization', `Bearer ${testToken}`)
            .send({ userId: userId });
        const response = await request
            .get('/orders/:id')
            .set('Authorization', `Bearer ${testToken}`)
            .send(response2.body[0]);
        // console.log(response.body);

        expect(response.status).toBe(200);
    });

    it('It should return 200 if order status with specific id is updated sucessfully', async (): Promise<void> => {
        const response3 = await request
            .get('/users')
            .set('Authorization', `Bearer ${testToken}`)
            .send(newuser);
        const userId: number = response3.body[0].id;
        const response2 = await request
            .get('/orders')
            .set('Authorization', `Bearer ${testToken}`)
            .send({ userId: userId.toString() });
        const id: string = response2.body[0].id.toString();
        const updatedOrderStatus: Orders = {
            order_status: 'complete',
            user_id: userId,
            order_date: time
        };
        const response = await request
            .put('/orders/:id')
            .set('Authorization', `Bearer ${testToken}`)
            .send({ id: id, status: updatedOrderStatus.order_status });
        // console.log(response.body);

        expect(response.status).toBe(200);
    });

    it('It should return 200 if order with status:complete is be displayed', async (): Promise<void> => {
        const response3 = await request
            .get('/users')
            .set('Authorization', `Bearer ${testToken}`)
            .send(newuser);
        const userId: string = response3.body[0].id.toString();
        const response = await request
            .get('/order-by-status/:status')
            .set('Authorization', `Bearer ${testToken}`)
            .send({ status: 'complete', id: userId });
        expect(response.status).toBe(200);
    });

    it('It should return 200 if product is successfully added to order', async (): Promise<void> => {
        const response3 = await request
            .get('/users')
            .set('Authorization', `Bearer ${testToken}`)
            .send(newuser);
        const userId: string = response3.body[0].id.toString();

        const response2 = await request
            .get('/orders')
            .set('Authorization', `Bearer ${testToken}`)
            .send({ userId: userId });
        const id: string = response2.body[0].id.toString();
        const qty = '20';

        await request
            .post('/products')
            .set('Authorization', `Bearer ${testToken}`)
            .send(newProduct);
        const response4 = await request.get('/products').send(newProduct);
        const pid = response4.body[0].id.toString();

        const response = await request
            .post('/order-product-cart')
            .set('Authorization', `Bearer ${testToken}`)
            .send({ oid: id, pid: pid, qty: qty });

        expect(response.status).toBe(200);
    });

    it('It should return 200 if product added to order is successfully viewed', async (): Promise<void> => {
        const response3 = await request
            .get('/users')
            .set('Authorization', `Bearer ${testToken}`)
            .send(newuser);
        const userId: string = response3.body[0].id.toString();

        const response2 = await request
            .get('/orders')
            .set('Authorization', `Bearer ${testToken}`)
            .send({ userId: userId });
        const id: string = response2.body[0].id.toString();

        const response = await request
            .get('/order-product-cart/:id')
            .set('Authorization', `Bearer ${testToken}`)
            .send({ order_id: id });

        expect(response.status).toBe(200);
        const conn = await client.connect();
        conn.query('DELETE FROM product_orders');
        conn.release();
    });
    it('It should return 200 if order with specific id is deleted successfully', async (): Promise<void> => {
        const response3 = await request
            .get('/users')
            .set('Authorization', `Bearer ${testToken}`)
            .send(newuser);
        const userId: number = response3.body[0].id;
        const response2 = await request
            .get('/orders')
            .set('Authorization', `Bearer ${testToken}`)
            .send({ userId: userId.toString() });
        const id: string = response2.body[0].id.toString();

        const response = await request
            .delete('/orders/:id')
            .set('Authorization', `Bearer ${testToken}`)
            .send({ id: id });
        // console.log(response.body);

        expect(response.status).toBe(200);

        const conn = await client.connect();
        conn.query('DELETE FROM orders');
        conn.query('DELETE FROM products');
        conn.query('DELETE FROM users');
        conn.release();
    });
});
