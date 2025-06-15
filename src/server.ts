import { Server } from '@overnightjs/core';
import './utils/module-alias';
import bodyParser from 'body-parser';
import { ForecastController } from '@src/controllers/forecastController';
import { Application } from 'express';
import * as database from '@src/database';
import { BeachesController } from '@src/controllers/beachesController';
import { UsersController } from '@src/controllers/usersController';

export class SetupServer extends Server {
    constructor(private port: number = 3000) {
        super();
    }

    public async init(): Promise<void> {
        this.setupExpress();
        await this.setupDatabase();
        this.setupControllers();
    }

    public start(): void {
        this.app.listen(this.port, () => {
            console.info(`Server listening on port: ${this.port}`);
        });
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
        const usersController = new UsersController();
        this.addControllers([
            forecastController,
            beachesController,
            usersController,
        ]);
    }

    private async setupDatabase(): Promise<void> {
        await database.connect();
    }

    public async close(): Promise<void> {
        await database.close();
    }
}
