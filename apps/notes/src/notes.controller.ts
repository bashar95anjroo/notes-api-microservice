import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Req,
  Put,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.request';
import { UpdateNoteDto } from './dto/update-note.request';
import { SentryInterceptor } from '../sentry.interceptor';
import { JwtAuthGuard } from '@app/common';

@UseInterceptors(SentryInterceptor)
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createNoteDto: CreateNoteDto, @Req() req: any) {
    //for test Sentry
    // throw new InternalServerErrorException();
    return this.notesService.create(createNoteDto, req.cookies?.Authentication);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Req() req: any) {
    console.log(req.cookies?.Authentication);

    return this.notesService.findAll(req.cookies?.Authentication);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string, @Req() req: any) {
    return this.notesService.findOne(id, req.cookies?.Authentication);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateNoteDto: UpdateNoteDto,
    @Req() req: any,
  ) {
    return this.notesService.update(
      id,
      updateNoteDto,
      req.cookies?.Authentication,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string, @Req() req: any) {
    return this.notesService.remove(id, req.cookies?.Authentication);
  }
}
