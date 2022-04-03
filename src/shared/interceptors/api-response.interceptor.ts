/* eslint-disable class-methods-use-this */
import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Injectable,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { generateSuccessResponse, generateResponseForError } from '../response-generator';

@Injectable()
export class ApiResponseInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ApiResponseInterceptor.name, { timestamp: true });

  public intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    return next.handle().pipe(
      map((data) => {
        return { ...generateSuccessResponse(data), executionTimeInMS: request.executionTimeInMS };
      }),
      catchError((error: Error) => {
        this.logger.error(`Error occured for URL ${request.url} : ${error} ${JSON.stringify(error)}`);
        throw new HttpException(
          {
            executionTimeInMS: request.executionTimeInMS,
            ...generateResponseForError(error),
          },
          HttpStatus.OK,
        );
      }),
    );
  }
}
