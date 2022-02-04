import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import errorMiddleware from './middlewares/error.middleware';
import loggerMiddleware from './middlewares/logger.middleware'
import routes from './routes'
class App {
  public app: express.Application;

  constructor() {
    this.app = express();

    this.initializeMiddleware();
    this.initializeRouters(routes);
    this.initializeErrorHandling();
  }

  public listen() {
    this.app.listen(process.env.PORT, () => {
      console.log(`App listening on the port ${process.env.PORT}`);
    });
  }

  public getServer() {
    return this.app;
  }

  private initializeMiddleware() {
    this.app.use(bodyParser.json());
    this.app.use(loggerMiddleware)
    this.app.use(cookieParser());
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private initializeRouters(router: express.Router) {
    this.app.use('/', router)
  }
}

export default App;