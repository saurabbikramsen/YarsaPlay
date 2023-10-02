import argon from '../user/mocks/argonwrapper';

import { CommonUtils } from './common.utils';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import {
  argonPassword,
  jwtPayload,
  jwtToken,
  jwtUserRefreshPayload,
  user,
} from '../user/mocks/mockedData';
import {
  jwtPlayerRefreshPayload,
  paginatedPlayer,
  player,
  playerData,
  playerLoginDetail,
  tokens,
  userLoginInfo,
} from '../player/mocks/playerMockedData';
import { HttpException, HttpStatus } from '@nestjs/common';

const PrismaServiceMock = {
  player: {
    findFirst: jest.fn().mockResolvedValue(player),
    update: jest.fn(),
  },
  user: {
    findFirst: jest.fn().mockResolvedValue(user),
    update: jest.fn(),
  },
};
const jwtMockService = {
  signAsync: jest.fn().mockResolvedValue(jwtToken),
  verify: jest.fn(),
};
describe('CommonUtils', () => {
  let commonUtils: CommonUtils;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        CommonUtils,
        { provide: PrismaService, useValue: PrismaServiceMock },
        ConfigService,
        { provide: JwtService, useValue: jwtMockService },
      ],
    }).compile();
    commonUtils = module.get<CommonUtils>(CommonUtils);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(commonUtils).toBeDefined();
    expect(prismaService).toBeDefined();
  });

  describe('generate access token', () => {
    it('should generate access token', async () => {
      const signSpyOn = jest.spyOn(jwtMockService, 'signAsync');
      const generateAccess = await commonUtils.generateAccessToken(jwtPayload);
      expect(generateAccess).toStrictEqual(jwtToken);
      expect(signSpyOn).toBeCalledTimes(1);
    });
  });

  describe('generate refresh token', () => {
    it('should generate refresh token', async () => {
      const signSpyOn = jest.spyOn(jwtMockService, 'signAsync');
      const generateAccess = await commonUtils.generateAccessToken(jwtPayload);
      expect(generateAccess).toStrictEqual(jwtToken);
      expect(signSpyOn).toBeCalledTimes(2);
    });
  });
  describe('generate a random string with given length', () => {
    it('should generate a random string', async () => {
      const randomString = commonUtils.generateRandomString(5);
      expect(randomString).toEqual(expect.any(String));
      expect(randomString).toHaveLength(5);
    });
  });
  describe('should return paginated response', () => {
    it('should return paginated user or player data', async () => {
      const paginatedData = commonUtils.paginatedResponse(playerData, 0, 2, 7);
      expect(paginatedData).toStrictEqual(paginatedPlayer);
    });
  });
  describe('should return tokens and login/signup details', () => {
    it('should return loginInfo and tokens ', async () => {
      commonUtils.passwordMatches = jest.fn();
      commonUtils.generateRandomString = jest.fn().mockResolvedValue('kxavai');
      commonUtils.tokenPayload = jest.fn().mockResolvedValue(tokens);
      commonUtils.updateUser = jest.fn();
      commonUtils.updatePlayer = jest.fn();
      const loginSignupDetail = await commonUtils.loginSignup(
        userLoginInfo,
        'saurab123',
      );
      expect(loginSignupDetail).toStrictEqual(playerLoginDetail);
    });
  });
  describe('should generate new access token and refresh token', () => {
    it('should return access and refresh tokens for player', async () => {
      const findSpyOn = jest.spyOn(prismaService.player, 'findFirst');
      commonUtils.tokenGenerator = jest.fn().mockResolvedValue(tokens);
      const generateTokens = await commonUtils.generateTokens(
        jwtPlayerRefreshPayload,
      );
      expect(generateTokens).toStrictEqual(tokens);
      expect(findSpyOn).toBeCalledTimes(1);
    });
    it('should return access and refresh tokens for user', async () => {
      const findUserSpyOn = jest.spyOn(prismaService.user, 'findFirst');
      commonUtils.tokenGenerator = jest.fn().mockResolvedValue(tokens);
      const generateTokens = await commonUtils.generateTokens(
        jwtUserRefreshPayload,
      );
      expect(generateTokens).toStrictEqual(tokens);
      expect(findUserSpyOn).toBeCalledTimes(1);
    });
  });
  describe('should return new access or refresh tokens', () => {
    it('should return new access and refresh token and update players refresh key', async () => {
      commonUtils.generateTokens = jest.fn().mockResolvedValue('dddddd');
      const updatePlyerSpyOn = jest.spyOn(prismaService.player, 'update');
      commonUtils.tokenPayload = jest.fn().mockResolvedValue(tokens);
      const generatorToken = await commonUtils.tokenGenerator(player, 'dddddd');
      expect(generatorToken).toStrictEqual(tokens);
      expect(updatePlyerSpyOn).toBeCalledTimes(1);
    });

    it('should return new access and refresh token and update user refresh key', async () => {
      commonUtils.generateTokens = jest.fn().mockResolvedValue('dddrrr');
      const updatePlyerSpyOn = jest.spyOn(prismaService.user, 'update');
      commonUtils.tokenPayload = jest.fn().mockResolvedValue(tokens);
      const generatorToken = await commonUtils.tokenGenerator(user, 'sauser');
      expect(generatorToken).toStrictEqual(tokens);
      expect(updatePlyerSpyOn).toBeCalledTimes(1);
    });
  });
  describe('return the tokens for  the given payload ', () => {
    it('should return access and refresh token ', async () => {
      commonUtils.generateAccessToken = jest
        .fn()
        .mockResolvedValue(tokens.accessToken);
      commonUtils.generateAccessToken = jest
        .fn()
        .mockResolvedValue(tokens.refreshToken);
      const payloadToken = await commonUtils.tokenPayload(
        userLoginInfo,
        'ssuser',
      );
      expect(payloadToken).toStrictEqual(tokens);
    });
  });
  describe('update a player', () => {
    it('should update the player', async () => {
      const updatePlayerSpyOn = jest.spyOn(prismaService.player, 'update');
      const updatePlayer = await commonUtils.updatePlayer(player);
      expect(updatePlayer).toEqual(
        expect.objectContaining({
          message: expect.any(String),
        }),
      );
      expect(updatePlayerSpyOn).toBeCalledTimes(2);
    });
  });
  describe('update a user', () => {
    it('should update the user', async () => {
      const updateUserSpyOn = jest.spyOn(prismaService.user, 'update');
      const updatePlayer = await commonUtils.updateUser(user);
      expect(updatePlayer).toEqual(
        expect.objectContaining({
          message: expect.any(String),
        }),
      );
      expect(updateUserSpyOn).toBeCalledTimes(2);
    });
  });
  describe('password tests', () => {
    it('should not match the passwords', async () => {
      const userSpyOn = jest.spyOn(prismaService.user, 'findFirst');
      argon.verify = jest.fn().mockReturnValue(false);
      try {
        await commonUtils.passwordMatches('saurabsen', argonPassword);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.getStatus()).toBe(HttpStatus.UNAUTHORIZED);
        expect(error.message).toStrictEqual("password or email doesn't match");
      }
      expect(userSpyOn).toBeCalledTimes(1);
    });
  });
});
