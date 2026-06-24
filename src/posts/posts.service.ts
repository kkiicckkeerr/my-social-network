import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async createPost(userId: string, caption: string, imageUrl: string) {
    return this.prisma.post.create({
      data: { userId, caption, imageUrl }
    });
  }

  async getFeed() {
    return this.prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { username: true, avatarUrl: true } } }
    });
  }
}
