import { BackendError } from '../shared/error/error';

export function formatLogicUnavailableError(format: string) {
  return new BackendError({
    code: 4000,
    message: `Given format calculation is not available: ${format}`,
  });
}
