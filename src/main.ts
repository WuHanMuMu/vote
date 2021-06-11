import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;
  app.useGlobalPipes(new ValidationPipe());
  const config = new DocumentBuilder()
    .setTitle('api文档说明')
    .setDescription('2021')
    .build();
  SwaggerModule.setup('api', app, SwaggerModule.createDocument(app, config));
  await app.listen(port);
  console.log('listen on port', port);
}

bootstrap();
