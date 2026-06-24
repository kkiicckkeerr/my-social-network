import { Controller, Post, Get, Body, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { PostsService } from './posts.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => Math.round(Math.random() * 16).toString(16)).join('');
        return cb(null, `${randomName}${extname(file.originalname)}`);
      }
    })
  }))
  async create(@UploadedFile() file: any, @Body() body: any) {
    if (!file) throw new BadRequestException('Файл изображения обязателен');
    // В реальном JWT токене тут будет req.user.id. Для MVP передаем из тела запроса.
    return this.postsService.createPost(body.userId, body.caption, `/uploads/${file.filename}`);
  }

  @Get()
  getFeed() {
    return this.postsService.getFeed();
  }
}
