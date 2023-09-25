import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { PlayerService } from './player.service';
import {
  hashPassword,
  jwtToken,
  player,
  playerLoginDetail,
  players,
  rankedPlayers,
  signupDetails,
  topPlayers,
} from './mocks/playerMockedData';
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import argon from './mocks/argonwrapper';

const PrismaServiceMock = {
  player: {
    findMany: jest.fn().mockResolvedValue(players),
    findFirst: jest.fn().mockResolvedValue(player),
    update: jest.fn(),
    create: jest.fn().mockResolvedValue(player),
    delete: jest.fn(),
  },
  statistics: {
    update: jest.fn(),
  },
};
const JWTServiceMock = {};

describe('PlayerService', () => {
  let playerService: PlayerService;
  let prismaService: PrismaService;
  let jwtService: JwtService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        PlayerService,
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
    playerService = module.get<PlayerService>(PlayerService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });
  describe('get all players ', () => {
    it('should return all the players', async () => {
      const ManySpyOn = jest.spyOn(prismaService.player, 'findMany');
      const getAll = await playerService.getAllPlayers();
      expect(getAll).toStrictEqual(players);
      expect(ManySpyOn).toBeCalledTimes(1);
    });
  });
  describe('return a user or bulk of users', () => {
    it('should return a user', async () => {
      const findSpyOn = jest.spyOn(prismaService.player, 'findFirst');
      const getUser = await playerService.getPlayer(
        '82e0c2d5-ed5e-4baf-ab1e-4c8aa5308452',
      );
      expect(getUser).toStrictEqual(player);
      expect(findSpyOn).toBeCalledTimes(1);
    });
    it('should ', async () => {
      const findBulkSpy = jest.spyOn(prismaService.player, 'findMany');
      const getBulk = await playerService.getPlayer(
        '82e0c2d5-ed5e-4baf-ab1e-4c8aa5308452,113360ab-5d52-4df6-a2d2-02139a116b15',
      );
      expect(getBulk).toStrictEqual(players);
      expect(findBulkSpy).toBeCalledTimes(2);
    });
  });
  describe('set player inactive if active and vice versa', () => {
    it('should throw not found exception', async () => {
      const findSpyOn = jest
        .spyOn(prismaService.player, 'findFirst')
        .mockResolvedValueOnce(null);
      try {
        await playerService.setInactive('113360ab-5d52-4df6-a2d2-02139a116b15');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toEqual('no player found');
      }
      expect(findSpyOn).toBeCalledTimes(2);
    });
    it('should set player inactive if active and vice versa ', async () => {
      const findSpyOn = jest.spyOn(prismaService.player, 'findFirst');
      const setinactive = await playerService.setInactive(
        '113360ab-5d52-4df6-a2d2-02139a116b15',
      );
      expect(setinactive).toEqual(
        expect.objectContaining({
          message: expect.any(String),
        }),
      );
      expect(findSpyOn).toBeCalledTimes(3);
    });
  });
  describe('should play game and update stats', () => {
    it('should return not found exception', async () => {
      const findSpyOn = jest
        .spyOn(prismaService.player, 'findFirst')
        .mockResolvedValueOnce(null);
      try {
        await playerService.playGame('113360ab-5d52-4df6-a2d2-02139a116b15');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toStrictEqual('you cannot play the game');
      }
      expect(findSpyOn).toBeCalledTimes(4);
    });
    it('should update the statistics of player after playing games', async () => {
      const findSpyOn = jest.spyOn(prismaService.player, 'findFirst');
      const updateStatSpy = jest.spyOn(prismaService.statistics, 'update');
      const playGame = await playerService.playGame(
        '113360ab-5d52-4df6-a2d2-02139a116b15',
      );
      expect(playGame).toEqual(
        expect.objectContaining({
          message: expect.any(String),
        }),
      );
      expect(findSpyOn).toBeCalledTimes(5);
      expect(updateStatSpy).toBeCalledTimes(1);
    });
  });
  describe('should get leaderboard of 5 top players', () => {
    it('should get leaderboard with rank', async () => {
      prismaService.player.findMany = jest
        .fn()
        .mockResolvedValueOnce(topPlayers);
      const leaderboard = await playerService.getLeaderboard();
      expect(leaderboard).toStrictEqual(rankedPlayers);
    });
  });
  describe('Login in or Signup a player', () => {
    it('should signup a player', async () => {
      const findSpyOn = jest
        .spyOn(prismaService.player, 'findFirst')
        .mockResolvedValueOnce(null);
      argon.hash = jest.fn().mockReturnValue(hashPassword);
      const createSpyOn = jest.spyOn(prismaService.player, 'create');
      playerService.loginSignupDetail = jest
        .fn()
        .mockResolvedValue(playerLoginDetail);
      const signup = await playerService.loginSignup(signupDetails);
      expect(signup).toStrictEqual(playerLoginDetail);
      expect(findSpyOn).toBeCalledTimes(6);
      expect(createSpyOn).toBeCalledTimes(1);
    });
    it('should return error if password doesnot match', async () => {
      const findSpyOn = jest.spyOn(prismaService.player, 'findFirst');
      argon.verify = jest.fn().mockReturnValueOnce(false);
      try {
        await playerService.loginSignup({
          name: 'saurab',
          email: 'saurab@gmail.com',
          password: 'saurab222',
        });
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.message).toStrictEqual("password or email doesn't match");
      }
      expect(findSpyOn).toBeCalledTimes(7);
    });
    it('should login a player', async () => {
      const findSpyOn = jest.spyOn(prismaService.player, 'findFirst');
      argon.verify = jest.fn().mockReturnValueOnce(true);
      playerService.loginSignupDetail = jest
        .fn()
        .mockResolvedValue(playerLoginDetail);
      const loginPlayer = await playerService.loginSignup(signupDetails);

      expect(loginPlayer).toStrictEqual(playerLoginDetail);
      expect(findSpyOn).toBeCalledTimes(8);
    });
  });
  describe('should update a player', () => {
    it('should return not found exception', async () => {
      const findSpyOn = jest
        .spyOn(prismaService.player, 'findFirst')
        .mockResolvedValueOnce(null);
      try {
        await playerService.updatePlayer(player.id, {
          ...player,
          email: 'sen@gmail.com',
        });
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toStrictEqual('player not found');
      }
      expect(findSpyOn).toBeCalledTimes(9);
    });
    it('should update the player', async () => {
      const findSpyOn = jest.spyOn(prismaService.player, 'findFirst');
      const updatePlayer = await playerService.updatePlayer(player.id, {
        ...player,
        email: 'sen@gmail.com',
      });
      expect(updatePlayer).toStrictEqual({
        message: 'Player Updated Successfully',
      });
      expect(findSpyOn).toBeCalledTimes(10);
    });
  });

  describe('should delete a player', () => {
    it('should return not found exception', async () => {
      const findSpyOn = jest
        .spyOn(prismaService.player, 'findFirst')
        .mockResolvedValueOnce(null);
      try {
        await playerService.deletePlayer(player.id);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toStrictEqual('player not found');
      }
      expect(findSpyOn).toBeCalledTimes(11);
    });
    it('should delete the player', async () => {
      const findSpyOn = jest.spyOn(prismaService.player, 'findFirst');
      const deletePlayer = await playerService.deletePlayer(player.id);
      expect(deletePlayer).toStrictEqual({
        message: 'player deleted successfully',
      });
      expect(findSpyOn).toBeCalledTimes(12);
    });
  });
  describe('should return new player login details', () => {
    it('should return login detail', async () => {
      playerService.generateAccessToken = jest
        .fn()
        .mockResolvedValueOnce(jwtToken);
      playerService.generateRefreshToken = jest
        .fn()
        .mockResolvedValueOnce(jwtToken);
      const updateSpyOn = jest.spyOn(prismaService.player, 'update');
      const login_signup = await playerService.loginSignupDetail(player);
      expect(login_signup).toStrictEqual(playerLoginDetail);
      expect(updateSpyOn).toBeCalledTimes(3);
    });
  });
});
