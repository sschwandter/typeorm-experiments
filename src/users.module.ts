import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';
import { File2 } from './file';

@Module({
  imports: [TypeOrmModule.forFeature([User, File2])],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
