import { NestInterceptor, ExecutionContext, CallHandler, Injectable } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable()
export class ApiExecutionTimeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    request.startTime = new Date();
    return next.handle().pipe(
      tap(() => {
        this.updateExecutionTime(request);
      }),
      catchError((error: any) => {
        this.updateExecutionTime(request);
        return throwError(error);
      }),
    );
  }

  private updateExecutionTime(request: any) {
    request.endTime = new Date();
    const executionTimeInMS = request.endTime.getTime() - request.startTime.getTime();
    request.executionTimeInMS = executionTimeInMS;
  }
}
