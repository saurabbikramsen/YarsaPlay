import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { PlayerService } from './player.service';
import {
  hashPassword,
  player,
  playerLoginDetail,
  players,
  playResponse,
  rankedPlayers,
  signupDetails,
  statistics,
  topPlayers,
} from './mocks/playerMockedData';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CommonUtils } from '../utils/common.utils';
import { SseService } from '../serverSentEvents/sse.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import argon from './mocks/argonwrapper';

const PrismaServiceMock = {
  player: {
    findMany: jest.fn().mockResolvedValue(players),
    findFirst: jest.fn().mockResolvedValue(player),
    update: jest.fn(),
    create: jest.fn().mockResolvedValue(player),
    delete: jest.fn(),
    count: jest.fn().mockResolvedValue(5),
  },
  statistics: {
    update: jest.fn().mockResolvedValue(statistics),
  },
};
const utils = {
  paginatedResponse: jest.fn().mockResolvedValue(players),
  playNewGame: jest.fn().mockResolvedValue(playResponse),
  loginSignup: jest.fn().mockResolvedValue(playerLoginDetail),
  updatePlayer: jest
    .fn()
    .mockResolvedValue({ message: 'Player Updated Successfully' }),
};
const JWTServiceMock = {};
const cacheManager = {
  get: jest.fn().mockResolvedValue(rankedPlayers),
  set: jest.fn(),
};

describe('PlayerService', () => {
  let playerService: PlayerService;
  let prismaService: PrismaService;
  let sseService: SseService;
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
        { provide: CommonUtils, useValue: utils },
        SseService,
        {
          provide: CACHE_MANAGER,
          useValue: cacheManager,
        },
      ],
    }).compile();
    playerService = module.get<PlayerService>(PlayerService);
    prismaService = module.get<PrismaService>(PrismaService);
    sseService = module.get<SseService>(SseService);
  });
  describe('get all players ', () => {
    it('should return all the players', async () => {
      const ManySpyOn = jest.spyOn(prismaService.player, 'findMany');
      const countSpyOn = jest.spyOn(prismaService.player, 'count');
      const pageSpyOn = jest.spyOn(utils, 'paginatedResponse');
      const getAll = await playerService.getAllPlayers('hello', 5, 5);

      expect(getAll).toStrictEqual(players);
      expect(ManySpyOn).toBeCalledTimes(1);
      expect(countSpyOn).toBeCalledTimes(1);
      expect(pageSpyOn).toBeCalledTimes(1);
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
    it('should return bulk of users', async () => {
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
      playerService.playNewGame = jest.fn().mockResolvedValue(playResponse);
      const playGame = await playerService.playGame(
        '113360ab-5d52-4df6-a2d2-02139a116b15',
      );
      expect(playGame).toStrictEqual(playResponse);
      expect(findSpyOn).toBeCalledTimes(5);
    });
  });
  describe('should get leaderboard of 5 top players', () => {
    it('should return the leaderboard from the redis cache', async () => {
      const leaderboardSpyOn = jest.spyOn(cacheManager, 'get');
      const getLeaderboard = await playerService.getLeaderboard();
      expect(getLeaderboard).toStrictEqual(rankedPlayers);
      expect(leaderboardSpyOn).toBeCalledTimes(1);
    });
    it('should get leaderboard with rank', async () => {
      const leaderboardSpyOn = jest
        .spyOn(cacheManager, 'get')
        .mockResolvedValue(null);
      prismaService.player.findMany = jest
        .fn()
        .mockResolvedValueOnce(topPlayers);
      const leaderboard = await playerService.getLeaderboard();
      sseService.send = jest.fn();
      expect(leaderboard).toStrictEqual(rankedPlayers);
      expect(leaderboardSpyOn).toBeCalledTimes(2);
    });
  });
  describe('Login in or Signup a player', () => {
    it('should signup a player', async () => {
      const findSpyOn = jest
        .spyOn(prismaService.player, 'findFirst')
        .mockResolvedValueOnce(null);
      argon.hash = jest.fn().mockReturnValue(hashPassword);
      const createSpyOn = jest.spyOn(prismaService.player, 'create');
      const logSignupSpyOn = jest.spyOn(utils, 'loginSignup');
      const signup = await playerService.loginSignup(signupDetails);
      expect(signup).toStrictEqual(playerLoginDetail);
      expect(findSpyOn).toBeCalledTimes(6);
      expect(logSignupSpyOn).toBeCalledTimes(1);
      expect(createSpyOn).toBeCalledTimes(1);
    });

    it('should login a player', async () => {
      const findSpyOn = jest.spyOn(prismaService.player, 'findFirst');
      argon.verify = jest.fn().mockReturnValueOnce(true);
      const logSignupSpyOn = jest.spyOn(utils, 'loginSignup');
      const loginPlayer = await playerService.loginSignup(signupDetails);
      expect(loginPlayer).toStrictEqual(playerLoginDetail);
      expect(findSpyOn).toBeCalledTimes(7);
      expect(logSignupSpyOn).toBeCalledTimes(2);
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
      expect(findSpyOn).toBeCalledTimes(8);
    });
    it('should update the player', async () => {
      const findSpyOn = jest.spyOn(prismaService.player, 'findFirst');
      const playerUpdateSpyOn = jest.spyOn(utils, 'updatePlayer');
      const updatePlayer = await playerService.updatePlayer(player.id, {
        ...player,
        email: 'sen@gmail.com',
      });
      expect(updatePlayer).toEqual(
        expect.objectContaining({
          message: expect.any(String),
        }),
      );
      expect(findSpyOn).toBeCalledTimes(9);
      expect(playerUpdateSpyOn).toBeCalledTimes(1);
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
      expect(findSpyOn).toBeCalledTimes(10);
    });
    it('should delete the player', async () => {
      const findSpyOn = jest.spyOn(prismaService.player, 'findFirst');
      const deletePlayer = await playerService.deletePlayer(player.id);
      expect(deletePlayer).toStrictEqual({
        message: 'player deleted successfully',
      });
      expect(findSpyOn).toBeCalledTimes(11);
    });
  });
  describe('should update the statistics and return the updated statistics', () => {
    it('should update statistics and return it', async () => {
      const updateStatsSpyOn = jest.spyOn(prismaService.statistics, 'update');
      const updateStats = await playerService.playNewGame(player);

      expect(updateStats).toEqual(
        expect.objectContaining({
          data: {
            coins: 232,
            experience_point: 323,
            games_played: 32,
            games_won: 22,
          },
          message: expect.any(String),
        }),
      );
      expect(updateStatsSpyOn).toBeCalledTimes(1);
    });
  });
});
