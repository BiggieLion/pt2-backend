import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { RequesterRepository } from './requester.repository';
import { CreateRequesterDto } from './dto/create-requester.dto';
import {
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
    await this.validateUserExists(createRequesterDTO.email);

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
              Username: email,
              GroupName: this.configSvc.getOrThrow('cognito.requesterGroup'),
            });

            await this.providerClient.send(moveUserToGroupCmd);
            resolve({ email, name: `${firstname} ${lastname}` });
          }
        },
      );
    });
  }

  findRequester(id: number) {
    return this.requesterRepo.findOne({ id });
  }

  update(id: number, updateRequesterDTO: UpdateRequesterDto) {
    return this.requesterRepo.findOneAndUpdate({ id }, updateRequesterDTO);
  }

  async remove(id: number) {
    const { sub, email } = await this.requesterRepo.findOne({ id });
    const deleteUserCmd = new AdminDeleteUserCommand({
      Username: sub,
      UserPoolId: this.configSvc.getOrThrow('cognito.userPoolId'),
    });

    await this.providerClient.send(deleteUserCmd);
    await this.requesterRepo.findOneAndDelete({ id });
    return `Requester with email ${email} has been deleted`;
  }

  // Private methods
  private async validateUserExists(email: string) {
    try {
      await this.requesterRepo.findOne({ email });
    } catch (error) {
      return;
    }

    throw new UnprocessableEntityException('Requester already exists');
  }
}
