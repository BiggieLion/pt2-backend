import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
} from 'amazon-cognito-identity-js';
import { LoginUserDto } from './dto/login-user.dto';
import { ForgotPasswordDto } from '@app/common';

@Injectable()
export class AuthService {
  private readonly userPool: CognitoUserPool;
  constructor(private readonly configSvc: ConfigService) {
    this.userPool = new CognitoUserPool({
      UserPoolId: configSvc.getOrThrow('cognito.userPoolId'),
      ClientId: configSvc.getOrThrow('cognito.clientId'),
    });
  }

  async authenticateUser(loginUserDto: LoginUserDto) {
    const authenticationDetails = new AuthenticationDetails({
      Username: loginUserDto.email,
      Password: loginUserDto.password,
    });

    const userCognito = new CognitoUser({
      Username: loginUserDto.email,
      Pool: this.userPool,
    });

    return new Promise((resolve, reject) => {
      userCognito.authenticateUser(authenticationDetails, {
        onSuccess: (tokens) => {
          resolve({
            data: {
              accessToken: tokens.getIdToken().getJwtToken(),
              refreshToken: tokens.getRefreshToken().getToken(),
            },
          });
        },
        onFailure(err) {
          reject(err);
        },
      });
    });
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;

    const userCogito = new CognitoUser({
      Username: email,
      Pool: this.userPool,
    });

    return new Promise((resolve, reject) => {
      userCogito.forgotPassword({
        onSuccess(data) {
          resolve({
            message: 'Password reset requested',
            data,
          });
        },
        onFailure(err) {
          reject(err);
        },
      });
    });
  }

  async confirmUserPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email, confirmationCode, newPassword } = forgotPasswordDto;

    const userCogito = new CognitoUser({
      Username: email,
      Pool: this.userPool,
    });

    return new Promise((resolve, reject) => {
      userCogito.confirmPassword(confirmationCode, newPassword, {
        onSuccess() {
          resolve({
            message: 'Password reset successfully',
          });
        },
        onFailure(err) {
          reject(err);
        },
      });
    });
  }
}
