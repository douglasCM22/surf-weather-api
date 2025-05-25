import { SetupServer } from '@src/server';
import supertest from 'supertest';
import TestAgent from 'supertest/lib/agent';
import Test from 'supertest/lib/test';

declare global {
    var testRequest: TestAgent<Test>;
}

beforeAll(async () => {
    const server = new SetupServer();
    await server.init();

    global.testRequest = supertest(server.getApp());
});
