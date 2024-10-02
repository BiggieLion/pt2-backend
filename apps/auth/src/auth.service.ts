import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
} from 'amazon-cognito-identity-js';
import { LoginUserDto } from './dto/login-user.dto';

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
            accessToken: tokens.getAccessToken().getJwtToken(),
            refreshToken: tokens.getRefreshToken().getToken(),
          });
        },
        onFailure(err) {
          reject(err);
        },
      });
    });
  }
}
