import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

const PrismaServiceMock = {
  user: {
    findMany: jest.fn().mockResolvedValueOnce([
      {
        id: '74979d51-6d61-40bc-9a8f-73f11f910e32',
        created_at: '2023-08-31T11:50:11.485Z',
        updated_at: '2023-08-31T11:50:11.485Z',
        name: 'saurab',
        email: 'saurab@gmail.com',
        password:
          '$argon2id$v=19$m=65536,t=3,p=4$EVJKoOqkz2xUh46zyubXiQ$9lGmO4To105gNoc7A2sgGsmA8mg0SggrQG2ONxcjTow',
        role: 'admin',
      },
      {
        id: '29daf96a-ed53-4ad8-871b-299af371f9a2',
        created_at: '2023-08-31T11:54:22.701Z',
        updated_at: '2023-08-31T11:54:22.701Z',
        name: 'swatantra',
        email: 'swatantra@gmail.com',
        password:
          '$argon2id$v=19$m=65536,t=3,p=4$QTABnEUaUmB2gls4oSmXzg$n67f4RqNQVJnkCPYLy2NCadoY6RBkkZXqGEq4mAaDTw',
        role: 'admin',
      },
    ]),
  },
};

describe('UserService', () => {
  let userService: UserService;
  let prismaService: PrismaService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: PrismaServiceMock,
        },
        ConfigService,
        JwtService,
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('getUsers', () => {
    it('return all the users', async () => {
      const users = [
        {
          id: '74979d51-6d61-40bc-9a8f-73f11f910e32',
          created_at: '2023-08-31T11:50:11.485Z',
          updated_at: '2023-08-31T11:50:11.485Z',
          name: 'saurab',
          email: 'saurab@gmail.com',
          password:
            '$argon2id$v=19$m=65536,t=3,p=4$EVJKoOqkz2xUh46zyubXiQ$9lGmO4To105gNoc7A2sgGsmA8mg0SggrQG2ONxcjTow',
          role: 'admin',
        },
        {
          id: '29daf96a-ed53-4ad8-871b-299af371f9a2',
          created_at: '2023-08-31T11:54:22.701Z',
          updated_at: '2023-08-31T11:54:22.701Z',
          name: 'swatantra',
          email: 'swatantra@gmail.com',
          password:
            '$argon2id$v=19$m=65536,t=3,p=4$QTABnEUaUmB2gls4oSmXzg$n67f4RqNQVJnkCPYLy2NCadoY6RBkkZXqGEq4mAaDTw',
          role: 'admin',
        },
      ];
      const getUsers = await userService.getAllUsers();
      expect(getUsers).toStrictEqual(users);
      expect(prismaService.user.findMany).toBeCalledTimes(1);
    });
  });
  describe('get a user', () => {
    it('returns a user', async () => {});
  });
});
