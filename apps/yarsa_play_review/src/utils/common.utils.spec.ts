// import argon from "../user/mocks/argonwrapper";
// import { HttpException, HttpStatus } from "@nestjs/common";
//
// it('should not match the passwords', async () => {
//   const userSpyOn = jest.spyOn(prismaService.user, 'findFirst');
//   argon.verify = jest.fn().mockReturnValue(false);
//   try {
//     await userService.loginUser({
//       email: 'saurab@gmail.com',
//       password: 'dsfsdasda',
//     });
//   } catch (error) {
//     expect(error).toBeInstanceOf(HttpException);
//     expect(error.getStatus()).toBe(HttpStatus.UNAUTHORIZED);
//     expect(error.message).toStrictEqual("password or email doesn't match");
//   }
//   expect(userSpyOn).toBeCalledTimes(4);
// });

import { CommonUtils } from './common.utils';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { jwtPayload, jwtToken } from '../user/mocks/mockedData';
import {
  paginatedPlayer,
  playerData,
  playerLoginDetail,
  tokens,
  userLoginInfo,
} from '../player/mocks/playerMockedData';

const PrismaServiceMock = {};
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
});

//
// import argon from "../user/mocks/argonwrapper";
//
// argon.verify = jest.fn().mockReturnValue(true);

//
// describe('generate new refresh and access token', () => {
//   it('should throw UnAuthorized error for player ', async () => {
//     const verifySpyOn = jest.spyOn(jwtService, 'verify').mockReturnValueOnce({
//       email: 'saurab@gmail.com',
//       role: 'player',
//       refresh_key: 'saWds',
//     });
//     const findSpyOn = jest.spyOn(prismaService.player, 'findFirst');
//
//     try {
//       await userService.generateRefresh({ refreshToken: jwtToken });
//     } catch (error) {
//       expect(error).toBeInstanceOf(UnauthorizedException);
//       expect(error.message).toEqual('you are not eligible');
//     }
//     expect(findSpyOn).toBeCalledTimes(1);
//     expect(verifySpyOn).toBeCalledTimes(1);
//   });
//   it('should return access token and refresh token for player', async () => {
//     const verifySpyOn = jest.spyOn(jwtService, 'verify').mockReturnValueOnce({
//       email: 'saurab@gmail.com',
//       role: 'player',
//       refresh_key: 'CoKe',
//     });
//     const findSpyOn = jest.spyOn(prismaService.player, 'findFirst');
//     userService.tokenGenerator = jest
//       .fn()
//       .mockResolvedValueOnce(generareToken);
//     const generateToken = userService.generateRefresh({
//       refreshToken: jwtToken,
//     });
//     expect(generateToken).toStrictEqual(generateToken);
//     expect(findSpyOn).toBeCalledTimes(2);
//   });
//   it('should throw UnAuthorized error for user ', async () => {
//     const verifySpyOn = jest.spyOn(jwtService, 'verify').mockReturnValueOnce({
//       email: 'saurab@gmail.com',
//       role: 'admin',
//       refresh_key: 'saWds',
//     });
//     const findSpyOn = jest.spyOn(prismaService.user, 'findFirst');
//
//     try {
//       await userService.generateRefresh({ refreshToken: jwtToken });
//     } catch (error) {
//       expect(error).toBeInstanceOf(UnauthorizedException);
//       expect(error.message).toEqual('you are not eligible');
//     }
//     expect(verifySpyOn).toBeCalledTimes(3);
//     expect(findSpyOn).toBeCalledTimes(8);
//   });
//   it('should return access token and refresh token for user', async () => {
//     const verifySpyOn = jest.spyOn(jwtService, 'verify').mockReturnValueOnce({
//       email: 'saurab@gmail.com',
//       role: 'admin',
//       refresh_key: 'PePsi',
//     });
//     const findSpyOn = jest.spyOn(prismaService.user, 'findFirst');
//     const tokenGenerate = jest
//       .spyOn(userService, 'tokenGenerator')
//       .mockResolvedValueOnce(generareToken);
//     const generateToken = userService.generateRefresh({
//       refreshToken: jwtToken,
//     });
//     expect(generateToken).toStrictEqual(generateToken);
//     expect(findSpyOn).toBeCalledTimes(9);
//   });
// });

// describe('should return new player login details', () => {
//   it('should return login detail', async () => {
//     playerService.generateAccessToken = jest
//       .fn()
//       .mockResolvedValueOnce(jwtToken);
//     playerService.generateRefreshToken = jest
//       .fn()
//       .mockResolvedValueOnce(jwtToken);
//     const updateSpyOn = jest.spyOn(prismaService.player, 'update');
//     const login_signup = await playerService.loginSignupDetail(player);
//     expect(login_signup).toStrictEqual(playerLoginDetail);
//     expect(updateSpyOn).toBeCalledTimes(3);
//   });
// });

//   it('should return error if password doesnot match', async () => {
//     const findSpyOn = jest.spyOn(prismaService.player, 'findFirst');
//     argon.verify = jest.fn().mockReturnValueOnce(false);
//     try {
//       await playerService.loginSignup({
//         name: 'saurab',
//         email: 'saurab@gmail.com',
//         password: 'saurab222',
//       });
//     } catch (error) {
//       expect(error).toBeInstanceOf(UnauthorizedException);
//       expect(error.message).toStrictEqual("password or email doesn't match");
//     }
//     expect(findSpyOn).toBeCalledTimes(7);
//   });
