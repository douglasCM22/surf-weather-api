import { Server } from '@overnightjs/core';
import './utils/module-alias';
import bodyParser from 'body-parser';
import { ForecastController } from './controllers/forecastController';
import { Application } from 'express';
import * as database from './database';
import { BeachesController } from './controllers/beachesController';

export class SetupServer extends Server {
    constructor(private port: number = 3000) {
        super();
    }

    public async init(): Promise<void> {
        this.setupExpress();
        await this.setupDatabase();
        this.setupControllers();
    }

    public getApp(): Application {
        return this.app;
    }

    private setupExpress(): void {
        this.app.use(bodyParser.json());
        this.setupControllers();
    }

    private setupControllers(): void {
        const forecastController = new ForecastController();
        const beachesController = new BeachesController();
        this.addControllers([forecastController, beachesController]);
    }

    private async setupDatabase(): Promise<void> {
       await database.connect();
    }

    public async close(): Promise<void> {
        await database.close();
    }
}
