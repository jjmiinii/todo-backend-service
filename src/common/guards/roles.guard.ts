import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    //Basic role-based access control using the 'role' header
    const request = context.switchToHttp().getRequest();
    const role = request.headers['role'];

    if (!role) {
      throw new UnauthorizedException('No role header provided');
    }
    if (role === 'admin') {
      return true;
    }

    if (role === 'user') {
      throw new ForbiddenException(
        'Users are not authorized to access this resource',
      );
    }

    throw new UnauthorizedException('Invalid role');
  }
}
