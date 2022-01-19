import { Request, Response, NextFunction } from 'express';
import { SuccessResponse } from '../utils/const';
import HttpException from '../exceptions/HttpException';
import CountriesServices from '../services/countries.services'

class CountriesController {
    private services = new CountriesServices();

    getAll = async (request: Request, response: Response, next: NextFunction) => {
        const responseFromDB = await this.services.getAllCountries().catch(err => next(new HttpException(err.message)));

        if (responseFromDB) {
            SuccessResponse(request, response, responseFromDB)
        }
    }
}

export default CountriesController;
