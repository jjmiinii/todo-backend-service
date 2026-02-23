import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP_TRACKER');

  use(req: Request, res: Response, next: NextFunction) {
    const method = String(req.method);
    const url = String(req.originalUrl);

    this.logger.log(`Processing ${method} for ${url}`);
    next();
  }
}
