import client from '../database';
import bcrypt from 'bcrypt';
import { PoolClient } from 'pg';

const { BCRYPT_PASSWORD, SALT_ROUNDS } = process.env;

export type User = {
    id?: string;
    fname: string;
    lname: string;
    pword: string;
    email: string;
};

export class UserModel {
    // INDEX
    //  @ts-ignore
    async index(): Promise<User[]> {
        try {
            const conn = await client.connect();
            const sql = 'SELECT * FROM users';

            const result = await conn.query(sql);
            conn.release();

            return result.rows;
        } catch (err) {
            throw new Error(`Cannot show Users List: ${err}`);
        }
    }

    // CREATE
    async create(u: User): Promise<User> {
        try {
            const sql =
                'INSERT INTO users (fname,lname,email,pasword) VALUES($1, $2,$3,$4) RETURNING *';
            //  @ts-ignore
            const conn = await client.connect();
            //  @ts-ignore
            const hash = bcrypt.hashSync(
                u.pword + BCRYPT_PASSWORD,
                parseInt(SALT_ROUNDS as string, 10)
            );
            // console.log(hash);
            //     // json(hash);
            const result = await conn.query(sql, [
                u.fname,
                u.lname,
                u.email,
                hash
            ]);
            const user = result.rows[0];

            conn.release();
            return user;
        } catch (err) {
            // console.log(err);
            throw new Error(`unable create user: ${err}`);
        }
    }

    //AUTHENTICATE
    async authenticate(email: string, password: string) {
        try {
            const conn = await client.connect();
            const sql = 'SELECT pasword FROM users WHERE email=($1)';
            const result = await conn.query(sql, [email]);

            if (result.rows.length) {
                const user = result.rows[0];
                if (
                    bcrypt.compareSync(password + BCRYPT_PASSWORD, user.pasword)
                ) {
                    conn.release();
                    return user;
                } else {
                    throw new Error(`Password is incorrect.`);
                }
            } else {
                throw new Error(`unable to authenticate user.`);
            }
        } catch (err) {
            throw new Error(`unable to Authenticate user: ${err}`);
        }
    }

    // DELETE
    async delete(uid: string): Promise<Boolean> {
        try {
            const sql = 'DELETE FROM users WHERE id=($1)RETURNING *;';
            const conn = await client.connect();
            const result = await conn.query(sql, [uid]);
            // try{
            if (result.rows.length) {
                conn.release();
                return true;
            } else {
                return false;
            }
        } catch (err) {
            throw new Error(`Could not Delete User, ${err}`);
        }
    }

    //   SHOW
    async show(id: string): Promise<User> {
        try {
            const conn = await client.connect();
            const sql = 'SELECT * FROM users WHERE id=($1)';
            const result = await conn.query(sql, [id]);

            if (result.rows.length) {
                conn.release();
                return result.rows[0];
            } else {
                throw new Error(`Could not find User.`);
            }
        } catch (err) {
            throw new Error(`Could not show user details, ${err}`);
        }
    }

    // UPDATE
    async updateUser(id: string, u: User): Promise<User> {
        try {
            // @ts-ignore
            const conn = await client.connect();
            const sql =
                'UPDATE users SET fname=($1),lname=($2), pasword=($3) WHERE id=($4) AND email=($5) RETURNING *';

            const hash = bcrypt.hashSync(
                u.pword + BCRYPT_PASSWORD,
                parseInt(SALT_ROUNDS as string, 10)
            );
            const result = await conn.query(sql, [
                u.fname,
                u.lname,
                hash,
                id,
                u.email
            ]);

            if (!result.rows.length) {
                throw new Error(
                    `Could not find user to update. check email or id`
                );
            }
            // console.log(result.rows.length);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not update user. Error: ${err}`);
        }
    }
}
