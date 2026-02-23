import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './../../entity/Todo';
import { CreateTodoDto } from '../../dto/todo/create-todo.dto';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>,
  ) {}

  async create(createTodoDto: CreateTodoDto): Promise<Todo> {
    try {
      const newTodo = this.todoRepository.create({
        title: createTodoDto.title,
        description: createTodoDto.description,
      });
      return await this.todoRepository.save(newTodo);
    } catch (error) {
      console.log('error');
      throw error;
    }
  }

  async readOne(id: number): Promise<Todo | null> {
    try {
      const todo = await this.todoRepository.findOneBy({ id });
      if (!todo) {
        throw new NotFoundException(`Todo with id ${id} not found`);
      }
      return todo;
    } catch (error) {
      console.log('error');
      throw error;
    }
  }

  async readAll(): Promise<Todo[]> {
    try {
      const todos = await this.todoRepository.find();
      if (!todos || todos.length === 0) {
        throw new NotFoundException('No todos found');
      }
      return todos;
    } catch (error) {
      console.log('error');
      throw error;
    }
  }

  async update(id: number, updateTodoDto: CreateTodoDto): Promise<Todo> {
    try {
      const todo = await this.todoRepository.findOneBy({ id });
      if (!todo) {
        throw new NotFoundException(`Todo with id ${id} not found`);
      }
      todo.title = updateTodoDto.title;
      todo.description = updateTodoDto.description;
      return await this.todoRepository.save(todo);
    } catch (error) {
      console.log('error');
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const todo = await this.todoRepository.delete(id);
      if (todo.affected === 0) {
        throw new NotFoundException(`Todo with id ${id} not found`);
      }
    } catch (error) {
      console.log('error');
      throw error;
    }
  }
}
