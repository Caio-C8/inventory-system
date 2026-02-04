import { z } from "zod";

export const LoginSchema = z.object({
  email: z
    .string({
      required_error: "Preencha o campo e-mail.",
    })
    .email({
      message: "E-mail inválido.",
    })
    .min(1, { message: "Preencha o campo e-mail." }),

  password: z
    .string({
      invalid_type_error: "Senha inválida.",
      required_error: "Preencha o campo senha.",
    })
    .min(1, { message: "Preencha o campo senha." }),
});

export type LoginInput = z.infer<typeof LoginSchema>;

export type User = {
  id: string;
  email: string;
  name: string;
};

export interface LoginResult {
  access_token: string;
  user: User;
}
