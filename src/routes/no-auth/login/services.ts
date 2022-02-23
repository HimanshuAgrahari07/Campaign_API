import * as query from '../../../database/DBQuery'
import SignInDto from '../../../dtos/signin.dto';
import { USERS_TABLE_NAME, ORGANIZATION_TABLE_NAME } from '../../../utils/const'
import hydratedUser from '../../../lib/hydrators/hydratorsUser'
import { createError, ErrorType } from '../../../errors/createError';
import { IUser } from '../../../interfaces';

export const getUser = async (userParam: any): Promise<IUser> => {
  const response = await query.getUser(userParam);

  if (response.length === 0) {
    throw createError(ErrorType.RESOURCE_NOT_FOUND);
  }

  return response[0];
}