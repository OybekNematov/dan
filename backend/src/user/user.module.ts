import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module'; // AuthModule import qilish
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [AuthModule], // AuthModule ni import qilish
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
