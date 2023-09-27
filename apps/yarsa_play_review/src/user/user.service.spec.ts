import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  addUser,
  argonPassword,
  generareToken,
  loginDetail,
  loginInput,
  refreshtoken,
  tokenDecodeData,
  user,
  users,
} from './mocks/mockedData';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { player } from '../player/mocks/playerMockedData';
import { CommonUtils } from '../utils/common.utils';
import argon from './mocks/argonwrapper';

const PrismaServiceMock = {
  user: {
    findMany: jest.fn().mockResolvedValue(users),
    findFirst: jest.fn().mockResolvedValue(user),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn().mockResolvedValue(2),
  },
  player: {
    findFirst: jest.fn().mockResolvedValue(player),
    update: jest.fn(),
  },
};

const JWTServiceMock = {
  signAsync: jest
    .fn()
    .mockResolvedValue(
      'yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNhdXJhYkBnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2OTM5OTE3NTIsImV4cCI6MTY5Mzk5NTM1Mn0.J8jYgtI5M3zEKApqhAhUnqY4j63fIIXdFRpBGzfL5MU',
    ),
  verify: jest.fn(),
};
const utils = {
  paginatedResponse: jest.fn(),
  loginSignup: jest.fn(),
  decodeRefreshToken: jest.fn().mockResolvedValue(tokenDecodeData),
  generateTokens: jest.fn().mockResolvedValue(generareToken),
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
        {
          provide: JwtService,
          useValue: JWTServiceMock,
        },
        { provide: CommonUtils, useValue: utils },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('get all users', () => {
    it('return all the users', async () => {
      const allSpyOn = jest.spyOn(prismaService.user, 'findMany');
      const pageSpyOn = jest
        .spyOn(utils, 'paginatedResponse')
        .mockResolvedValue(users);
      const getUsers = await userService.getAllUsers('ra', 5, 0);
      expect(getUsers).toStrictEqual(users);
      expect(allSpyOn).toBeCalledTimes(1);
      expect(pageSpyOn).toBeCalledTimes(1);
    });
  });

  describe('get a user', () => {
    it('should throw not found error', async () => {
      const getSpyOn = jest
        .spyOn(prismaService.user, 'findFirst')
        .mockResolvedValueOnce(null);
      try {
        await userService.getUser('74979d51-6d61-40bc-9a8f-73f11f910e32');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
      expect(getSpyOn).toBeCalledTimes(1);
    });

    it('returns a user', async () => {
      const getSpyOn = jest.spyOn(prismaService.user, 'findFirst');
      try {
        await userService.getUser('74979d51-6d61-40bc-9a8f-73f11f910e32');
      } catch (error) {
        expect(error).toStrictEqual(user);
      }
      expect(getSpyOn).toBeCalledTimes(2);
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
          password: 'saurab123',
        });
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toStrictEqual('User Not found');
      }
      expect(userSpyOn).toBeCalledTimes(3);
    });

    it('should return a login credentials to the users', async () => {
      const logSpyOn = jest.spyOn(prismaService.user, 'findFirst');
      const loginSpyOn = jest
        .spyOn(utils, 'loginSignup')
        .mockResolvedValueOnce(loginDetail);
      const userLogin = await userService.loginUser(loginInput);
      expect(userLogin).toStrictEqual(loginDetail);
      expect(logSpyOn).toBeCalledTimes(4);
      expect(loginSpyOn).toBeCalledTimes(1);
    });
  });

  describe('add a new user ', () => {
    it('should throw exception if user already exists', async () => {
      const addSpyOn = jest.spyOn(prismaService.user, 'findFirst');
      try {
        await userService.addUser(addUser);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toStrictEqual('User Already Exists');
      }
      expect(addSpyOn).toBeCalledTimes(5);
    });
    it('should create user', async () => {
      const addSpyOn = jest
        .spyOn(prismaService.user, 'findFirst')
        .mockResolvedValueOnce(null);
      const createSpyOn = jest.spyOn(prismaService.user, 'create');
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
    it('should retuen success message', async () => {
      const getSpyOn = jest
        .spyOn(userService, 'getUser')
        .mockResolvedValueOnce(user);
      const updateSpyOn = jest.spyOn(prismaService.user, 'update');
      const updateUser = await userService.updateUser(user.id, addUser);
      expect(updateUser).toEqual(
        expect.objectContaining({
          message: expect.any(String),
        }),
      );
      expect(getSpyOn).toBeCalledTimes(1);
      expect(updateSpyOn).toBeCalledTimes(1);
    });
  });

  describe('delete an user', () => {
    it('should return success message', async () => {
      const getSpyOn = jest
        .spyOn(userService, 'getUser')
        .mockResolvedValueOnce(user);
      const deleteUser = await userService.deleteUser(user.id);
      expect(deleteUser).toEqual(
        expect.objectContaining({
          message: expect.any(String),
        }),
      );
      expect(getSpyOn).toBeCalledTimes(1);
    });
  });
  describe('seed an admin user', () => {
    it('should return bad request exception', async () => {
      const countSpyOn = jest.spyOn(prismaService.user, 'count');
      try {
        await userService.seedAdmin(addUser);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toStrictEqual(
          'user already present no need to seed',
        );
        expect(countSpyOn).toBeCalledTimes(2);
      }
    });
    it('should seed an admin and return success message', async () => {
      const countSpyOn = jest
        .spyOn(prismaService.user, 'count')
        .mockResolvedValueOnce(null);
      argon.hash = jest.fn().mockResolvedValue(argonPassword);
      const createSpyOn = jest.spyOn(prismaService.user, 'create');
      const seedAdmin = await userService.seedAdmin(addUser);
      expect(seedAdmin).toEqual(
        expect.objectContaining({
          message: expect.any(String),
        }),
      );
      expect(countSpyOn).toBeCalledTimes(3);
      expect(createSpyOn).toBeCalledTimes(2);
    });
  });
  describe('should return access token and refresh token', () => {
    it('should return both tokens', async () => {
      const decodeSpyOn = jest.spyOn(utils, 'decodeRefreshToken');
      const tokenSpyOn = jest.spyOn(utils, 'generateTokens');
      const newTokens = await userService.generateNewTokens({
        refreshToken: refreshtoken,
      });
      expect(newTokens).toStrictEqual(generareToken);
      expect(decodeSpyOn).toBeCalledTimes(1);
      expect(tokenSpyOn).toBeCalledTimes(1);
    });
  });
});
