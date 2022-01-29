import SignUpUserDto from './../../dtos/signup.dto';
import runQuery from './../../database/Database'
import { USERS_TABLE_NAME, ORGANIZATION_TABLE_NAME } from './../../utils/const'

class ChangePasswordServices {
    constructor() {
    }

    private query = async (query: string, parameters?: any[]): Promise<any> => {
        return await runQuery(query, parameters)
    }

    addUser = async (body: SignUpUserDto) => {
    }
}

export default ChangePasswordServices;