import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { File2 } from './entities/file.entity';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

type MockUsersRepository = jest.Mocked<
  Pick<Repository<User>, 'find' | 'findOneBy' | 'create' | 'save' | 'delete'>
>;

type MockFilesRepository = jest.Mocked<
  Pick<Repository<File2>, 'create' | 'save'>
>;

describe('UsersService', () => {
  const usersRepository: MockUsersRepository = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  const filesRepository: MockFilesRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  let service: UsersService;

  beforeEach(() => {
    jest.resetAllMocks();
    service = new UsersService(
      usersRepository as unknown as Repository<User>,
      filesRepository as unknown as Repository<File2>,
    );
  });

  it('loads users with their files', async () => {
    const users: User[] = [
      {
        id: 1,
        firstName: 'Grace',
        lastName: 'Hopper',
        isActive: true,
        files: [],
      },
    ];

    usersRepository.find.mockResolvedValue(users);

    await expect(service.findAll()).resolves.toBe(users);
    expect(usersRepository.find).toHaveBeenCalledWith({ relations: ['files'] });
  });

  it('adds a file to an existing user', async () => {
    const user: User = {
      id: 1,
      firstName: 'Grace',
      lastName: 'Hopper',
      isActive: true,
      files: [],
    };
    const file: File2 = { name: 'profile.png', type: 'image/png' };
    const createdFile: File2 = { ...file, user };
    const savedFile: File2 = { id: 10, ...createdFile };

    usersRepository.findOneBy.mockResolvedValue(user);
    filesRepository.create.mockReturnValue(createdFile);
    filesRepository.save.mockResolvedValue(savedFile);

    await expect(service.addFile(1, file)).resolves.toBe(savedFile);
    expect(usersRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(filesRepository.create).toHaveBeenCalledWith({
      name: 'profile.png',
      type: 'image/png',
      user,
    });
    expect(filesRepository.save).toHaveBeenCalledWith(createdFile);
  });

  it('throws when adding a file to a missing user', async () => {
    const file: File2 = { name: 'profile.png', type: 'image/png' };

    usersRepository.findOneBy.mockResolvedValue(null);

    await expect(service.addFile(1, file)).rejects.toThrow(NotFoundException);
    expect(filesRepository.create).not.toHaveBeenCalled();
    expect(filesRepository.save).not.toHaveBeenCalled();
  });
});
