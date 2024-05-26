import { Pagination } from 'nestjs-typeorm-paginate';
import { Observable } from 'rxjs';
import { Token } from 'src/components/token/entity/token.entity';
import { DeleteResult } from 'typeorm';
import { ChangeRoleDto } from '../dto/change-role.dto';
import { UserCreateDto } from '../dto/user-create.dto';
import { UserUpdateDto } from '../dto/user-update.dto';
import { UserRole } from '../entity/user-role.entity';
import { User } from '../entity/user.entity';
import { Roles } from 'src/common/enums/roles.enum';

export interface UserServiceInterface {
  create(userDto: UserCreateDto, isAdmin: boolean): Promise<User>;

  getUser(userId: string): Promise<User>;

  getUserByEmail(email: string): Promise<User>;

  getUsers(): Promise<Array<User>>;

  getUsersByIds(userids: string[]): Promise<Array<User>>;

  verifyUser(userId: string, isVerified: boolean): Promise<void>;

  update(id: string, user: UserUpdateDto): Promise<User>;

  getUserTokens(id: string): Promise<Array<Token>>;

  changePassword(email: string, currentPassword: string, newPassword: string): Promise<void>;

  changeUserRole(id: string, role: ChangeRoleDto): Promise<UserRole>;

  changeUserToAgent(id: string, role: Roles): Promise<UserRole>;

  paginate(page: number, limit: number): Observable<Pagination<User>>;

  paginateRole(
    page: number,
    limit: number,
    role: string,
  ): Observable<Pagination<User>>;

  findByRole(role: string): Promise<User[]>;

  // addRole(userId: string, subscriptionIds: string): Promise<User>;

  // removeRole(userId: string, roleId: string): Promise<User>;

  deleteUser(userId: string): Promise<DeleteResult>;
}
