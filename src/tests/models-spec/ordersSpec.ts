import { OrderModel, Orders } from '../../models/orders';
import { UserModel, User } from '../../models/users';
import client from '../../database';
import { ProductModel } from '../../models/products';

const orderModel = new OrderModel();
const userModel = new UserModel();
const prodStore = new ProductModel();

describe('To test Order Model', () => {
    it('should have an index method', async (): Promise<void> => {
        expect(orderModel.index).toBeDefined();
    });
    it('should have a show method', () => {
        expect(orderModel.show).toBeDefined();
    });

    it('should have a create method', () => {
        expect(orderModel.create).toBeDefined();
    });

    it('should have a update method', () => {
        expect(orderModel.updateOrderStatus).toBeDefined();
    });

    it('should have a delete method', () => {
        expect(orderModel.delete).toBeDefined();
    });

    it('should show an order by status', () => {
        expect(orderModel.showOrderByStatus).toBeDefined();
    });
    it('should add a product to order', () => {
        expect(orderModel.addProdToCart).toBeDefined();
    });
    it('should show a product in an order', () => {
        expect(orderModel.ViewOrderProduct).toBeDefined();
    });
});

describe('To test Order Model Outputs', () => {
    const time = new Date().toLocaleString();

    it('create method should add a new order', async (): Promise<void> => {
        const a: User = {
            fname: 'katy',
            lname: 'jane',
            pword: '1234',
            email: 'kjiii@gmail.com'
        };
        const r1 = await userModel.create(a);
        if (r1.id !== undefined) {
            const userId: number = parseInt(r1.id);
            const uid: string = r1.id;
            const newOrder = {
                user_id: userId,
                order_date: time
            };
            // create new order
            const result = await orderModel.create(newOrder);
            expect(result.order_status).toEqual('active');
            expect(result.user_id).toEqual(userId);
            // delete order
            if (result.id !== undefined) {
                await orderModel.delete(result.id);
                // delete user
                await userModel.delete(uid);
            }
        }
    });

    it('it should return all orders', async (): Promise<void> => {
        const a: User = {
            fname: 'katy',
            lname: 'jane',
            pword: '1234',
            email: 'kjiii@gmail.com'
        };
        const r1 = await userModel.create(a);
        if (r1.id !== undefined) {
            const userId: number = parseInt(r1.id);
            const uid: string = r1.id;
            const newOrder = {
                user_id: userId,
                order_date: time
            };
            const newOrder2 = {
                user_id: userId,
                order_date: time
            };
            // create 2 new orders
            const result = await orderModel.create(newOrder);
            const result2 = await orderModel.create(newOrder2);
            // test to show all users--to expect length of 2
            const result3 = await orderModel.index(uid);
            expect(result3.length).toEqual(2);
            // delete orders
            if (result.id !== undefined && result2.id !== undefined) {
                await orderModel.delete(result.id);
                await orderModel.delete(result2.id);

                // delete user
                await userModel.delete(uid);
            }
        }
    });

    it('it should return a specific order detail', async (): Promise<void> => {
        const a: User = {
            fname: 'katy',
            lname: 'jane',
            pword: '1234',
            email: 'kjiii@gmail.com'
        };
        const r1 = await userModel.create(a);
        if (r1.id !== undefined) {
            const userId: number = parseInt(r1.id);
            const uid: string = r1.id;
            const newOrder = {
                user_id: userId,
                order_date: time
            };
            const newOrder2 = {
                user_id: userId,
                order_date: time
            };
            // create 2 new orders
            const result = await orderModel.create(newOrder);
            const result2 = await orderModel.create(newOrder2);

            // delete orders
            if (result.id !== undefined && result2.id !== undefined) {
                // test to show user with id=result2.id
                const result3 = await orderModel.show(result2.id);
                expect(result.user_id).toEqual(userId);
                expect(result.order_status).toEqual('active');

                await orderModel.delete(result.id);
                await orderModel.delete(result2.id);

                // delete user
                await userModel.delete(uid);
            }
        }
    });

    it('it should show order by status active', async (): Promise<void> => {
        const a: User = {
            fname: 'katy',
            lname: 'jane',
            pword: '1234',
            email: 'kjiii@gmail.com'
        };
        const r1 = await userModel.create(a);
        if (r1.id !== undefined) {
            const userId: number = parseInt(r1.id);
            const uid: string = r1.id;
            const newOrder = {
                user_id: userId,
                order_date: time
            };
            const newOrder2 = {
                user_id: userId,
                order_date: time
            };
            // create 2 new orders
            const result = await orderModel.create(newOrder);
            const result2 = await orderModel.create(newOrder2);
            // test to show all users with status active
            const result3 = await orderModel.showOrderByStatus('active', uid);
            expect(result3.length).toEqual(2);
            // delete orders
            if (result.id !== undefined && result2.id !== undefined) {
                await orderModel.delete(result.id);
                await orderModel.delete(result2.id);

                // delete user
                await userModel.delete(uid);
            }
        }
    });

    it('it should add product to order', async (): Promise<void> => {
        const a: User = {
            fname: 'katy',
            lname: 'jane',
            pword: '1234',
            email: 'kjiii@gmail.com'
        };
        const newProduct = {
            name: 'Michael Kors Bag',
            price: 51000,
            category: 'mens wear'
        };
        const r1 = await userModel.create(a);
        const p = await prodStore.create(newProduct);
        if (r1.id !== undefined && p.id !== undefined) {
            const userId: number = parseInt(r1.id);
            const uid: string = r1.id;
            const newOrder = {
                user_id: userId,
                order_date: time
            };
            // create 2 new orders
            const result = await orderModel.create(newOrder);
            if (result.id !== undefined) {
                const qty: string = '50';
                // add product to cart
                const result2 = await orderModel.addProdToCart(
                    result.id,
                    p.id,
                    qty
                );
                expect(result2.quantity).toEqual(50);
                expect(result2.prod_id).toEqual(p.id);
                expect(result2.order_id).toEqual(result.id);
                // console.log(result2);

                // delete from productOrders table
                const conn = await client.connect();
                await conn.query('DELETE FROM product_orders;');
                conn.release();
                // delete order
                await orderModel.delete(result.id);

                // delete prod
                await prodStore.delete(p.id);
                // delete user
                await userModel.delete(uid);
            }
        }
    });

    it('it should update order status detail', async (): Promise<void> => {
        const a: User = {
            fname: 'katy',
            lname: 'jane',
            pword: '1234',
            email: 'kjiii@gmail.com'
        };
        const r1 = await userModel.create(a);
        if (r1.id !== undefined) {
            const userId: number = parseInt(r1.id);
            const uid: string = r1.id;
            const newOrder = {
                user_id: userId,
                order_date: time
            };

            const updatedOrderStatus: Orders = {
                order_status: 'complete',
                user_id: userId,
                order_date: time
            };

            // create new order
            const result = await orderModel.create(newOrder);

            if (result.id !== undefined) {
                // update status order
                const result2 = await orderModel.updateOrderStatus(
                    result.id,
                    updatedOrderStatus
                );
                expect(result2.order_status).toEqual('complete');

                // delete order
                await orderModel.delete(result.id);
                // delete user
                await userModel.delete(uid);
            }
        }
    });

    it('it should view product in order', async (): Promise<void> => {
        const a: User = {
            fname: 'katy',
            lname: 'jane',
            pword: '1234',
            email: 'kjiii@gmail.com'
        };
        const newProduct = {
            name: 'Michael Kors Bag',
            price: 51000,
            category: 'mens wear'
        };
        const r1 = await userModel.create(a);
        const p = await prodStore.create(newProduct);
        if (r1.id !== undefined && p.id !== undefined) {
            const userId: number = parseInt(r1.id);
            const uid: string = r1.id;
            const newOrder = {
                user_id: userId,
                order_date: time
            };
            // create 2 new orders
            const result = await orderModel.create(newOrder);
            if (result.id !== undefined) {
                const qty: string = '50';
                // add product to cart
                const result2 = await orderModel.addProdToCart(
                    result.id,
                    p.id,
                    qty
                );

                // view product in cart
                if (result2.id !== undefined) {
                    const r2 = await orderModel.ViewOrderProduct(result.id);
                    expect(r2.length).toEqual(1);
                }

                // delete from productOrders table
                const conn = await client.connect();
                await conn.query('DELETE FROM product_orders;');
                // delete order
                await orderModel.delete(result.id);

                // delete prod
                await prodStore.delete(p.id);
                // delete user
                await userModel.delete(uid);
            }
        }
    });

    it('it should delete specific order with id:1', async (): Promise<void> => {
        const a: User = {
            fname: 'katy',
            lname: 'jane',
            pword: '1234',
            email: 'kjiii@gmail.com'
        };
        const r1 = await userModel.create(a);
        if (r1.id !== undefined) {
            const userId: number = parseInt(r1.id);
            const uid: string = r1.id;
            const newOrder = {
                user_id: userId,
                order_date: time
            };
            const newOrder2 = {
                user_id: userId,
                order_date: time
            };
            // create 2 new orders
            const result = await orderModel.create(newOrder);
            const result2 = await orderModel.create(newOrder2);

            if (result.id !== undefined && result2.id !== undefined) {
                // delete orders
                await orderModel.delete(result.id);
                const result3 = await orderModel.index(r1.id);
                expect(result3.length).toEqual(1);
                await orderModel.delete(result2.id);

                // delete user
                await userModel.delete(uid);
            }
        }
    });
});
