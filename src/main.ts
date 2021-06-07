import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder().setTitle('文档说明').setDescription('2021').build();
  SwaggerModule.setup('api', app, SwaggerModule.createDocument(app, config));
  await app.listen(3000);
  console.log('listen on port', 3000);
}

bootstrap();
