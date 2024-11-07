import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MovieModule } from './movie/movie.module';
import { PrismaModule } from './prisma/prisma.module';
import { HttpAdapterHost } from '@nestjs/core';
// import * as path from 'path';

@Module({
  imports: [
    // I18nModule.forRoot({ ... }) ni olib tashlang
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    MovieModule,
    PrismaModule,
  ],
  providers: [HttpAdapterHost],
})
export class AppModule {}
