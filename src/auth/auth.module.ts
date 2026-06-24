import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: 'SUPER_SECRET_KEY_123', // На хостинге вынесем в .env
      signOptions: { expiresIn: '7d' }, // Токен живет 7 дней
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
