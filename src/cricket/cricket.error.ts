import { BackendError } from '../shared/error/error';

export function noUserIdTenantIdError() {
  return new BackendError({
    code: 4000,
    message: 'User ID and Tenant ID are required parameters',
  });
}
