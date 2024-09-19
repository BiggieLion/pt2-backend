import { Injectable } from '@nestjs/common';
import { StaffRepository } from './staff.repository';
import { CreateStaffDto } from './dto/create-staff.dto';
import { Staff } from './entities/staff.entity';
import { UpdateStaffDto } from './dto/update-staff.dto';

@Injectable()
export class StaffService {
  constructor(private readonly staffRepo: StaffRepository) {}

  create(createStaffDTO: CreateStaffDto) {
    const staff = new Staff({ ...createStaffDTO });
    return this.staffRepo.create(staff);
  }

  findStaff(id: number) {
    return this.staffRepo.findOne({ id });
  }

  update(id: number, updateStaffDTO: UpdateStaffDto) {
    return this.staffRepo.findOneAndUpdate({ id }, updateStaffDTO);
  }

  remove(id: number) {
    return this.staffRepo.findOneAndDelete({ id });
  }
}
