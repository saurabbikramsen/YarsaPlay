import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  addUser,
  jwtPayload,
  jwtToken,
  loginDetail,
  user,
  users,
} from './mocks/mockedData';
import argon from './mocks/argonwrapper';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';

const PrismaServiceMock = {
  user: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

const JWTServiceMock = {
  signAsync: jest
    .fn()
    .mockResolvedValue(
      'yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNhdXJhYkBnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2OTM5OTE3NTIsImV4cCI6MTY5Mzk5NTM1Mn0.J8jYgtI5M3zEKApqhAhUnqY4j63fIIXdFRpBGzfL5MU',
    ),
};

describe('UserService', () => {
  let userService: UserService;
  let prismaService: PrismaService;
  let jwtService: JwtService;
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
        {
          provide: JwtService,
          useValue: JWTServiceMock,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('getUsers', () => {
    it('return all the users', async () => {
      const allSpyOn = jest
        .spyOn(prismaService.user, 'findMany')
        .mockResolvedValue(users);
      const getUsers = await userService.getAllUsers();
      expect(getUsers).toStrictEqual(users);
      expect(allSpyOn).toBeCalledTimes(1);
    });
  });

  describe('get a user', () => {
    it('returns a user', async () => {
      prismaService.user.findFirst = jest.fn();
      const getSpyOn = jest
        .spyOn(prismaService.user, 'findFirst')
        .mockResolvedValue(user);
      const getuser = await userService.getUser(
        '74979d51-6d61-40bc-9a8f-73f11f910e32',
      );
      expect(getuser).toStrictEqual(user);
      expect(getSpyOn).toBeCalledTimes(1);
    });
  });

  describe('logging in a user', () => {
    it('should throw not found exception', async () => {
      const userSpyOn = jest
        .spyOn(prismaService.user, 'findFirst')
        .mockResolvedValueOnce(null);

      try {
        await userService.loginUser({
          email: 'dsfasa@gmail.com',
          password: user.password,
        });
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toStrictEqual('User Not found');
      }
      expect(userSpyOn).toBeCalledTimes(2);
    });
    it('should not match the passwords', async () => {
      const userSpyOn = jest
        .spyOn(prismaService.user, 'findFirst')
        .mockResolvedValueOnce(user);
      argon.verify = jest.fn().mockReturnValue(false);
      try {
        await userService.loginUser({
          email: user.email,
          password: 'dsfsdasda',
        });
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.getStatus()).toBe(HttpStatus.UNAUTHORIZED);
        expect(error.message).toStrictEqual("password or email doesn't match");
      }
      expect(userSpyOn).toBeCalledTimes(3);
    });
    // should return login credentials to the users
    it('should return a login credentials to the users', async () => {
      const logSpyOn = jest
        .spyOn(prismaService.user, 'findFirst')
        .mockResolvedValueOnce(user);
      argon.verify = jest.fn().mockReturnValue(true);
      const userLogin = await userService.loginUser({
        email: user.email,
        password: user.password,
      });
      expect(userLogin).toStrictEqual(loginDetail);
      expect(logSpyOn).toBeCalledTimes(4);
    });
  });

  describe('add a new user ', () => {
    it('should throw exception if user already exists', async () => {
      const addSpyOn = jest
        .spyOn(prismaService.user, 'findFirst')
        .mockResolvedValueOnce(user);
      try {
        await userService.addUser(addUser);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toStrictEqual('EMAIL ALREADY EXISTS');
      }
      expect(addSpyOn).toBeCalledTimes(5);
    });
    it('should create user', async () => {
      const addSpyOn = jest
        .spyOn(prismaService.user, 'findFirst')
        .mockResolvedValueOnce(null);
      const createSpyOn = jest
        .spyOn(prismaService.user, 'create')
        .mockResolvedValueOnce(user);
      const userAdd = await userService.addUser(addUser);
      expect(userAdd).toEqual(
        expect.objectContaining({
          message: expect.any(String),
        }),
      );
      expect(addSpyOn).toBeCalledTimes(6);
      expect(createSpyOn).toBeCalledTimes(1);
    });
  });

  describe('update existing user', () => {
    it('should throw exception if user doesnot exist', async () => {
      const updateSpyOn = jest
        .spyOn(prismaService.user, 'findFirst')
        .mockResolvedValue(null);
      try {
        await userService.updateUser('sdafsafsafsd', addUser);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toStrictEqual('user not found');
      }
      expect(updateSpyOn).toBeCalledTimes(7);
    });

    it('should retuen success message', async () => {
      const findSpyOn = jest
        .spyOn(prismaService.user, 'findFirst')
        .mockResolvedValue(user);
      const updateSpyOn = jest
        .spyOn(prismaService.user, 'update')
        .mockResolvedValueOnce(user);
      const updateUser = await userService.updateUser(user.id, addUser);
      expect(updateUser).toEqual(
        expect.objectContaining({
          message: expect.any(String),
        }),
      );
      expect(findSpyOn).toBeCalledTimes(8);
      expect(updateSpyOn).toBeCalledTimes(1);
    });
  });

  describe('delete an user', () => {
    it('should  return exception', async () => {
      const emptyDelSpyOn = jest
        .spyOn(prismaService.user, 'findFirst')
        .mockResolvedValue(null);
      try {
        await userService.deleteUser('dsafsa');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toStrictEqual('user not found');
      }
      expect(emptyDelSpyOn).toBeCalledTimes(9);
    });
    it('should return success message', async () => {
      const deleteSpyOn = jest
        .spyOn(prismaService.user, 'findFirst')
        .mockResolvedValueOnce(user);
      const deleteUser = await userService.deleteUser(user.id);
      expect(deleteUser).toEqual(
        expect.objectContaining({
          message: expect.any(String),
        }),
      );
      expect(deleteSpyOn).toBeCalledTimes(10);
    });
  });
  describe('generate access token', () => {
    it('should generate access token', async () => {
      const jwtAccessSpyOn = jest.spyOn(jwtService, 'signAsync');
      const generateAccess = await userService.generateAccessToken(jwtPayload);
      expect(generateAccess).toStrictEqual(jwtToken);
      expect(jwtAccessSpyOn).toBeCalledTimes(3);
    });
  });
  describe('generate refresh token', () => {
    it('should generate refresh token', async () => {
      const jwtRefreshSpyOn = jest.spyOn(jwtService, 'signAsync');
      const generateAccess = await userService.generateAccessToken(jwtPayload);
      expect(generateAccess).toStrictEqual(jwtToken);
      expect(jwtRefreshSpyOn).toBeCalledTimes(4);
    });
  });
});
