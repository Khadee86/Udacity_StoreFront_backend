import supertest from 'supertest';
import app from '../../server';
import { UserModel, User } from '../../models/users';
import client from '../../database';

const request = supertest(app);

describe('To test UserRoutes', () => {
    // let token:string;
    const testToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRhZUBnbWFpbC5jb20iLCJmbmFtZSI6InRhZSIsImxuYW1lIjoiaHl1bmciLCJpYXQiOjE2NzUxNzI2NDl9.ljIBD0eY9tfePqzmrap_43hP2D7NazJRtGU7Q_DiVpo';

    const user: User = {
        email: 'kim@gmail.com',
        pword: '5678',
        fname: 'kim',
        lname: 'seokjin'
    };

    it('It should return 200 if user is properly created', async (): Promise<void> => {
        const response = await request
            .post('/users')
            .set('Authorization', `Bearer ${testToken}`)
            .send(user);
        // console.log(response.body);
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(String);
    });
    it('It should return 200 if user List is displayed', async (): Promise<void> => {
        const response2 = await request
            .get('/users')
            .set('Authorization', `Bearer ${testToken}`)
            .send(user);
        expect(response2.status).toBe(200);
        // console.log(response2.body);
    });

    it('It should return 200 if user with specific id is displayed', async (): Promise<void> => {
        const response2 = await request
            .get('/users')
            .set('Authorization', `Bearer ${testToken}`)
            .send(user);
        // console.log(response2.body[0]);

        const response = await request
            .get('/users/:id')
            .set('Authorization', `Bearer ${testToken}`)
            .send(response2.body[0]);
        // console.log(response.body);

        expect(response.status).toBe(200);
    });

    it('It should return 200 if user is successfully authenticated', async (): Promise<void> => {
        const response = await request
            .post('/users/auth')
            .set('Authorization', `Bearer ${testToken}`)
            .send(user);
        console.log('token: ', response.body);
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(String);
    });

    it('It should return 200 if user with specific id is updated sucessfully', async (): Promise<void> => {
        const response2 = await request
            .get('/users')
            .set('Authorization', `Bearer ${testToken}`)
            .send(user);
        let id = response2.body[0].id.toString();
        const newupdatedUser: User = {
            id: id,
            email: 'kim@gmail.com',
            pword: '5698',
            fname: 'kim',
            lname: 'Namjoon'
        };
        const response = await request
            .put('/users/:id')
            .set('Authorization', `Bearer ${testToken}`)
            .send(newupdatedUser);
        console.log(response.body);

        expect(response.status).toBe(200);
    });

    it('It should return 200 if user with specific id is deleted successfully', async (): Promise<void> => {
        const response2 = await request
            .get('/users')
            .set('Authorization', `Bearer ${testToken}`)
            .send(user.id);
        // console.log(response2.body[0]);

        const response = await request
            .delete('/users/:id')
            .set('Authorization', `Bearer ${testToken}`)
            .send(response2.body[0]);
        // console.log(response.body);

        expect(response.status).toBe(200);
        const conn = await client.connect();
        conn.query('DELETE FROM users');
        conn.release();
    });
});
