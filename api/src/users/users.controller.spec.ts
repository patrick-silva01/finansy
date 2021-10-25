import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

// DTOs
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

// Factories
import { user } from '../factories';

const userServiceDB = []
const userServiceMock = {
  create: jest.fn((createUserDto: CreateUserDto) => {
    const newUser = user({
      first_name: createUserDto.first_name,
      last_name: createUserDto.last_name,
      email: createUserDto.email,
      password: createUserDto.password
    })
    userServiceDB.push(newUser)
    return newUser
  }),

  findAll: jest.fn(() => {
    return userServiceDB
  }),

  findOne: jest.fn((id: number) => {
    return userServiceDB[id - 1]
  }),

  update: jest.fn((id: number, updateUserDto: UpdateUserDto) => {
    const user = userServiceDB[id - 1]
    user.email = updateUserDto.email || user.email
    user.first_name = updateUserDto.first_name || user.first_name
    user.last_name = updateUserDto.last_name || user.last_name
    user.password = updateUserDto.password || user.password
    user.updated_at = new Date()
    return user
  }),

  remove: jest.fn((id: number) => {
    const user = userServiceDB[id - 1]
    user.is_active = false
    user.updated_at = new Date()
  })
}

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: userServiceMock
        }
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  test('should be defined', () => {
    expect(controller).toBeDefined();
  });

  test('Create', async () => {
    const newUser = await controller.create({first_name: 'New', last_name: 'User', email: 'teste@teste.com', password: '1234'})
    
    expect(newUser.first_name).toBe('New')
    expect(newUser.last_name).toBe('User')
    expect(newUser.email).toBe('teste@teste.com')
    expect(newUser.password).toBe('1234')
    expect(userServiceMock.create.mock.calls.length).toBe(1)
  })

  test('findAll', async () => {
    const users = await controller.findAll()

    expect(users.length).toBe(1)
    expect(userServiceMock.findAll.mock.calls.length).toBe(1)
  })

  test('findOne', async () => {
    const user = await controller.findOne('1')

    expect(user.first_name).toBe('New')
    expect(user.last_name).toBe('User')
    expect(user.email).toBe('teste@teste.com')
    expect(user.password).toBe('1234')
    expect(userServiceMock.findOne.mock.calls.length).toBe(1)
  })

  test('update', async () => {
    const updatedUser = await controller.update('1', {first_name: 'Updated'})
  
    expect(updatedUser.first_name).toBe('Updated')
    expect(userServiceMock.update.mock.calls.length).toBe(1)
  })

  test('remove', async () => {
    const user = await controller.findOne('1')
    controller.remove('1')

    expect(user.is_active).toBe(false)
    expect(userServiceMock.remove.mock.calls.length).toBe(1)
  })
});
