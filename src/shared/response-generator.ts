import { BadRequestException } from '@nestjs/common';
import { BackendError } from './error/error';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function generateSuccessResponse(result: any): any {
  const response = {
    status: 1,
    result,
  };
  return response;
}

export function generateResponseForError(error: Error): { status: number; error: Record<string, any> } {
  let errorCode;
  let errorMessage;
  if (error instanceof BadRequestException) {
    const errorResponse: any = error.getResponse();
    errorCode = error.getStatus();
    errorMessage = errorResponse.message ? errorResponse.message.join() : 'Bad Request';
  } else if (error instanceof BackendError) {
    errorCode = error.code;
    errorMessage = error.message;
  } else {
    errorCode = 6000;
    errorMessage = 'Internal Server Error! Please try again after some time!';
    console.log(`ERROR:: `, error);
  }
  return {
    status: 0,
    error: { errorCode, errorMessage },
  };
}
