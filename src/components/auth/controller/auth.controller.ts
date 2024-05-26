import {
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
  Logger,
  Param,
  Post,
  Put,
  Redirect,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { Profile } from 'src/common/decorators/profile.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { ResetPasswordDto } from 'src/common/dto/reset-password.dto';
import { ForgotPasswordDto } from 'src/common/dto/forgot-password.dto';
import { UserCreateDto } from 'src/components/user/dto/user-create.dto';
import { User } from 'src/components/user/entity/user.entity';
import { LoginPayload } from '../dto/login-payload.dto';
import { LoginResponse } from '../dto/login-response.dto';
import { AuthServiceInterface } from '../interface/auth-service.interface';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Roles as Role } from 'src/common/enums/roles.enum';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private logger = new Logger(AuthController.name);

  constructor(
    @Inject('AuthServiceInterface')
    private readonly authService: AuthServiceInterface,
  ) {}

  @Public()
  @ApiBody({ type: UserCreateDto })
  @Post('/register')
  async register(@Body() createUser: UserCreateDto, @Req() req: Request) {
    this.logger.debug(`'BASE_URL --> ', ${req.headers.host}`);
    const host = req.headers.host;
    return this.authService.register(createUser, host);
  }

  @Public()
  @ApiBody({ type: LoginPayload })
  @Post('/login')
  @HttpCode(200)
  async login(@Body() payload: LoginPayload): Promise<LoginResponse> {
    return this.authService.login(payload);
  }

  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.USER, Role.AGENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/profile')
  async profile(@Profile() { email }: User) {
    return this.authService.findCurrentUser(email);
  }

  @Public()
  @ApiBody({ type: ForgotPasswordDto })
  @Post('/forgotpassword')
  @HttpCode(200)
  async forgotPassword(@Body() email: ForgotPasswordDto, @Req() req: Request) {
    this.logger.debug(`'BASE_URL --> ', ${req.headers.host}`);
    const host = req.headers.host;
    return this.authService.forgotPassword(email.email, host);
  }

  @Public()
  @Get('/:token/verify')
  @Redirect('https://portal.airsmat.com', 302)
  async verify(@Param('token') token: string) {
    await this.authService.verifyToken(token);
    this.logger.log('User verifiled');
  }

  @Public()
  @Get('/:userid/refreshtoken')
  async refreshToken(@Param('userid') id: string) {
    return this.authService.refreshToken(id);
  }

  @Public()
  @ApiBody({ type: [ResetPasswordDto] })
  @Put(':token/resetpassword')
  async resetPassword(
    @Param('token') token: string,
    @Body() password: ResetPasswordDto,
  ) {
    return this.authService.resetPassword(token, password.password);
  }
}
