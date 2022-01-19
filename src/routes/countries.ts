import { Router } from 'express';
import RoutersI from '../interfaces/router.interface';
import CountriesController from './../controllers/countries.controller';

class CountriesRoutes implements RoutersI {
    public router: Router;
    public path = '/countries';
    private controller = new CountriesController();
    private getAll = this.controller.getAll;

    constructor() {
        this.router = Router()
        this.initRoute();
    }

    private initRoute() {
        this.router.get(this.path, this.getAll);
    }
}

export default CountriesRoutes;