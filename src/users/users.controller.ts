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

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly logger: Logger,
  ) {}

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
