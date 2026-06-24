import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async search(query: string) {
    if (!query) return [];
    return this.prisma.user.findMany({
      where: { username: { contains: query, mode: 'insensitive' } },
      select: { id: true, username: true, avatarUrl: true }
    });
  }

  async getProfile(username: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
      select: {
        id: true, username: true, avatarUrl: true,
        posts: { orderBy: { createdAt: 'desc' } },
        _count: { select: { followers: true, following: true } }
      }
    });
    if (!user) throw new NotFoundException('Пользователь не найден');
    return user;
  }
}
