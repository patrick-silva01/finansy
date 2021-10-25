import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';

// Mock Repository
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

// Factories
import { user } from '../factories'

//DTOs
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDTO } from './dto/user.dto';

const userRepositoryDB : Array<UserDTO> = []
const userRepositoryMock = {
  save: jest.fn((createUserDto: CreateUserDto) => {
    const newUser = user({
      first_name: createUserDto.first_name,
      last_name: createUserDto.last_name,
      email: createUserDto.email,
      password: createUserDto.password
    })
    userRepositoryDB.push(newUser)
    return newUser
  }),

  findOne: jest.fn((id: number) => {
    return userRepositoryDB[id - 1]
  }),

  findAll: jest.fn(() => {
    return userRepositoryDB
  }),

  update: jest.fn((id: number, updateUserDto) => {
    const user = userRepositoryDB[id - 1]
    user.email = updateUserDto.email || user.email
    user.first_name = updateUserDto.first_name || user.first_name
    user.last_name = updateUserDto.last_name || user.last_name
    user.password = updateUserDto.password || user.password
    user.is_active = (updateUserDto.is_active != undefined) ? updateUserDto.is_active : user.is_active
    user.updated_at = new Date()
  })
}

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: userRepositoryMock
        }
      ],
    }).compile();

    service = await module.resolve(UsersService);
  });

  test('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Create', () => {
    test('Should return the new user', async () => {
      const newUser : CreateUserDto = {first_name: 'Unit', last_name: 'Test', email: 'teste@teste.com', password:'1234'}
      const savedUser = await service.create(newUser)

      expect(savedUser.first_name).toBe(newUser.first_name)
      expect(savedUser.last_name).toBe(newUser.last_name)
      expect(savedUser.email).toBe(newUser.email)
      expect(savedUser.password).toBe(newUser.password)
      expect(userRepositoryMock.save.mock.calls.length).toBe(1)
    })
  })

  describe('findAll', () => {
    test('Return array must not be empty', async () => {
      const usersCount = await service.findAll()

      expect(usersCount.length).toBeGreaterThanOrEqual(1)
      expect(userRepositoryMock.findAll.mock.calls.length).toBe(1)
    })

    test('When a new user is saved it should be in return', async () => {
      // Salva o novo usuário
      const newUser : CreateUserDto = {first_name: 'Unit3', last_name: 'Test3', email: 'teste3@teste.com', password:'1234'}
      await service.create(newUser)

      // Verifica se o novo usuário é o último da list
      const users = await service.findAll()
      expect(users[users.length - 1].first_name).toBe(newUser.first_name)
      expect(users[users.length - 1].last_name).toBe(newUser.last_name)
      expect(users[users.length - 1].email).toBe(newUser.email)
      expect(users[users.length - 1].password).toBe(newUser.password)
      expect(userRepositoryMock.findAll.mock.calls.length).toBe(2)
    })
  })

  describe('findOne', () => {
    test('Should return the requested user', async () => {
      const user = await service.findOne(1)
      
      expect(userRepositoryMock.findOne.mock.calls.length).toBe(1)
      expect(user.id).toBe(1)
    })
  })

  describe('Update', () => {
    test('Should update the user information', async () => {
      const user = await service.findOne(1)
      const newInfo : UpdateUserDto = {first_name: 'Updated', last_name: 'User', email: 'updated@teste.com', password: '12345'}
    
      await service.update(1, newInfo)

      expect(user.first_name).toBe(newInfo.first_name)
      expect(user.last_name).toBe(newInfo.last_name)
      expect(user.email).toBe(newInfo.email)
      expect(user.password).toBe(newInfo.password)
      expect(userRepositoryMock.update.mock.calls.length).toBe(1)
    })
  })

  describe('Remove', () => {
    test('Should set user.is_active to false', async () => {
      const user = await service.findOne(1)
      await service.remove(1)      

      expect(user.is_active).toBe(false)
      expect(userRepositoryMock.update.mock.calls.length).toBe(2)
    })
  })

});
