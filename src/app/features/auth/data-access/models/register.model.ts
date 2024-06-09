import { ERole } from '@features/auth/data-access/models/roles.enum';

export type TRegisterRequest = {
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  phone?: string,
  role: ERole
};

export type TConfirmRegisterRequest = Pick<TRegisterRequest, 'email' | 'password'>;
