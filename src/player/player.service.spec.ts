import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { PlayerService } from './player.service';
import { player, players } from './mocks/playerMockedData';
import { NotFoundException } from '@nestjs/common';

const PrismaServiceMock = {
  player: {
    findMany: jest.fn().mockResolvedValue(players),
    findFirst: jest.fn().mockResolvedValue(player),
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
    });
  });
});
