import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as process from 'process';
import {
  AsyncApiDocumentBuilder,
  AsyncApiModule,
  AsyncServerObject,
} from 'nestjs-asyncapi';

const host = 'localhost';
const docRelPath = '/async-api';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('YarsaPlay')
    .setDescription('review project')
    .setVersion('1')
    .addTag('PlayAPIs')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const asyncApiServer: AsyncServerObject = {
    url: 'ws://localhost:8080',
    protocol: 'socket.io',
    protocolVersion: '4',
    description:
      'Allows you to connect using the websocket protocol to our Socket.io server.',
    bindings: {},
  };

  const asyncApiOptions = new AsyncApiDocumentBuilder()
    .setTitle('YarsaPlay Chat Api')
    .setDescription('Socket Chats Implementation Documentation')
    .setVersion('1.0')
    .setDefaultContentType('application/json')
    .addServer('yarsaPlay-server', asyncApiServer)
    .addBearerAuth()
    .build();

  const asyncapiDocument = AsyncApiModule.createDocument(app, asyncApiOptions);
  await AsyncApiModule.setup(docRelPath, app, asyncapiDocument);

  return app.listen(process.env.PORT, host);
}

const baseUrl = `http://${host}:${process.env.PORT}`;
const startMessage = `Server started at ${baseUrl}; AsyncApi at ${
  baseUrl + docRelPath
};`;

bootstrap().then(() => console.log(startMessage));
