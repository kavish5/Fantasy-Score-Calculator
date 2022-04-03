import * as mongoose from 'mongoose';
import { BackendError } from './error';

export function handleMongooseError(error: typeof mongoose.Error | any): BackendError {
  return new BackendError({
    message: error.message,
    code: 400,
  });
}
