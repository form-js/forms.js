import { SyncValidator } from '../types';

export const requiredValidator: SyncValidator<string> = (value, required) => {
  if (required && (value === null || value === undefined || value === '')) {
    return 'This field is required';
  }
  return null;
};
