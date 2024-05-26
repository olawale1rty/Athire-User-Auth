import { LoginPayload } from '../dto/login-payload.dto';
import { LoginResponse } from '../dto/login-response.dto';
import { UserCreateDto } from '../dto/user-create.dto';
import { UserProfileDto } from '../dto/user-profile.dto';

export interface AuthServiceInterface {
  login(payload: LoginPayload): Promise<LoginResponse>;

  register(payload: UserCreateDto, host: string): Promise<LoginResponse>;

  findCurrentUser(email: string): Promise<UserProfileDto>;

  forgotPassword(
    email: string,
    host: string,
  ): Promise<{ success: boolean; message: string }>;

  verifyToken(
    verificationToken: string,
  ): Promise<{ success: boolean; message: string }>;

  refreshToken(id: string): Promise<LoginResponse>;

  resetPassword(
    passwordToken: string,
    password: string,
  ): Promise<{ success: boolean; message: string }>;
}
