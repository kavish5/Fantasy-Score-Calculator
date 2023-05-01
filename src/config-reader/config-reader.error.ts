import { BackendError } from '../shared/error/error';

export function strategyTypeConfigMissingError(strategy: string, type: string) {
  return new BackendError({
    code: 4000,
    message: `The configuration file for the strategy ${strategy} and type ${type} is missing.`,
  });
}
