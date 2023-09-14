import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  addUser,
  generareToken,
  jwtPayload,
  jwtToken,
  loginDetail,
  loginInput,
  player,
  user,
  users,
} from './mocks/mockedData';
import argon from './mocks/argonwrapper';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

const PrismaServiceMock = {
  user: {
    findMany: jest.fn().mockResolvedValue(users),
    findFirst: jest.fn().mockResolvedValue(user),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
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
      const allSpyOn = jest.spyOn(prismaService.user, 'findMany');
      const getUsers = await userService.getAllUsers();
      expect(getUsers).toStrictEqual(users);
      expect(allSpyOn).toBeCalledTimes(1);
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

    it('should not match the passwords', async () => {
      const userSpyOn = jest.spyOn(prismaService.user, 'findFirst');
      argon.verify = jest.fn().mockReturnValue(false);
      try {
        await userService.loginUser({
          email: 'saurab@gmail.com',
          password: 'dsfsdasda',
        });
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.getStatus()).toBe(HttpStatus.UNAUTHORIZED);
        expect(error.message).toStrictEqual("password or email doesn't match");
      }
      expect(userSpyOn).toBeCalledTimes(4);
    });

    it('should return a login credentials to the users', async () => {
      const logSpyOn = jest.spyOn(prismaService.user, 'findFirst');
      argon.verify = jest.fn().mockReturnValue(true);
      const userLogin = await userService.loginUser(loginInput);
      expect(userLogin).toStrictEqual(loginDetail);
      expect(logSpyOn).toBeCalledTimes(5);
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
      expect(addSpyOn).toBeCalledTimes(6);
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
      expect(addSpyOn).toBeCalledTimes(7);
      expect(createSpyOn).toBeCalledTimes(1);
    });
  });

  describe('generate new refresh and access token', () => {
    it('should throw UnAuthorized error for player ', async () => {
      const verifySpyOn = jest.spyOn(jwtService, 'verify').mockReturnValueOnce({
        email: 'saurab@gmail.com',
        role: 'player',
        refresh_key: 'saWds',
      });
      const findSpyOn = jest.spyOn(prismaService.player, 'findFirst');

      try {
        await userService.generateRefresh({ refreshToken: jwtToken });
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.message).toEqual('you are not eligible');
      }
      expect(findSpyOn).toBeCalledTimes(1);
      expect(verifySpyOn).toBeCalledTimes(1);
    });
    it('should return access token and refresh token for player', async () => {
      const verifySpyOn = jest.spyOn(jwtService, 'verify').mockReturnValueOnce({
        email: 'saurab@gmail.com',
        role: 'player',
        refresh_key: 'CoKe',
      });
      const findSpyOn = jest.spyOn(prismaService.player, 'findFirst');
      userService.tokenValidation = jest.fn();
      const generateToken = userService.generateRefresh({
        refreshToken: jwtToken,
      });
      expect(generateToken).toStrictEqual(generateToken);
      expect(findSpyOn).toBeCalledTimes(2);
    });
    it('should throw UnAuthorized error for user ', async () => {
      const verifySpyOn = jest.spyOn(jwtService, 'verify').mockReturnValueOnce({
        email: 'saurab@gmail.com',
        role: 'admin',
        refresh_key: 'saWds',
      });
      const findSpyOn = jest.spyOn(prismaService.user, 'findFirst');

      try {
        await userService.generateRefresh({ refreshToken: jwtToken });
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.message).toEqual('you are not eligible');
      }
      expect(verifySpyOn).toBeCalledTimes(3);
      expect(findSpyOn).toBeCalledTimes(8);
    });
    it('should return access token and refresh token for user', async () => {
      const verifySpyOn = jest.spyOn(jwtService, 'verify').mockReturnValueOnce({
        email: 'saurab@gmail.com',
        role: 'admin',
        refresh_key: 'PePsi',
      });
      const findSpyOn = jest.spyOn(prismaService.user, 'findFirst');
      const tokenGenerate = jest
        .spyOn(userService, 'tokenValidation')
        .mockResolvedValue(generareToken);
      const generateToken = userService.generateRefresh({
        refreshToken: jwtToken,
      });
      expect(generateToken).toStrictEqual(generateToken);
      expect(findSpyOn).toBeCalledTimes(9);
    });
  });

  describe('update existing user', () => {
    it('should throw exception if user doesnot exist', async () => {
      const updateSpyOn = jest
        .spyOn(prismaService.user, 'findFirst')
        .mockResolvedValueOnce(null);
      try {
        await userService.updateUser('sdafsafsafsd', addUser);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toStrictEqual('user not found');
      }
      expect(updateSpyOn).toBeCalledTimes(10);
    });

    it('should retuen success message', async () => {
      const findSpyOn = jest.spyOn(prismaService.user, 'findFirst');
      const updateSpyOn = jest.spyOn(prismaService.user, 'update');
      const updateUser = await userService.updateUser(user.id, addUser);
      expect(updateUser).toEqual(
        expect.objectContaining({
          message: expect.any(String),
        }),
      );
      expect(findSpyOn).toBeCalledTimes(11);
      expect(updateSpyOn).toBeCalledTimes(3);
    });
  });

  describe('delete an user', () => {
    it('should  return exception', async () => {
      const emptyDelSpyOn = jest
        .spyOn(prismaService.user, 'findFirst')
        .mockResolvedValueOnce(null);
      try {
        await userService.deleteUser('dsafsa');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toStrictEqual('user not found');
      }
      expect(emptyDelSpyOn).toBeCalledTimes(12);
    });
    it('should return success message', async () => {
      const deleteSpyOn = jest.spyOn(prismaService.user, 'findFirst');
      const deleteUser = await userService.deleteUser(user.id);
      expect(deleteUser).toEqual(
        expect.objectContaining({
          message: expect.any(String),
        }),
      );
      expect(deleteSpyOn).toBeCalledTimes(13);
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
