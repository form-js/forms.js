import { SyncValidator } from '../types/types';

export const requiredValidator: SyncValidator = (value, required) => {
  if (required && (value === null || value === undefined || value === '')) {
    return 'This field is required';
  }
  return null;
};
