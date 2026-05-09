import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File2 } from './entities/file.entity';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(File2)
    private filesRepository: Repository<File2>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find({ relations: ['files'] });
  }

  findOne(id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  create(user: User): Promise<User> {
    return this.usersRepository.save(this.usersRepository.create(user));
  }

  async addFile(userId: number, file: File2): Promise<File2> {
    const user = await this.usersRepository.findOneBy({ id: userId });

    if (!user) {
      throw new NotFoundException(`User ${userId} not found`);
    }

    return this.filesRepository.save(
      this.filesRepository.create({
        name: file.name,
        type: file.type,
        user,
      }),
    );
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
