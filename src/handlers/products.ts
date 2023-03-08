import express, { Request, Response } from 'express';
import verifyAuthToken from '../middleware/auth_token';
import { ProductModel, Product } from '../models/products';

const productModel = new ProductModel();

const index = async (_req: Request, res: Response) => {
    try {
        const ProductList = await productModel.index();
        res.status(200).json(ProductList);
    } catch (err) {
        res.status(401).json(`Unable to Show List of Products. ${err}`);
    }
};

// CREATE
const create = async (req: Request, res: Response) => {
    const product: Product = {
        name: req.body.name,
        price: req.body.price,
        category: req.body.category
    };
    if (!req.body.name || !req.body.category || !req.body.price) {
        return res.status(400).json({
            error: 'Please include price name, price and category'
        });
    }
    try {
        await productModel.create(product);
        res.json('Product created successfully');
    } catch (err) {
        res.status(400).json(`Cannot create Product. ${err}`);
    }
};

// SHOW
const show = async (req: Request, res: Response) => {
    try {
        const product = await productModel.show(req.body.id);
        res.json(product);
    } catch (err) {
        res.status(401).json(
            `Unable to show details for this specific product. ${err}`
        );
    }
};

// DELETE
const destroy = async (req: Request, res: Response) => {
    try {
        const del = await productModel.delete(req.body.id);
        // res.json(del);
        if (del == true) {
            res.status(200).json({
                status: `Deleted product with id: ${req.body.id}`
            });
        } else {
            res.status(400).json(`Could not find product to delete.`);
        }
    } catch (error) {
        res.status(400).json(`unable to delete product, ${error}`);
    }
};

// UPDATE
const update = async (req: Request, res: Response) => {
    const prod: Product = {
        name: req.body.name,
        price: req.body.price,
        category: req.body.cat
    };
    try {
        await productModel.updateProduct(req.body.id, prod);
        res.status(200).json({
            status: `Successfully Updated Product details.`
        });
    } catch (err) {
        res.status(401).json(`Unable to update product. ${err}`);
    }
};

// SHOW PRODUCT BY CATEGORY
const showProductByCategory = async (req: Request, res: Response) => {
    try {
        const productCategory = await productModel.showProductByCategory(
            req.body.cat
        );
        res.json(productCategory);
    } catch (err) {
        res.status(401).json(
            `Unable to show details for product in this category. ${err}`
        );
    }
};

//PRODUCT ROUTES
const productRoutes = (app: express.Application) => {
    app.get('/products', index);
    app.get('/products/:id', show);
    app.post('/products', verifyAuthToken, create);
    app.put('/products/:id', verifyAuthToken, update);
    app.delete('/products/:id', verifyAuthToken, destroy);
    app.get(
        '/product-by-category/:cat',
        verifyAuthToken,
        showProductByCategory
    );
};

export default productRoutes;
