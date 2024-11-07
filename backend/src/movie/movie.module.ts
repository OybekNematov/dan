import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module'; // AuthModule import qilish
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';

@Module({
  imports: [AuthModule], // AuthModule ni import qilish
  providers: [MovieService],
  controllers: [MovieController],
})
export class MovieModule {}
