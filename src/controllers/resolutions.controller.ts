import { Request, Response, NextFunction } from 'express';
import { SuccessResponse } from '../utils/const';
import HttpException from '../exceptions/HttpException';
import ResolutionsServices from '../services/resolutions.services'

class ResolutionsController {
    private services = new ResolutionsServices();

    getAll = async (request: Request, response: Response, next: NextFunction) => {
        const responseFromDB = await this.services.getAllResolutions().catch(err => next(new HttpException(err.message)));

        if (responseFromDB) {
            SuccessResponse(request, response, responseFromDB)
        }
    }
}

export default ResolutionsController;
