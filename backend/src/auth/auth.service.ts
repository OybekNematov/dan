import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  // Tokenni tekshirish funksiyasi
  async validateToken(token: string, userId: number): Promise<boolean> {
    const isTokenValid = await this.prisma.session.findFirst({
      where: { userId, token },
    });
    return !!isTokenValid;
  }

  // Email orqali OTP yuborish funksiyasi
  async sendOtpEmail(email: string, otp: string) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: this.config.get('oybekjonnematov544@gmail.com'),
          pass: this.config.get('12345678'),
        },
      });

      await transporter.sendMail({
        from: `"YourApp" <${this.config.get('oybekjonnematov544@gmail.com')}>`,
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}`,
      });

      return { message: 'OTP sent to email' };
    } catch (error) {
      throw new Error('OTP yuborishda xatolik yuz berdi: ' + error.message);
    }
  }

  // Foydalanuvchini ro'yxatdan o'tkazish funksiyasi
  async signup(dto: AuthDto) {
    const hashedPassword = await argon.hash(dto.password);

    try {
      const userExists = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

      if (userExists) {
        throw new ForbiddenException('Email already taken');
      }

      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: hashedPassword,
        },
      });

      return this.createSession(user.id, user.email);
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ForbiddenException('Email already taken');
      }
      throw error;
    }
  }

  // Foydalanuvchini tizimga kirish funksiyasi
  async signin(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new ForbiddenException('Credentials incorrect');
    }

    const passwordMatches = await argon.verify(user.password, dto.password);
    if (!passwordMatches) {
      throw new ForbiddenException('Credentials incorrect');
    }

    return this.createSession(user.id, user.email);
  }

  // Yangi sessiya yaratish funksiyasi
  private async createSession(
    userId: number,
    email: string,
  ): Promise<{ access_token: string; email: string }> {
    const payload = { sub: userId, email };
    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '120m',
      secret,
    });

    // Yangi sessiyani bazada saqlash
    await this.prisma.session.create({
      data: {
        userId,
        token,
      },
    });

    return {
      access_token: token,
      email,
    };
  }

  // Foydalanuvchining barcha sessiyalarini olish funksiyasi
  async getUserSessions(userId: number) {
    return this.prisma.session.findMany({
      where: { userId },
    });
  }
}
