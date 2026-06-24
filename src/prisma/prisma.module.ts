import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Делает сервис доступным везде без повторного импорта
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
