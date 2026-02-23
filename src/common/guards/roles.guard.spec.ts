import { RolesGuard } from './roles.guard';
import {
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';

describe('RolesGuard', () => {
  let guard: RolesGuard;

  beforeEach(() => {
    guard = new RolesGuard();
  });

  const createMockContext = (
    headers: Record<string, string>,
  ): Partial<ExecutionContext> => ({
    switchToHttp: jest.fn().mockReturnValue({
      getRequest: jest.fn().mockReturnValue({
        headers,
      }),
    }),
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should allow access if role is admin', () => {
    const context = createMockContext({ role: 'admin' });
    expect(guard.canActivate(context as ExecutionContext)).toBe(true);
  });

  it('should throw UnauthorizedException if no role header is provided', () => {
    const context = createMockContext({});
    expect(() => guard.canActivate(context as ExecutionContext)).toThrow(
      UnauthorizedException,
    );
  });

  it('should throw ForbiddenException if role is user', () => {
    const context = createMockContext({ role: 'user' });
    expect(() => guard.canActivate(context as ExecutionContext)).toThrow(
      ForbiddenException,
    );
  });

  it('should throw UnauthorizedException for an invalid role', () => {
    const context = createMockContext({ role: 'guest' });
    expect(() => guard.canActivate(context as ExecutionContext)).toThrow(
      new UnauthorizedException('Invalid role'),
    );
  });
});
