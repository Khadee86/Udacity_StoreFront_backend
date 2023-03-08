import express, { Request, Response } from 'express';
import verifyAuthToken from '../middleware/auth_token';
import { OrderModel, Orders } from '../models/orders';

const orderModel = new OrderModel();

// INDEX
const index = async (req: Request, res: Response) => {
    try {
        const OrderList = await orderModel.index(req.body.userId);
        res.status(200).json(OrderList);
    } catch (err) {
        res.status(401).json(`Unable to Show List of all Orders. ${err}`);
    }
};

// // CREATE
const create = async (req: Request, res: Response) => {
    const time = new Date().toLocaleString();
    const order: Orders = {
        // order_status:req.body.status,
        user_id: req.body.userId,
        order_date: time
    };
    try {
        await orderModel.create(order);
        res.json('Order created successfully');
    } catch (err) {
        res.status(400).json(`Cannot create Order. ${err}`);
    }
};

// UPDATE
const update = async (req: Request, res: Response) => {
    const time = new Date().toISOString();
    const order: Orders = {
        order_status: req.body.status,
        user_id: 0,
        order_date: time
    };
    try {
        await orderModel.updateOrderStatus(req.body.id, order);
        res.status(200).json({ status: `Successfully Updated Order Status.` });
    } catch (err) {
        res.status(401).json(`Unable to update order status. ${err}`);
    }
};

// SHOW
const show = async (req: Request, res: Response) => {
    try {
        const order = await orderModel.show(req.body.id);
        res.json(order);
    } catch (err) {
        res.status(401).json(
            `Unable to show details for this specific Order. ${err}`
        );
    }
};

// DELETE
const destroy = async (req: Request, res: Response) => {
    try {
        const del = await orderModel.delete(req.body.id);
        // res.json(del);
        if (del == true) {
            res.status(200).json({
                status: `Deleted order with id: ${req.body.id}`
            });
        } else {
            res.status(400).json(`Could not find order to delete.`);
        }
    } catch (error) {
        res.status(400).json(`unable to delete order, ${error}`);
    }
};

// SHOW order by status
// cat=active or complete
const showOrderByStatus = async (req: Request, res: Response) => {
    try {
        const orderStats = await orderModel.showOrderByStatus(
            req.body.status,
            req.body.id
        );
        res.json(orderStats);
    } catch (err) {
        res.status(401).json(
            `Unable to show details for this specific Order. ${err}`
        );
    }
};

// ADD PRODUCT TO ORDER
const addProdToCart = async (req: Request, res: Response) => {
    try {
        await orderModel.addProdToCart(
            req.body.oid,
            req.body.pid,
            req.body.qty
        );
        //
        res.json('product added to order successfully');
    } catch (err) {
        res.status(400).json(`Cannot add product to Order cart. ${err}`);
    }
};

// view product in order
const viewProdInOrder = async (req: Request, res: Response) => {
    try {
        const orderProd = await orderModel.ViewOrderProduct(req.body.order_id);
        res.json(orderProd);
    } catch (err) {
        res.status(401).json(
            `Unable to show Products in this specific Order. ${err}`
        );
    }
};

//ORDER ROUTES
const orderRoutes = (app: express.Application) => {
    app.get('/orders', verifyAuthToken, index);
    app.get('/orders/:id', verifyAuthToken, show);
    app.post('/orders', verifyAuthToken, create);
    app.put('/orders/:id', verifyAuthToken, update);
    app.delete('/orders/:id', verifyAuthToken, destroy);
    app.get('/order-by-status/:status', verifyAuthToken, showOrderByStatus);
    app.post('/order-product-cart', verifyAuthToken, addProdToCart);
    app.get('/order-product-cart/:id', verifyAuthToken, viewProdInOrder);
};

export default orderRoutes;
