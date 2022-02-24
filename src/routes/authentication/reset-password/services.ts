import * as query from '../../../database/DBQuery'
import { createError, ErrorType } from '../../../errors/createError';
import { IUser } from '../../../interfaces';

export const getUser = async (userParam: any): Promise<IUser> => {
  const response = await query.getUser(userParam);
  return response[0];
}

export const update = async (userId: number, newPassword: string) => {
    const response = await query.updateUser(userId, {
        password: newPassword
    })
    
    if (response.affectedRows === 1) {
        return true
    }

    return false
}