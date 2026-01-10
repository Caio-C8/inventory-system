export class LoginResponse {
  access_token!: string;
  user!: {
    id: string;
    email: string;
    name: string;
  };
}
