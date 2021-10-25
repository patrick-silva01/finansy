import { Module } from '@nestjs/common';

// Providers and Controllers
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

//Imports
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';



@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [TypeOrmModule.forFeature([User])]
})
export class UsersModule {}
