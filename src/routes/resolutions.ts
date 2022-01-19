import { Router } from 'express';
import RoutersI from '../interfaces/router.interface';
import ResolutionsController from './../controllers/resolutions.controller';

class ResolutionsRoutes implements RoutersI {
    public router: Router;
    public path = '/resolutions';
    private controller = new ResolutionsController();
    private getAll = this.controller.getAll;

    constructor() {
        this.router = Router()
        this.initRoute();
    }

    private initRoute() {
        this.router.get(this.path, this.getAll);
    }
}

export default ResolutionsRoutes;