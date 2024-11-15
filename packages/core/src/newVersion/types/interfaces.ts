import { Validator } from './types';

export interface FieldConfig<T> {
  id: string;
  name?: string;
  label?: string; // Add label here
  placeholder?: string;
  description?: string;
  initialValue?: T;
  required?: boolean;
  disabled?: boolean;
  visible?: boolean;
  validators?: Validator<T>[];
  validatorsDebounce?: number;
}
