import { SetupServer } from './server';
import config from 'config';

(async (): Promise<void> => {
    const server = new SetupServer(Number(config.get('App.port')));
    await server.init();
    server.start();
})();
