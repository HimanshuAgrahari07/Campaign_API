import * as bodyParser from 'body-parser';
import * as express from 'express';
import errorMiddleware from './middlewares/error.middleware';
import loggerMiddleware from './middlewares/logger.middleware'
import RoutersI from './interfaces/router.interface';

class App {
  public app: express.Application;

  constructor(routes: RoutersI[]) {
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
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private initializeRouters(routes: RoutersI[]) {
    routes.forEach((route) => {
      this.app.use('/', route.router);
    });

    this.app.use(function (req, res) {
      // res.status(404).render('404.jade');
      res.status(404).json({ message: 'Route  not found', status: 404 });
    });
  }
}

export default App;