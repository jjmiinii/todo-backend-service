import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TodosService } from './todos.service';
import { Todo } from './../../entity/Todo';
import { NotFoundException } from '@nestjs/common';

describe('TodosService', () => {
  let service: TodosService;
  let repository: Repository<Todo>;

  // Mock repository factory
  const mockTodoRepository = () => ({
    create: jest.fn(),
    save: jest.fn(),
    findOneBy: jest.fn(),
    find: jest.fn(),
    delete: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodosService,
        {
          provide: getRepositoryToken(Todo),
          useFactory: mockTodoRepository,
        },
      ],
    }).compile();

    service = module.get<TodosService>(TodosService);
    repository = module.get<Repository<Todo>>(getRepositoryToken(Todo));
  });

  describe('create', () => {
    it('should successfully create a todo', async () => {
      const dto = { title: 'Test', description: 'Desc' };
      const savedTodo = { id: 1, ...dto };

      jest.spyOn(repository, 'create').mockReturnValue(savedTodo as any);
      jest.spyOn(repository, 'save').mockResolvedValue(savedTodo as any);

      const createSpy = jest.spyOn(repository, 'create');

      const result = await service.create(dto);
      expect(result).toEqual(savedTodo);
      expect(createSpy).toHaveBeenCalledWith(dto);
    });
  });

  describe('readOne', () => {
    it('should return a todo if it exists', async () => {
      const todo = { id: 1, title: 'Task' };
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(todo as any);

      expect(await service.readOne(1)).toEqual(todo);
    });

    it('should throw NotFoundException if todo does not exist', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

      await expect(service.readOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('readAll', () => {
    it('should return an array of todos', async () => {
      const todos = [
        { id: 1, title: 'Task 1' },
        { id: 2, title: 'Task 2' },
      ];
      jest.spyOn(repository, 'find').mockResolvedValue(todos as any);

      const result = await service.readAll();
      expect(result).toHaveLength(2);
      expect(result).toEqual(todos);
    });

    it('should throw NotFoundException if no todos exist', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue([]);

      await expect(service.readAll()).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const updateDto = { title: 'Updated Title', description: 'Updated Desc' };

    it('should update and return the todo if it exists', async () => {
      const existingTodo = {
        id: 1,
        title: 'Old Title',
        description: 'Old Desc',
      };
      const updatedTodo = { id: 1, ...updateDto };

      jest
        .spyOn(repository, 'findOneBy')
        .mockResolvedValue(existingTodo as any);
      // 2. Mock saving the updated record
      jest.spyOn(repository, 'save').mockResolvedValue(updatedTodo as any);

      const saveSpy = jest.spyOn(repository, 'save');

      const result = await service.update(1, updateDto);

      expect(result.title).toBe(updateDto.title);
      expect(saveSpy).toHaveBeenCalled();
    });

    it('should throw NotFoundException if trying to update a non-existent todo', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

      await expect(service.update(99, updateDto)).rejects.toThrow(
        new NotFoundException('Todo with id 99 not found'),
      );
    });
  });

  describe('delete', () => {
    it('should throw NotFoundException if nothing was deleted', async () => {
      jest
        .spyOn(repository, 'delete')
        .mockResolvedValue({ affected: 0 } as any);

      await expect(service.delete(1)).rejects.toThrow(NotFoundException);
    });

    it('should delete successfully if todo exists', async () => {
      jest
        .spyOn(repository, 'delete')
        .mockResolvedValue({ affected: 1 } as any);

      await expect(service.delete(1)).resolves.not.toThrow();
    });
  });
});
