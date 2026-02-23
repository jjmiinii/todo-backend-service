import {
  IsString,
  IsNotEmpty,
  MinLength,
  IsOptional,
  MaxLength,
} from 'class-validator';

export class CreateTodoDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'Title must be at least 3 characters long' })
  title!: string;

  @IsString()
  @IsOptional()
  @MaxLength(20, { message: 'Description cannot exceed 220 characters' })
  description?: string;
}
