import * as query from '../../../database/DBQuery'

export const getAllResolutions = async () => {
    return await query.getAllResolutions()
}

export const getOne = async (id: number) => {
    return await query.getResolutionsById(id)
}