import { User } from '@src/models/usersModel';
import AuthService from '@src/services/auth';

describe('Users functional tests', () => {
    beforeEach(async () => {
        await User.deleteMany({});
    });

    describe('Create new user', () => {
        it('should create a new user with encrypted password', async () => {
            const newUser = {
                username: 'testuser',
                email: 'testemail@example.com',
                password: 'testpassword123',
            };

            const response = await global.testRequest
                .post('/users')
                .send(newUser);

            expect(response.status).toBe(201);
            await expect(AuthService.comparePassword(newUser.password, response.body.password)).toBeTruthy();
            expect(response.body).toEqual(expect.objectContaining({ ...newUser, ...{ password: expect.any(String) } }));
        });

        it('should return 400 when there is a validation error', async () => {
            const newUser = {
                username: 'testuser',
                email: 'testemail@example.com',
            };

            const response = await global.testRequest
                .post('/users')
                .send(newUser);
            expect(response.status).toBe(422);
            expect(response.body).toEqual({
                code: 422,
                error: 'User validation failed: password: Path `password` is required.',
            });
        });

        it('should return 409 when the email already exists', async () => {
            const newUser = {
                username: 'testuser',
                email: 'testemail@example.com',
                password: 'testpassword123',
            };
            await global.testRequest.post('/users').send(newUser);
            const response = await global.testRequest
                .post('/users')
                .send(newUser);

            expect(response.status).toBe(409);
            expect(response.body).toEqual({
                code: 409,
                error: 'User validation failed: email: Email already exists',
            });
        });
    });

    describe('when authenticating a user', () => {
        test('should generate a token for a valid user', async () => {
            const newUser = {
                username: 'testuser',
                email: 'testemail@example.com',
                password: 'testpassword123',
            };

            console.error(newUser);
            await new User(newUser).save();
            const response = await global.testRequest
                .post('/users/authenticate')
                .send({ email: newUser.email, password: newUser.password });

            expect(response.body).toEqual(
                expect.objectContaining({ token: expect.any(String) })
            );
        }, 10000);
    });
});
