import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { File2 } from './entities/file.entity';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Post()
  create(@Body() user: User): Promise<User> {
    return this.usersService.create(user);
  }

  @Post(':id/files')
  addFile(
    @Param('id', ParseIntPipe) id: number,
    @Body() file: File2,
  ): Promise<File2> {
    return this.usersService.addFile(id, file);
  }
}
