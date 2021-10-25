import { Injectable } from '@nestjs/common';

// DTOs
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

// UserRepository
import { User } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: UserRepository
  ){}

  async create(createUserDto: CreateUserDto) : Promise<User> {
      const user = await this.userRepository.save(createUserDto)
      return user
  }

  async findAll() : Promise<Array<User>>{
    const users = await this.userRepository.findAll()
    return users
  }

  async findOne(id: number) : Promise<User> {
    const user = await this.userRepository.findOne(id)
    return user
  }

  async update(id: number, updateUserDto: UpdateUserDto) : Promise<User> {
    await this.userRepository.update(id, updateUserDto)
    return this.findOne(id)
  }

  async remove(id: number) {
    await this.userRepository.update(id, {is_active: false})
  }
}
