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

//
// import argon from "../user/mocks/argonwrapper";
//
// argon.verify = jest.fn().mockReturnValue(true);

//   describe('generate access token', () => {
//     it('should generate access token', async () => {
//       const jwtAccessSpyOn = jest.spyOn(jwtService, 'signAsync');
//       const generateAccess = await userService.generateAccessToken(jwtPayload);
//       expect(generateAccess).toStrictEqual(jwtToken);
//       expect(jwtAccessSpyOn).toBeCalledTimes(3);
//     });
//   });
//   describe('generate refresh token', () => {
//     it('should generate refresh token', async () => {
//       const jwtRefreshSpyOn = jest.spyOn(jwtService, 'signAsync');
//       const generateAccess = await userService.generateAccessToken(jwtPayload);
//       expect(generateAccess).toStrictEqual(jwtToken);
//       expect(jwtRefreshSpyOn).toBeCalledTimes(4);
//     });
//   });

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
