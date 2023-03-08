import { UserModel, User } from '../../models/users';

const userModel = new UserModel();

describe('To test User Model', () => {
    it('should have an index method', async (): Promise<void> => {
        expect(userModel.index).toBeDefined();
    });
    it('should have a show method', () => {
        expect(userModel.show).toBeDefined();
    });

    it('should have a create method', () => {
        expect(userModel.create).toBeDefined();
    });

    it('should have a update method', () => {
        expect(userModel.updateUser).toBeDefined();
    });

    it('should have a delete method', () => {
        expect(userModel.delete).toBeDefined();
    });
    it('should have an authenticate method', () => {
        expect(userModel.authenticate).toBeDefined();
    });
});

describe('To test User Model Outputs', () => {
    const newUser = {
        fname: 'khadijah',
        lname: 'badmos',
        pword: '123',
        email: 'kb4@gmail.com'
    };
    it('create method should add a user', async (): Promise<void> => {
        const result = await userModel.create(newUser);
        expect(result.fname).toEqual('khadijah');
        expect(result.lname).toEqual('badmos');
        expect(result.email).toEqual('kb4@gmail.com');
        // console.log(result);
    });
    it('it should return a specific user', async (): Promise<void> => {
        const a: User = {
            fname: 'katy',
            lname: 'jane',
            pword: '1234',
            email: 'kjiii@gmail.com'
        };
        const r1 = await userModel.create(a);
        if (r1.id !== undefined) {
            const uid: string = r1.id;
            // console.log(uid);
            const result = await userModel.show(uid.toString());
            expect(result.fname).toEqual('katy');
            expect(result.lname).toEqual('jane');
            expect(result.email).toEqual('kjiii@gmail.com');
            // console.log(result);
            await userModel.delete(uid);
        }
    });
    it('it should update user detail', async (): Promise<void> => {
        const b: User = {
            fname: 'kamil',
            lname: 'badmos',
            pword: '127',
            email: 'abc@gmail.com'
        };
        const r1 = await userModel.create(b);
        if (r1.id !== undefined) {
            const uid: string = r1.id;
            const updatedUser: User = {
                fname: 'kamil',
                lname: 'Ibrahim',
                pword: '127',
                email: 'abc@gmail.com'
            };
            const result = await userModel.updateUser(
                uid.toString(),
                updatedUser
            );
            expect(result.fname).toEqual('kamil');
            expect(result.lname).toEqual('Ibrahim');
            // console.log(result);
            await userModel.delete(uid);
        }
    });

    it('it should delete specific user with id:2', async (): Promise<void> => {
        const b: User = {
            fname: 'Shawn',
            lname: 'Mendes',
            pword: '127',
            email: 'shawn@gmail.com'
        };
        const r1 = await userModel.create(b);
        if (r1.id !== undefined) {
            const uid: string = r1.id;
            await userModel.delete(uid);
            const result2 = await userModel.index();
            expect(result2.length).toEqual(1);
            // console.log(result2);
            await userModel.delete(uid);
        }
    });

    it('it should authenticate a user', async (): Promise<void> => {
        const DemoUser = {
            fname: 'Hafiz',
            lname: 'Lawal',
            pword: '1310',
            email: 'ha@gmail.com'
        };
        const result = await userModel.create(DemoUser);
        if (result.id !== undefined) {
            const uid: string = result.id;
            const result3 = await userModel.authenticate(
                DemoUser.email,
                DemoUser.pword
            );
            expect(result).toEqual(jasmine.objectContaining(result3));
            await userModel.delete(uid);
        }
    });
    it('it should return all users', async (): Promise<void> => {
        const result = await userModel.index();
        expect(result.length).toEqual(1);
        // console.log(result);
    });
});
