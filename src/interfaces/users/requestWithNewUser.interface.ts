import { Request } from 'express';
import User from '../users/user.interface';

interface requestWithNewUser extends Request {
  user: User;
}

export default requestWithNewUser;
