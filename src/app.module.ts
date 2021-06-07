import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VoteModule } from './vote/vote.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import * as Path from 'path';

@Module({
  imports: [VoteModule, TypeOrmModule.forRoot({
    type: 'sqlite',
    database: './data/db',
    // autoLoadEntities: true,
    entities: [Path.join(__dirname, '**', '*.entity.{ts,js}')],
    synchronize: true,
  }), AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
