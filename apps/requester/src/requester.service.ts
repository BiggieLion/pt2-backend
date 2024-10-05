import { ConflictException, Injectable } from '@nestjs/common';
import { RequesterRepository } from './requester.repository';
import { CreateRequesterDto } from './dto/create-requester.dto';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
} from 'amazon-cognito-identity-js';
import {
  AdminAddUserToGroupCommand,
  AdminDeleteUserCommand,
  CognitoIdentityProviderClient,
} from '@aws-sdk/client-cognito-identity-provider';
import { ConfigService } from '@nestjs/config';
import { Requester } from './entities/requester.entity';
import { UpdateRequesterDto } from './dto/update-requester.dto';
import { ChangePasswordDto } from '@app/common';

@Injectable()
export class RequesterService {
  private readonly userPool: CognitoUserPool;
  private readonly providerClient: CognitoIdentityProviderClient;

  constructor(
    private readonly requesterRepo: RequesterRepository,
    private readonly configSvc: ConfigService,
  ) {
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

  async create(createRequesterDTO: CreateRequesterDto) {
    await this.validateEmailExists(createRequesterDTO.email);
    await this.validateCURPExists(createRequesterDTO.curp);
    await this.validateRFCExists(createRequesterDTO.rfc);

    const { email, password, firstname, lastname, rfc, curp } =
      createRequesterDTO;
    return new Promise((resolve, reject) => {
      this.userPool.signUp(
        email,
        password,
        [
          new CognitoUserAttribute({
            Name: 'name',
            Value: `${firstname} ${lastname}`,
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
            createRequesterDTO.sub = res.userSub;
            const requesterToSave = new Requester({ ...createRequesterDTO });
            await this.requesterRepo.create(requesterToSave);
            const moveUserToGroupCmd = new AdminAddUserToGroupCommand({
              UserPoolId: this.configSvc.getOrThrow('cognito.userPoolId'),
              Username: createRequesterDTO.sub,
              GroupName: this.configSvc.getOrThrow('cognito.requesterGroup'),
            });

            await this.providerClient.send(moveUserToGroupCmd);
            resolve({
              data: { email, name: `${firstname} ${lastname}` },
              message: 'Requester created successfully',
            });
          }
        },
      );
    });
  }

  async findRequester(sub: string) {
    const requester = await this.requesterRepo.findOne({ sub });
    return {
      data: requester,
      message: 'Requester found successfully',
    };
  }

  async update(sub: string, updateRequesterDTO: UpdateRequesterDto) {
    await this.requesterRepo.findOneAndUpdate({ sub }, updateRequesterDTO);
    return {
      message: 'Requester updated successfully',
    };
  }

  async remove(sub: string) {
    const { email } = await this.requesterRepo.findOne({ sub });
    const deleteUserCmd = new AdminDeleteUserCommand({
      Username: sub,
      UserPoolId: this.configSvc.getOrThrow('cognito.userPoolId'),
    });

    await this.providerClient.send(deleteUserCmd);
    await this.requesterRepo.findOneAndDelete({ sub });
    return {
      message: `Requester with email ${email} has been deleted`,
    };
  }

  async changePassword(sub: string, chancePasswordDTO: ChangePasswordDto) {
    const { oldPassword, newPassword } = chancePasswordDTO;

    const authenticationDetails = new AuthenticationDetails({
      Username: sub,
      Password: oldPassword,
    });

    const userCognito = new CognitoUser({
      Username: sub,
      Pool: this.userPool,
    });

    return new Promise((resolve, reject) => {
      userCognito.authenticateUser(authenticationDetails, {
        onSuccess: () => {
          userCognito.changePassword(oldPassword, newPassword, (err, res) => {
            if (err) {
              console.error('Error changing password', err);
              reject(err);
              return;
            }

            this.requesterRepo.findOneAndUpdate(
              { sub },
              { password: newPassword },
            );

            resolve({
              message: 'Password changed successfully',
              data: res,
            });
          });
        },

        onFailure(err) {
          console.error('Error authenticating user', err);
          reject(err);
        },
      });
    });
  }

  // Private methods
  private async validateEmailExists(email: string) {
    try {
      await this.requesterRepo.findOne({ email });
    } catch (error) {
      return;
    }

    throw new ConflictException('Requester email already registered');
  }

  private async validateCURPExists(curp: string) {
    try {
      await this.requesterRepo.findOne({ curp });
    } catch (error) {
      return;
    }

    throw new ConflictException('Requester CURP already registered');
  }

  private async validateRFCExists(rfc: string) {
    try {
      await this.requesterRepo.findOne({ rfc });
    } catch (error) {
      return;
    }

    throw new ConflictException('Requester RFC already registered');
  }
}
