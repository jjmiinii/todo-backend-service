import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  ClassSerializerInterceptor,
  UseInterceptors,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from '../../dto/todo/create-todo.dto';
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { RolesGuard } from './../../common/guards/roles.guard';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(RolesGuard)
  async create(
    @Body()
    createTodoDto: CreateTodoDto,
  ) {
    return this.todosService.create(createTodoDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  readOne(@Param('id') id: string) {
    return this.todosService.readOne(+id);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  readAll() {
    return this.todosService.readAll();
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  @UseGuards(RolesGuard)
  update(@Param('id') id: string, @Body() updateTodoDto: CreateTodoDto) {
    return this.todosService.update(+id, updateTodoDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  delete(@Param('id') id: string) {
    return this.todosService.delete(+id);
  }
}
