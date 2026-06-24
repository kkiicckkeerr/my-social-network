import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // 1. РЕГИСТРАЦИЯ ПО ПОЧТЕ
  async register(email: string, username: string, password: string) {
    // Проверяем, занята ли почта или юзернейм
    const candidate = await this.prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    if (candidate) {
      throw new BadRequestException('Пользователь с таким Email или Username уже существует');
    }

    // Хешируем пароль (10 раундов соления)
    const passwordHash = await bcrypt.hash(password, 10);

    // Создаем пользователя в реальной БД
    const user = await this.prisma.user.create({
      data: { email, username, passwordHash },
    });

    // Возвращаем токен и данные юзера
    const token = this.jwtService.sign({ userId: user.id });
    return { token, user: { id: user.id, email: user.email, username: user.username } };
  }

  // 2. ВХОД (ЛОГИН)
  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Неверный email или пароль');
    }

    // Сверяем хеши паролей
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Неверный email или пароль');
    }

    const token = this.jwtService.sign({ userId: user.id });
    return { token, user: { id: user.id, email: user.email, username: user.username } };
  }
}
