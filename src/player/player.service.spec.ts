import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { PlayerService } from './player.service';
import { players } from './mocks/playerMockedData';

const PrismaServiceMock = {
  player: {
    findMany: jest.fn().mockResolvedValue(players),
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
    });
  });
});
