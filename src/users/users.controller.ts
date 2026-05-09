import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Logger,
} from '@nestjs/common';
import { File2 } from './entities/file.entity';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { LoggerFactory } from '../logging/logger.factory';

@Controller('users')
export class UsersController {
  private readonly logger: Logger;

  constructor(
    private readonly usersService: UsersService,
    loggerFactory: LoggerFactory,
  ) {
    this.logger = loggerFactory.create(UsersController.name);
  }

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Post()
  async create(@Body() user: User): Promise<User> {
    const createdUser = await this.usersService.create(user);

    this.logger.debug({
      message: 'Created user',
      user: createdUser,
    });

    return createdUser;
  }

  @Post(':id/files')
  addFile(
    @Param('id', ParseIntPipe) id: number,
    @Body() file: File2,
  ): Promise<File2> {
    return this.usersService.addFile(id, file);
  }
}
