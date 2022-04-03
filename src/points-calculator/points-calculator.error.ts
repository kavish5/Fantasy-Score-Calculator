/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { BackendError } from '../shared/error/error';

export function strategyTypeConfigMissingError(strategy: string, type: string) {
  return new BackendError({
    code: 4000,
    message: `The configuration file for the strategy ${strategy} and type ${type} is missing.`,
  });
}

export function noRideTimeError() {
  return new BackendError({
    code: 4001,
    message: 'Start and End time needs to be available to calculate price',
  });
}

export function noRideLocationError() {
  return new BackendError({
    code: 4002,
    message: 'Location needs to be available to calculate price',
  });
}

export function pricingNotConfiguredError() {
  return new BackendError({
    code: 4003,
    message: 'Pricing needs to be configured for the service',
  });
}
