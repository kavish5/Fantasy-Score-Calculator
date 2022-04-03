import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { MongoError } from 'mongodb';

@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  catch(exception: MongoError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    switch (exception.code) {
      case 11000:
        response.status(HttpStatus.CONFLICT).json({
          statusCode: HttpStatus.CONFLICT,
          message: `The action has already been performed. It has to be unique.`,
          error: `CONFLICT`,
          timestamp: new Date().toISOString(),
          path: request.url,
        });
      case 16755:
        response.status(HttpStatus.BAD_REQUEST).json({
          statusCode: HttpStatus.BAD_REQUEST,
          message: `The geo-location was not captured.`,
          error: `BAD_REQUEST`,
          timestamp: new Date().toISOString(),
          path: request.url,
        });
      default:
        response.status(HttpStatus.BAD_REQUEST).json({
          statusCode: HttpStatus.BAD_REQUEST,
          message: `Error occurred at server side. Please retry after some time`,
          error: `BAD_REQUEST`,
          timestamp: new Date().toISOString(),
          path: request.url,
        });
    }
  }
}
