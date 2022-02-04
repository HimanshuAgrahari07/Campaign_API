import runQuery from '../../../database/Database'
import { RESOLUTIONS_TABLE_NAME } from '../../../utils/const'

export const getAllResolutions = async () => {
    const query = `Select * from ${RESOLUTIONS_TABLE_NAME}`;
    return await runQuery(query)
}