import supertest from 'supertest';
import app from '../../server';
import { ProductModel, Product } from '../../models/products';
import client from '../../database';

const request = supertest(app);

describe('To test ProductRoutes', () => {
    // let token:string;
    const testToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRhZUBnbWFpbC5jb20iLCJmbmFtZSI6InRhZSIsImxuYW1lIjoiaHl1bmciLCJpYXQiOjE2NzUxNzI2NDl9.ljIBD0eY9tfePqzmrap_43hP2D7NazJRtGU7Q_DiVpo';

    const newProduct: Product = {
        name: 'Michael Kors Bag',
        price: 51000,
        category: 'mens wear'
    };

    it('It should return 200 if product is properly created', async (): Promise<void> => {
        const response = await request
            .post('/products')
            .set('Authorization', `Bearer ${testToken}`)
            .send(newProduct);
        expect(response.status).toBe(200);
        // console.log(response.body);
    });
    it('It should return 200 if product List is displayed', async (): Promise<void> => {
        const response2 = await request.get('/products').send(newProduct);
        expect(response2.status).toBe(200);
    });

    it('It should return 200 if product with specific id is displayed', async (): Promise<void> => {
        const response2 = await request.get('/products').send(newProduct);
        // console.log(response2.body[0]);

        const response = await request
            .get('/products/:id')
            .send(response2.body[0]);
        // console.log(response.body);

        expect(response.status).toBe(200);
    });

    it('It should return 200 if product with category:mens wear is be displayed', async (): Promise<void> => {
        const response = await request
            .get('/product-by-category/:cat')
            .set('Authorization', `Bearer ${testToken}`)
            .send({ cat: 'mens wear' });
        expect(response.status).toBe(200);
    });

    it('It should return 200 if product with specific id is updated sucessfully', async (): Promise<void> => {
        const response2 = await request.get('/products').send(newProduct);
        let id = response2.body[0].id.toString();
        //    console.log(id);
        const newupdatedProd: Product = {
            id: id,
            name: 'Valentino Suitecase',
            price: 81000,
            category: 'mens wear'
        };
        const response = await request
            .put('/products/:id')
            .set('Authorization', `Bearer ${testToken}`)
            .send(newupdatedProd);
        // console.log(response.body);

        expect(response.status).toBe(200);
    });

    it('It should return 200 if product with specific id is deleted successfully', async (): Promise<void> => {
        const response2 = await request.get('/products').send(newProduct);
        // console.log(response2.body[0]);

        const response = await request
            .delete('/products/:id')
            .set('Authorization', `Bearer ${testToken}`)
            .send(response2.body[0]);
        // console.log(response.body);

        expect(response.status).toBe(200);
        const conn = await client.connect();
        conn.query('DELETE FROM products');
        conn.release();
    });
});
