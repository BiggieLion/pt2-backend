import {
  AdminAddUserToGroupCommand,
  CognitoIdentityProviderClient,
} from '@aws-sdk/client-cognito-identity-provider';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
  CognitoUserSession,
} from 'amazon-cognito-identity-js';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class CognitoService {
  private readonly userPool: CognitoUserPool;
  private readonly cognitoIdentitySvcProvider: CognitoUserSession;
  private readonly providerClient: CognitoIdentityProviderClient;

  constructor(private configSvc: ConfigService) {
    this.userPool = new CognitoUserPool({
      UserPoolId: configSvc.getOrThrow('cognito.userPoolId'),
      ClientId: configSvc.getOrThrow('cognito.clientId'),
    });

    this.providerClient = new CognitoIdentityProviderClient({
      region: configSvc.getOrThrow('aws.region'),
      credentials: {
        accessKeyId: configSvc.getOrThrow('aws.accessKey'),
        secretAccessKey: configSvc.getOrThrow('aws.secretKey'),
      },
    });
  }

  registerUser(registerUserDto: RegisterUserDto) {
    const { name, email, password, rfc, curp } = registerUserDto;

    return new Promise((resolve, reject) => {
      this.userPool.signUp(
        email,
        password,
        [
          new CognitoUserAttribute({
            Name: 'name',
            Value: name,
          }),
          new CognitoUserAttribute({
            Name: 'custom:rfc',
            Value: rfc,
          }),
          new CognitoUserAttribute({
            Name: 'custom:curp',
            Value: curp,
          }),
        ],
        null,
        async (err, res) => {
          if (!res || err) {
            console.error('Error signing up user', err);
            reject(err);
          } else {
            const moveUserToGroupCmd = new AdminAddUserToGroupCommand({
              UserPoolId: this.configSvc.getOrThrow('cognito.userPoolId'),
              Username: email,
              GroupName: 'supervisor',
            });

            const test = await this.providerClient.send(moveUserToGroupCmd);

            console.log('<---------- test ---------->');
            console.log(test);
            console.log('<---------- /test ---------->');

            resolve(res);
          }
        },
      );
    });
  }

  async authenticateUser(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const userData = {
      Username: email,
      Pool: this.userPool,
    };

    const authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });

    const userCognito = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      userCognito.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          resolve({
            accessToken: result.getAccessToken().getJwtToken(),
            refreshToken: result.getRefreshToken().getToken(),
          });
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  }
}
