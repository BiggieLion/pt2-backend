import {
  AdminAddUserToGroupCommand,
  AdminDeleteUserCommand,
  CognitoIdentityProviderClient,
} from '@aws-sdk/client-cognito-identity-provider';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import {
  CognitoUserAttribute,
  CognitoUserPool,
} from 'amazon-cognito-identity-js';
import { StaffRepository } from './staff.repository';
import { ConfigService } from '@nestjs/config';
import { CreateStaffDto } from './dto/create-staff.dto';
import { Staff } from './entities/staff.entity';
import { UpdateStaffDto } from './dto/update-staff.dto';

@Injectable()
export class StaffService {
  private readonly userPool: CognitoUserPool;
  private readonly providerClient: CognitoIdentityProviderClient;

  constructor(
    private readonly staffRepo: StaffRepository,
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

  // Analyst
  async createAnalyst(createStaffDto: CreateStaffDto) {
    await this.validateStaffExists(createStaffDto.email);

    const { email, password, firstname, lastname, rfc, curp } = createStaffDto;

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
            console.error('Error signing up staff', err);
            reject(err);
          } else {
            createStaffDto.sub = res.userSub;

            const analyst = new Staff({ ...createStaffDto });
            await this.staffRepo.create(analyst);

            const moveAnalystToGroup = new AdminAddUserToGroupCommand({
              UserPoolId: this.configSvc.getOrThrow('cognito.userPoolId'),
              Username: email,
              GroupName: this.configSvc.getOrThrow('cognito.analystGroup'),
            });
            await this.providerClient.send(moveAnalystToGroup);

            resolve({ email, name: `${firstname} ${lastname}` });
          }
        },
      );
    });
  }

  findAnalyst(id: number) {
    return this.staffRepo.findOne({ id });
  }

  updateAnalyst(id: number, updateStaffDto: UpdateStaffDto) {
    return this.staffRepo.findOneAndUpdate({ id }, updateStaffDto);
  }

  async removeAnalyst(id: number) {
    const { sub, email } = await this.staffRepo.findOne({ id });

    const deleteAnalystCmd = new AdminDeleteUserCommand({
      Username: sub,
      UserPoolId: this.configSvc.getOrThrow('cognito.userPoolId'),
    });

    await this.providerClient.send(deleteAnalystCmd);
    await this.staffRepo.findOneAndDelete({ id });

    return `Analyst with email ${email} has been deleted`;
  }

  // Supervisor
  async createSupervisor(createStaffDto: CreateStaffDto) {
    await this.validateStaffExists(createStaffDto.email);

    const { email, password, firstname, lastname, rfc, curp } = createStaffDto;

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
            console.error('Error signing up staff', err);
            reject(err);
          } else {
            createStaffDto.sub = res.userSub;

            const supervisor = new Staff({ ...createStaffDto });
            await this.staffRepo.create(supervisor);

            const moveSupervisorToGroup = new AdminAddUserToGroupCommand({
              UserPoolId: this.configSvc.getOrThrow('cognito.userPoolId'),
              Username: email,
              GroupName: this.configSvc.getOrThrow('cognito.supervisorGroup'),
            });
            await this.providerClient.send(moveSupervisorToGroup);

            resolve({ email, name: `${firstname} ${lastname}` });
          }
        },
      );
    });
  }

  findSupervisor(id: number) {
    return this.staffRepo.findOne({ id });
  }

  updateSupervisor(id: number, updateStaffDto: UpdateStaffDto) {
    return this.staffRepo.findOneAndUpdate({ id }, updateStaffDto);
  }

  async removeSupervisor(id: number) {
    const { sub, email } = await this.staffRepo.findOne({ id });

    const deleteSupervisorCmd = new AdminDeleteUserCommand({
      Username: sub,
      UserPoolId: this.configSvc.getOrThrow('cognito.userPoolId'),
    });

    await this.providerClient.send(deleteSupervisorCmd);
    await this.staffRepo.findOneAndDelete({ id });

    return `Supervisor with email ${email} has been deleted`;
  }

  // Private function
  private async validateStaffExists(email: string) {
    try {
      await this.staffRepo.findOne({ email });
    } catch (error) {
      return;
    }

    throw new UnprocessableEntityException('Staff user already exists');
  }
}
