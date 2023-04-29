import { BackendError } from '../../shared/error/error';

export function unsupportedStrategyError(strategy: string) {
  return new BackendError({
    code: 4000,
    message: `The point calculation strategy ${strategy} is missing.`,
  });
}
