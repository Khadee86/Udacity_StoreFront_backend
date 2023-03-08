import { ProductModel, Product } from '../../models/products';

const prodStore = new ProductModel();

describe('To test Product Model', () => {
    it('should have an index method', async (): Promise<void> => {
        expect(prodStore.index).toBeDefined();
    });
    it('should have a show method', () => {
        expect(prodStore.show).toBeDefined();
    });

    it('should have a create method', () => {
        expect(prodStore.create).toBeDefined();
    });

    it('should have a update method', () => {
        expect(prodStore.updateProduct).toBeDefined();
    });

    it('should have a delete method', () => {
        expect(prodStore.delete).toBeDefined();
    });

    it('should have a showProduct by category method', () => {
        expect(prodStore.showProductByCategory).toBeDefined();
    });
});

describe('To test Product Model Outputs', () => {
    const newProduct = {
        name: 'Michael Kors Bag',
        price: 51000,
        category: 'mens wear'
    };
    it('create method should add a new product', async (): Promise<void> => {
        const result = await prodStore.create(newProduct);
        expect(result.name).toEqual(newProduct.name);
        expect(result.category).toEqual(newProduct.category);
        expect(result.price).toEqual(newProduct.price);
    });

    it('it should return a specific product detail', async (): Promise<void> => {
        const newProduct2 = {
            name: 'Hermes Slippers',
            price: 54000,
            category: 'womens wear'
        };
        const r1 = await prodStore.create(newProduct2);
        if (r1.id !== undefined) {
            const pid: string = r1.id;
            const result = await prodStore.show(pid);
            expect(result.name).toEqual('Hermes Slippers');
            expect(result.price).toEqual(54000);
            expect(result.category).toEqual('womens wear');
            await prodStore.delete(pid);
        }
    });

    it('it should show Product by category mens wear', async (): Promise<void> => {
        const DemoUser = {
            name: 'mini loofers',
            category: 'childrens wear',
            price: 3000
        };
        const result = await prodStore.create(DemoUser);
        if (result.id !== undefined) {
            const pid: string = result.id;
            const result3 = await prodStore.showProductByCategory('mens wear');
            expect(result3.length).toEqual(1);
            // console.log(result3);
            await prodStore.delete(pid);
        }
    });

    it('it should update product detail', async (): Promise<void> => {
        const newProduct2 = {
            name: 'Hermes Slippers',
            price: 54000,
            category: 'womens wear'
        };
        const r1 = await prodStore.create(newProduct2);
        if (r1.id !== undefined) {
            const pid: string = r1.id;

            const updatedProd: Product = {
                name: 'Gucci Shoes',
                category: 'mens wear',
                price: 35000
            };
            const result = await prodStore.updateProduct(pid, updatedProd);
            expect(result.name).toEqual('Gucci Shoes');
            expect(result.category).toEqual('mens wear');
            expect(result.price).toEqual(35000);
            // console.log(result);
            await prodStore.delete(pid);
        }
    });

    it('it should delete specific Product with id:2', async (): Promise<void> => {
        const newProduct2 = {
            name: 'tote bag',
            price: 4000,
            category: 'womens wear'
        };
        const r1 = await prodStore.create(newProduct2);
        if (r1.id !== undefined) {
            const pid: string = r1.id;
            await prodStore.delete(pid);
            const result2 = await prodStore.index();
            expect(result2.length).toEqual(1);
            // console.log(result2);
        }
    });

    it('it should return all products', async (): Promise<void> => {
        const result = await prodStore.index();
        expect(result.length).toEqual(1);
        // console.log(result);
    });
});
