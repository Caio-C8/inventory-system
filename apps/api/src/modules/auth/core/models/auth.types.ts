import { User } from './user.model';

export interface LoginParams {
  email: string;
  password: string;
}

export interface LoginResult {
  access_token: string;
  user: User;
}
