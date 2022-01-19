import runQuery from '../database/Database'
import { COUNTRIES_TABLE_NAME } from '../utils/const'

class CountriesServices {
    private table: string;

    constructor() {
        this.table = COUNTRIES_TABLE_NAME
    }

    private query = async (query: string): Promise<any> => {
        return await runQuery(query)
    }

    getAllCountries = async () => {
        const query = `Select * from ${this.table}`;
        return await this.query(query)
    }
}

export default CountriesServices;