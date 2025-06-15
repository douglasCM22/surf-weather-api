import { User } from '@src/models/usersModel';
import c from 'config';

describe('Users functional tests', () => {
    beforeEach(async () => {
        await User.deleteMany({});
    });

    describe('Create new user', () => {
        it('should create a new user', async () => {
            const newUser = {
                username: 'testuser',
                email: 'testemail@example.com',
                password: 'testpassword123',
            };

            const response = await global.testRequest
                .post('/users')
                .send(newUser);

            expect(response.status).toBe(201);
            expect(response.body).toEqual(expect.objectContaining(newUser));
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
    });
});
