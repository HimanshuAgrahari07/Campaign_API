import runQuery from '../database/Database'
import { RESOLUTIONS_TABLE_NAME } from '../utils/const'

class ResolutionsServices {
    private table: string;

    constructor() {
        this.table = RESOLUTIONS_TABLE_NAME
    }

    private query = async (query: string): Promise<any> => {
        return await runQuery(query)
    }

    getAllResolutions = async () => {
        const query = `Select * from ${this.table}`;
        return await this.query(query)
    }
}

export default ResolutionsServices;