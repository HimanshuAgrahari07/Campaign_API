import * as crypto from "crypto";
import runQuery from '../../../database/Database'
import SignInDto from '../../../dtos/signin.dto';
import { USERS_TABLE_NAME, ORGANIZATION_TABLE_NAME } from '../../../utils/const'
import hydratedUser from '../../../lib/hydrators/hydratorsUser'

export const SignIn = async (body: SignInDto) => {
  const { password, email } = body;

  const hashedPw = crypto.createHash("sha256").update(password).digest("hex");

  const userListQuery = `
    SELECT *
    FROM ${USERS_TABLE_NAME || 'users'}
    WHERE email = '${email}'
    AND password = '${hashedPw}'
    ;
    `
  const userList = await runQuery(userListQuery);
  if (!(userList && userList.length)) throw {
    name: 'USER_NO_EXIST',
    message: "User doesn't exists"
  };

  // get users data
  const userData = userList[0]
  return await hydratedUser(userData)
}