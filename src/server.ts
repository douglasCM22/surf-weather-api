import { Server } from '@overnightjs/core';
import './utils/module-alias';
import bodyParser from 'body-parser';
import { ForecastController } from './controllers/forecastController';
import { Application } from 'express';

export class SetupServer extends Server {
    
    constructor(private port: number = 3000) {
        super();
    }

    public async init(): Promise<void> {
        this.setupExpress();
        this.setupControllers();
        this.app.listen(this.port, () => {
            console.info(`Server listening on port ${this.port}`);
        });
    }

    public getApp(): Application {
        return this.app;
    }

    private setupExpress(): void {
        this.app.use(bodyParser.json());
    }

    private setupControllers(): void {
        const forecastController = new ForecastController();
        this.addControllers([forecastController]);
    }
}