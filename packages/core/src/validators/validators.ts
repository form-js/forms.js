import { DateFieldConfig, NumberFieldConfig, SyncValidator, TextFieldConfig } from '../types';

export const requiredValidator: SyncValidator<any, any> = (value, state) => {
  if (state.required && (value === null || value === undefined || (typeof value === 'string' && value.trim() === ''))) {
    return 'This field is required';
  }
  return null;
};

export const minValidator: SyncValidator<number, NumberFieldConfig> = (value, state) => {
  if (!value) return null;
  if (state.config?.min !== undefined && value < state.config.min) {
    return `The value must be at least ${state.config.min}`;
  }
  return null;
};

export const maxValidator: SyncValidator<number, NumberFieldConfig> = (value, state) => {
  if (!value) return null;
  if (state.config?.max !== undefined && value > state.config.max) {
    return `The value must be no more than ${state.config.max}`;
  }
  return null;
};

export const minLengthValidator: SyncValidator<string, TextFieldConfig> = (value, state) => {
  if (!value) return null;
  if (state.config?.minLength !== undefined && value.length < state.config.minLength) {
    return `The value must be at least ${state.config.minLength} characters long`;
  }
  return null;
};

export const maxLengthValidator: SyncValidator<string, TextFieldConfig> = (value, state) => {
  if (!value) return null;
  if (state.config?.maxLength !== undefined && value.length > state.config.maxLength) {
    return `The value must be no more than ${state.config.maxLength} characters long`;
  }
  return null;
};

export const emailValidator: SyncValidator<string, TextFieldConfig> = (value) => {
  if (!value) return null;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(value)) {
    return 'Please enter a valid email address';
  }
  return null;
};

export const phoneValidator: SyncValidator<string, TextFieldConfig> = (value) => {
  if (!value) return null;
  const phonePattern = /^\+?\d{1,3}?[-.\s]?\(?\d{1,4}?\)?([-.\s]?\d{1,9})*$/;
  if (!phonePattern.test(value)) {
    return 'Please enter a valid telephone number';
  }
  return null;
};

export const urlValidator: SyncValidator<string, TextFieldConfig> = (value, state) => {
  if (!value) return null;
  try {
    new URL(value);
    return null;
  } catch {
    return 'Please enter a valid URL';
  }
};

export const dateRangeValidator: SyncValidator<string, DateFieldConfig> = (value, state) => {
  if (!value) return null;
  if (state.config?.min && new Date(value) < new Date(state.config.min)) {
    return `The date must be on or after ${state.config.min}`;
  }
  if (state.config?.max && new Date(value) > new Date(state.config.max)) {
    return `The date must be on or before ${state.config.max}`;
  }
  return null;
};

export const stepValidator: SyncValidator<number, NumberFieldConfig> = (value, state) => {
  if (!value) return null;
  if (state.config?.step !== undefined && value % state.config.step !== 0) {
    return `The value must be a multiple of ${state.config.step}`;
  }
  return null;
};

/*
export const requiredTrueValidator: SyncValidator<boolean> = (value, state) => {
  if (state.required && value !== true) {
    return 'This field must be checked';
  }
  return null;
};*/

/*
export const enumValidator: SyncValidator<string | number, TextFieldConfig | NumberFieldConfig> = (value, state) => {
  if (state.config?.allowedValues && !state.config.allowedValues.includes(value)) {
    return `The value must be one of the following: ${state.config.allowedValues.join(', ')}`;
  }
  return null;
};*/

/*
export const fileSizeValidator: SyncValidator<File> = (value, state) => {
  if (!value) return null;
  if (state.config?.maxFileSize && value.size > state.config.maxFileSize) {
    return `The file size must not exceed ${state.config.maxFileSize} bytes`;
  }
  return null;
};

export const fileTypeValidator: SyncValidator<File> = (value, state) => {
  if (!value) return null;
  if (state.config?.allowedFileTypes && !state.config.allowedFileTypes.includes(value.type)) {
    return `The file type must be one of the following: ${state.config.allowedFileTypes.join(', ')}`;
  }
  return null;
};
*/
