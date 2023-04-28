/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { BackendError } from '../../shared/error/error';

export function venueUnavailableError(venue: string) {
  return new BackendError({
    code: 4000,
    message: `Given venue is not available: ${venue}`,
  });
}
