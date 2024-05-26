import { SendGridService } from '@anchan828/nest-sendgrid';
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { genSaltSync, hash, hashSync } from 'bcryptjs';
import { ApiHttpResponse } from 'src/common/enums/api-http-response.enum';
import { TokenType } from 'src/common/enums/token-type.enum';
import { TokenRepositoryInterface } from 'src/components/token/interface/token.repository.interface';
import { TokenServiceInterface } from 'src/components/token/interface/token.service.interface';
import { UserCreateDto } from 'src/components/user/dto/user-create.dto';
import { UserRepositoryInterface } from 'src/components/user/interface/user.repository.interface';
import { UserServiceInterface } from 'src/components/user/interface/user.service.interface';
import { LoginPayload } from '../dto/login-payload.dto';
import { LoginResponse } from '../dto/login-response.dto';
import { UserProfileDto } from '../dto/user-profile.dto';
import { AuthServiceInterface } from '../interface/auth-service.interface';
// import * as firebase from 'firebase-admin';

import { initializeApp, App, cert } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

import * as serviceAccount from '../../../../firebase-service-account.json';
import axios, { Axios } from 'axios';
import { User } from 'src/components/user/entity/user.entity';

@Injectable()
export class AuthService implements AuthServiceInterface {
  private logger = new Logger(AuthService.name);

  private params = {
    type: serviceAccount.type,
    projectId: serviceAccount.project_id,
    privateKeyId: serviceAccount.private_key_id,
    privateKey: serviceAccount.private_key,
    clientEmail: serviceAccount.client_email,
    clientId: serviceAccount.client_id,
    authUri: serviceAccount.auth_uri,
    tokenUri: serviceAccount.token_uri,
    authProviderX509CertUrl: serviceAccount.auth_provider_x509_cert_url,
    clientC509CertUrl: serviceAccount.client_x509_cert_url
  };

  constructor(
    @Inject('UserRepositoryInterface')
    private readonly userRepo: UserRepositoryInterface,
    @Inject('TokenRepositoryInterface')
    private readonly tokenRepo: TokenRepositoryInterface,
    @Inject('UserServiceInterface')
    private readonly userService: UserServiceInterface,
    private readonly jwtService: JwtService,
    @Inject('TokenServiceInterface')
    private readonly tokenService: TokenServiceInterface,
    // private readonly sendGrid: SendGridService,
  ) {
    initializeApp({
      credential: cert(this.params),
    });
  }

  async login(payload: LoginPayload): Promise<LoginResponse> {
    const user = await this.userRepo.findOneInLowercase('users',{
      email: payload.email,
    });

    if (!user) {
      throw new UnauthorizedException(ApiHttpResponse.INVALID_CREDENTIALS);
    }

    const validPassword = user.compare(payload.password);

    if (!validPassword) {
      throw new UnauthorizedException(ApiHttpResponse.INVALID_CREDENTIALS);
    }

    if (!user.isVerified) {
      this.logger.error('account not verified');
      throw new BadRequestException(
        'Account not verified, please check your email and verify your account',
      );
    }

    const tokenPayload = {
      id: user.id,
      email: user.email,
    };

    const token = this.jwtService.sign(tokenPayload);

    return {
      success: true,
      token,
    };
  }

  async register(payload: UserCreateDto, host: string): Promise<LoginResponse> {
    console.log(payload);
    // try {
    const user = await this.userService.create(payload, false);

    let verificationToken: string;

    if (user) {
      // insert data to token table
      const tokenInfo = {
        user: user.id,
        token: hashSync(user.email, 12).replace(/\//g, ''),
        type: TokenType.EMAIL_VERIFICATION_REQUEST,
        validTo: new Date(new Date().getTime() + 60 * 60 * 24 * 1000),
      };

      verificationToken = tokenInfo.token;

      this.logger.log('Email token created');

      this.tokenService.create(tokenInfo);
    }

    const verificationEmailPayload = {
      cc: [],
      emailTemplateName: "verify_email",
      keyReplacePair: {
        VERIFICATION_URL: `${host}/api/smatauth/auth/${verificationToken}/verify`,
        FIRST_NAME: user.firstName
      },
      to: user.email
    };

    console.log(`${process.env.MAILER_URL}/send/html`)
    console.log(verificationEmailPayload)

    await axios.post(`${process.env.MAILER_URL}/send/html`, verificationEmailPayload)
    .then((data) => console.log('Email Verification sent'))
    .catch(async (e) => {
      console.error('error sending email: '+e);
      await this.userRepo.remove(user.id);
      throw new InternalServerErrorException(e.message);
    });

    await axios.post(`${process.env.MAILER_URL}/send-mail`, {
      "body": `AirSmat Team,
A new user with the following details have enrolled on SmatCrow app. Please reach out to the user for any possible questions.

User Details:
name: ${user.firstName} ${user.lastName}
phone: ${user.phone ?? "No phone number"}
email: ${user.email}

AirSmat.
      `,
      "cc": [
        "support@airsmat.com",
        "soji.sanyaolu@airsmat.com"
      ],
      "from": "info@airsmat.com",
      "subject": "New user registraion",
      "to": "sales@airsmat.com"
    })
    .then((data) => console.log('Email Verification sent'))
    .catch(async (e) => {
      console.error('error sending email: '+e);
      await this.userRepo.remove(user.id);
      throw new InternalServerErrorException(e.message);
    });

    const tokenPayload = {
      id: user.id,
      email: user.email,
    };

    const token = this.jwtService.sign(tokenPayload);

    // this.findCurrentUser(tokenPayload.email);

    return {
      success: true,
      token,
    };

    // } catch (error) {
    //   this.logger.log('Internal server error', error);
    //
    // }
  }

  async findCurrentUser(email: string): Promise<UserProfileDto> {
    try {
      let user = await this.userRepo.findByConditionsAndRelations({ email }, [
        'role',
        'role.subscription',
        'role.subscription.permissions',
      ]);
      const payload = { email };
      const perks = [];

      await this.checkUserSubscription(user);

      // Get user's permissions from subscription service
      await axios.get(`${process.env.SUBSCRIPTION_SERVICE_BASE_URL}/subscribers/${user.id}/subscriptions/permissions`)
      .then((response) => {
        console.info("Get user permissions was successful");
        user.role.subscription.permissions = response.data.permissions;
        response.data.permissions.forEach(perk => perks.push(perk.name));
      })
      .catch((error) => console.error('error getting users permission'));

      const token = this.jwtService.sign(payload);

      return {
        success: true,
        user,
        perks,
        token,
      };
    } catch (error) {
      this.logger.log('Internal server error', error);
      throw new InternalServerErrorException(error.message);
    }
  }

  private async checkUserSubscription(user: User): Promise<void> {
    // Get user's permissions from subscription service
    await axios.get(`${process.env.SUBSCRIPTION_SERVICE_BASE_URL}/subscribers/${user.id}/plans`)
    .then(async (response) => {
      console.info("Get user permissions was successful");
      // user.role.subscription.permissions = response.data.permissions;
      const plan = response.data.filter((plan) => plan.name === "Free Plan");
      if (plan != null) {
        this.logger.log("=== USER ALREADY SUBSCRIBED TO FREE PLAN ===");
        return ;
      } else {
        this.logger.log("=== SUBSCRIBING USER TO FREE PLAN ===");
        await this.subToFreePlan(user);
      }
    })
    .catch(async (error) => {
      console.error('error checking if user is subscribed to free plan');
      await this.subToFreePlan(user);
    });
  }

  private async subToFreePlan(user: User) {
    await axios.get(`${process.env.SUBSCRIPTION_SERVICE_BASE_URL}/plans/name/Free%20Plan`)
      .then(async (response) => {
        console.log(`url: ${process.env.SUBSCRIPTION_SERVICE_BASE_URL}/plans/${response.data.planCode}/subscribe`)
        console.log({
          "userId": user.id,
          "firstName": user.firstName,
          "lastName": user.lastName,
          "email": user.email,
        })

        await axios.post(`${process.env.SUBSCRIPTION_SERVICE_BASE_URL}/plans/${response.data.planCode}/subscribe`, {
          "userId": user.id,
          "firstName": user.firstName,
          "lastName": user.lastName,
          "email": user.email,
        })
        .then((response) => console.info("Free Plan subscription successful."))
        .catch((error) => console.error('error subscribing user (subscriber) to free plan'));
      }).catch((error) => console.error('error getting plan by name'));
  }

  async forgotPassword(
    email: string,
    host: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const user = await this.userRepo.findByCondition({ email: email });

      if (!user) {
        throw new NotFoundException(`User ${ApiHttpResponse.NOT_FOUND}`);
      }

      const tokenInfo = {
        user: user.id,
        token: hashSync(user.email, 12).replace(/\//g, ''),
        type: TokenType.FORGOT_PASSWORD_REQUEST,
        validTo: new Date(new Date().getTime() + 60 * 60 * 24 * 1000),
      };

      const token = await this.tokenService.create(tokenInfo);

      const resetPasswordEmailPayload = {
        cc: [],
        emailTemplateName: "reset_password",
        keyReplacePair: {
          RESET_PASSWORD_URL: `${process.env.RESET_PASSWORD_REDIRECT_URL}/${tokenInfo.token}`
        },
        to: user.email
      };

      await axios.post(`${process.env.MAILER_URL}/send/html`, resetPasswordEmailPayload)
        .then((data) => console.log('Email reset sent'))
        .catch(async (e) => {
          console.error('error sending email: '+e);
          await this.tokenService.remove(token.id);
          throw new InternalServerErrorException(e.message);
        });

      return {
        success: true,
        message: 'Email Sent',
      };
    } catch (error) {
      this.logger.log('Internal server error', error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async verifyToken(
    verificationToken: string,
  ): Promise<{ success: boolean; message: string }> {
    let token = await this.tokenRepo.findByCondition({
      token: verificationToken,
    });

    if (!token) {
      throw new NotFoundException(
        `Token #${verificationToken} ${ApiHttpResponse.NOT_FOUND}`,
      );
    }

    token = await this.tokenRepo.findByIdAndRelations(token.id, {
      relations: ['user'],
    });

    if (token.validTo.getTime() < Date.now()) {
      console.log('token: ', token.validTo.getDate());
      console.log('now: ', Date.now());
      console.log('compare: ', token.validTo.getDate() < Date.now());
      throw new UnauthorizedException('Token Expire');
    }

    if (token.type === TokenType.EMAIL_VERIFICATION_REQUEST) {
      await this.userRepo.update(token.user.id, { isVerified: true });
      await this.tokenService.remove(token.id);

      return {
        success: true,
        message: `${token.type} Token verification successful`,
      };
    }
  }

  async refreshToken(id: string): Promise<LoginResponse> {
    const user = await this.userRepo.findByIdAndRelations(id, {
      relations: 'role',
    });

    if (!user) {
      throw new NotFoundException(`user ${ApiHttpResponse.NOT_FOUND}`);
    }

    const tokenPayload = {
      id: user.id,
      email: user.email,
    };

    const token = this.jwtService.sign(tokenPayload);

    return {
      success: true,
      token,
    };
  }

  async resetPassword(
    passwordToken: string,
    password: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      let token = await this.tokenRepo.findByCondition({
        token: passwordToken,
      });

      if (!token) {
        throw new NotFoundException(
          `Token #${passwordToken} ${ApiHttpResponse.NOT_FOUND}`,
        );
      }

      token = await this.tokenRepo.findByIdAndRelations(token.id, {
        relations: ['user'],
      });

      if (token.validTo.getTime() < Date.now()) {
        throw new UnauthorizedException('Token Expire');
      }

      if (token.type === TokenType.FORGOT_PASSWORD_REQUEST) {
        const user = await this.userRepo.update(token.user.id, {
          password: await hash(password, genSaltSync(10)),
        });

        getAuth().getUserByEmail(user.email).then((userRecord) => {
          // See the UserRecord reference doc for the contents of userRecord.
          console.log(`Successfully fetched user data: ${userRecord.uid}`);
          getAuth()
          .updateUser(userRecord.uid, {
            password: password
          })
          .then((userRecord) => {
            // See the UserRecord reference doc for the contents of userRecord.
            console.log('Successfully updated user', userRecord.uid);
          })
          .catch((error) => {
            console.log('Error updating user:', error);
          });
        })
        .catch((error) => {
          console.log('Error fetching user data:', error);
        });



        await this.tokenService.remove(token.id);

        return {
          success: true,
          message: `${token.type} Token verification successful`,
        };
      }
    } catch (error) {
      this.logger.log('Internal server error', error);
      throw new InternalServerErrorException(error.message);
    }
  }
}
