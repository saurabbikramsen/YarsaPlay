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
  // await app.listen(process.env.PORT, () => {
  //   console.log('server is listening in port ' + process.env.PORT);
  // });
  const asyncApiServer: AsyncServerObject = {
    url: 'ws://localhost:8080',
    protocol: 'socket.io',
    protocolVersion: '4',
    description:
      'Allows you to connect using the websocket protocol to our Socket.io server.',
    variables: {
      port: {
        description: 'Secure connection (TLS) is available through port 443.',
        default: '443',
      },
    },
    bindings: {},
  };

  const asyncApiOptions = new AsyncApiDocumentBuilder()
    .setTitle('YarsaPlay Chat Api')
    .setDescription('Socket Chats and SSE Api')
    .setVersion('1.0')
    .setDefaultContentType('application/json')
    .addServer('yarsaPlay-server', asyncApiServer)
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
