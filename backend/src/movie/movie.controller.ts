import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { GetUser } from '../auth/decorator';
import { CreateMovieDto, EditMovieDto } from './dto';
import { MovieService } from './movie.service';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@UseGuards(JwtGuard)
@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + '-' + file.originalname);
        },
      }),
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.movieService.handleFile(file);
  }

  @Get()
  getMovies(@GetUser('id') userId: number) {
    return this.movieService.getMovies(userId);
  }

  @Get(':id')
  getMovieById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) movieId: number,
  ) {
    return this.movieService.getMovieById(userId, movieId);
  }

  @Post()
  createMovie(@GetUser('id') userId: number, @Body() dto: CreateMovieDto) {
    return this.movieService.createMovie(userId, dto);
  }

  @Patch(':id')
  editMovie(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) movieId: number,
    @Body() dto: EditMovieDto,
  ) {
    return this.movieService.editMovie(userId, movieId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteMovie(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) movieId: number,
  ) {
    return this.movieService.deleteMovie(userId, movieId);
  }
}
