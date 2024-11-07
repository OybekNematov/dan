import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Google OAuth yo'nalishi
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Ushbu yo'nalish foydalanuvchini Google OAuth ga yo'naltiradi
    // Autentifikatsiyadan o'tgandan so'ng foydalanuvchi 'google/redirect' yo'nalishiga qaytariladi
  }

  // Google OAuth dan qaytish yo'nalishi
  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    if (!req.user) {
      throw new Error('Authentication failed');
    }
    return {
      message: 'Logged in successfully',
      user: req.user,
    };
  }

  // Foydalanuvchini ro'yxatdan o'tkazish
  @Post('signup')
  async signup(@Body() dto: AuthDto) {
    try {
      return await this.authService.signup(dto);
    } catch (error) {
      throw new Error('Signup failed: ' + error.message);
    }
  }

  // Foydalanuvchini tizimga kirish
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signin(@Body() dto: AuthDto) {
    try {
      return await this.authService.signin(dto);
    } catch (error) {
      throw new Error('Signin failed: ' + error.message);
    }
  }
}
