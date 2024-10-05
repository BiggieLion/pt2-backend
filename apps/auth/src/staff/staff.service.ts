import {
  AdminAddUserToGroupCommand,
  AdminDeleteUserCommand,
  CognitoIdentityProviderClient,
} from '@aws-sdk/client-cognito-identity-provider';
import { ConflictException, Injectable } from '@nestjs/common';
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
    await this.validateEmailStaff(createStaffDto.email);
    await this.validateCURPStaff(createStaffDto.curp);
    await this.validateRFCStaff(createStaffDto.rfc);

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

  async findAnalyst(id: number) {
    const analyst = await this.staffRepo.findOne({ id });
    return {
      data: analyst,
      message: 'Analyst found successfully',
    };
  }

  async updateAnalyst(id: number, updateStaffDto: UpdateStaffDto) {
    await this.staffRepo.findOneAndUpdate({ id }, updateStaffDto);
    return {
      message: 'Analyst updated successfully',
    };
  }

  async removeAnalyst(id: number) {
    const { sub, email } = await this.staffRepo.findOne({ id });

    const deleteAnalystCmd = new AdminDeleteUserCommand({
      Username: sub,
      UserPoolId: this.configSvc.getOrThrow('cognito.userPoolId'),
    });

    await this.providerClient.send(deleteAnalystCmd);
    await this.staffRepo.findOneAndDelete({ id });

    return {
      message: `Analyst with email ${email} has been deleted`,
    };
  }

  // Supervisor
  async createSupervisor(createStaffDto: CreateStaffDto) {
    await this.validateEmailStaff(createStaffDto.email);
    await this.validateCURPStaff(createStaffDto.curp);
    await this.validateRFCStaff(createStaffDto.rfc);

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

            resolve({
              message: 'Staff created successfully',
              data: { email, name: `${firstname} ${lastname}` },
            });
          }
        },
      );
    });
  }

  async findSupervisor(id: number) {
    const supervisor = await this.staffRepo.findOne({ id });
    return {
      data: supervisor,
      message: 'Supervisor found successfully',
    };
  }

  async updateSupervisor(id: number, updateStaffDto: UpdateStaffDto) {
    await this.staffRepo.findOneAndUpdate({ id }, updateStaffDto);
    return {
      message: 'Supervisor updated successfully',
    };
  }

  async removeSupervisor(id: number) {
    const { sub, email } = await this.staffRepo.findOne({ id });

    const deleteSupervisorCmd = new AdminDeleteUserCommand({
      Username: sub,
      UserPoolId: this.configSvc.getOrThrow('cognito.userPoolId'),
    });

    await this.providerClient.send(deleteSupervisorCmd);
    await this.staffRepo.findOneAndDelete({ id });

    return {
      message: `Supervisor with email ${email} has been deleted`,
    };
  }

  // Private function
  private async validateEmailStaff(email: string) {
    try {
      await this.staffRepo.findOne({ email });
    } catch (error) {
      return;
    }

    throw new ConflictException('Staff email already registered');
  }

  private async validateCURPStaff(curp: string) {
    try {
      await this.staffRepo.findOne({ curp });
    } catch (error) {
      return;
    }

    throw new ConflictException('Staff CURP already registered');
  }

  private async validateRFCStaff(rfc: string) {
    try {
      await this.staffRepo.findOne({ rfc });
    } catch (error) {
      return;
    }

    throw new ConflictException('Staff RFC already registered');
  }
}
