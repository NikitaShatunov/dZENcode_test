import * as argon2 from 'argon2';

import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { isIdNumber } from 'src/common/helpers/isIdNumber';
import { validateGetById } from 'src/common/helpers/validateGetById';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { isUniquePropertyValue } from 'src/common/helpers/isUniquePropertyValue';
import { Repository } from 'typeorm';
import {
  adjectives,
  animals,
  uniqueNamesGenerator,
} from 'unique-names-generator';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    await isUniquePropertyValue(
      'email',
      createUserDto.email,
      this.userRepository,
    );
    const name = this.generateRandomName();
    const passwordHash = await argon2.hash(createUserDto.password);
    const user = this.userRepository.create({
      ...createUserDto,
      password: passwordHash,
      name,
    });
    const { password, ...result } = await this.userRepository.save(user);
    return result;
  }

  generateRandomName() {
    const randomName = uniqueNamesGenerator({
      dictionaries: [adjectives, animals],
      separator: ' ',
      style: 'capital',
      length: 2,
    });

    return randomName;
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: number) {
    isIdNumber(id, 'User');
    const user = await this.userRepository.findOne({ where: { id } });
    validateGetById(id, user, 'User');
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
