import { Form } from './form.js';
import { FieldType, FieldValue, HTMLElementEvent, Option, Schema, FormData } from './types.js';

export interface FormOptions {
  id: string;
  saveProgress?: boolean;
  useFormData?: boolean;
  submit?: (data: FormData) => void;
  schema: Schema;
  action?: string | null;
  method?: 'get' | 'post' | null;
  licenseKey?: string;
  className?: string;
}

export interface GroupOptions {
  id: string;
  label?: string;
  type: 'group';
  conditions?: (data: FormData) => boolean;
  prefixSchema?: boolean;
  className?: string;
  schema: Schema;
}

export interface ButtonOptions {
  id: string;
  template: string;
  buttonType: 'submit' | 'reset' | 'button';
  type: 'button';
  conditions?: (data: FormData) => boolean;
  click?: (event: MouseEvent, data: FormData) => void;
  className?: string;
}

export interface FieldOptions {
  id: string;
  name?: string;
  label?: string;
  type: FieldType;
  required?: ((value: FieldValue, data: FormData) => boolean) | boolean;
  change?: (value: FieldValue) => void;
  validation?: (value: FieldValue, data: FormData, required: boolean) => true | string;
  conditions?: ((value: FieldValue, data: FormData) => boolean) | string;
  disabled?: ((value: FieldValue, data: FormData) => boolean) | boolean;
  placeholder?: string;
  debounce?: number;
  default?: FieldValue;
  className?: string;
}

export interface StaticFieldOptions {
  id: string;
  type: 'static';
  conditions?: (value: FieldValue, data: FormData) => boolean;
  template: string;
  className?: string;
}

export interface CheckboxFieldOptions extends FieldOptions {
  id: string;
  name?: string;
  label?: string;
  type: 'checkbox';
  required?: ((value: FieldValue, data: FormData) => boolean) | boolean;
  change?: (value: FieldValue) => void;
  validation?: (value: FieldValue, data: FormData, required: boolean) => true | string;
  conditions?: (value: FieldValue, data: FormData) => boolean;
  disabled?: ((value: FieldValue, data: FormData) => boolean) | boolean;
  default?: boolean | null;
  className?: string;
  toggle?: boolean;
}

export interface DateFieldOptions extends FieldOptions {
  id: string;
  name?: string;
  label?: string;
  type: 'date' | 'week' | 'datetime' | 'time' | 'daterange';
  required?: ((value: FieldValue, data: FormData) => boolean) | boolean;
  change?: (value: FieldValue) => void;
  validation?: (value: FieldValue, data: FormData, required: boolean) => true | string;
  conditions?: (value: FieldValue, data: FormData) => boolean;
  disabled?: ((value: FieldValue, data: FormData) => boolean) | boolean;
  placeholder?: string;
  className?: string;
  default?: string | Date | null;
  options?: object;
  enhance?: boolean;
}

export interface TextareaFieldOptions extends FieldOptions {
  id: string;
  name?: string;
  label?: string;
  type: 'textarea';
  rows?: number;
  required?: ((value: FieldValue, data: FormData) => boolean) | boolean;
  change?: (value: FieldValue) => void;
  validation?: (value: FieldValue, data: FormData, required: boolean) => true | string;
  conditions?: (value: FieldValue, data: FormData) => boolean;
  disabled?: ((value: FieldValue, data: FormData) => boolean) | boolean;
  placeholder?: string;
  className?: string;
  default?: string | null;
}

export interface SelectFieldOptions extends FieldOptions {
  id: string;
  name?: string;
  label?: string;
  type: 'select';
  required?: ((value: FieldValue, data: FormData) => boolean) | boolean;
  change?: (value: FieldValue) => void;
  validation?: (value: FieldValue, data: FormData, required: boolean) => true | string;
  conditions?: (value: FieldValue, data: FormData) => boolean;
  disabled?: ((value: FieldValue, data: FormData) => boolean) | boolean;
  placeholder?: string;
  optionsList?: Option[];
  className?: string;
  default?: string | string[] | object | object[] | null;
  multiple?: boolean;
  options?: object;
  enhance?: boolean;
}

export interface FileFieldOptions extends FieldOptions {
  id: string;
  name?: string;
  label?: string;
  type: 'file';
  required?: ((value: FieldValue, data: FormData) => boolean) | boolean;
  change?: (value: FieldValue) => void;
  validation?: (value: FieldValue, data: FormData, required: boolean) => true | string;
  conditions?: (value: FieldValue, data: FormData) => boolean;
  disabled?: ((value: FieldValue, data: FormData) => boolean) | boolean;
  placeholder?: string;
  className?: string;
  options?: object;
  debounce?: number;
  enhance?: boolean;
  multiple?: boolean;
  accept?: string;
}

export interface HiddenFieldOptions {
  id: string;
  type: string;
  name?: string;
  default?: unknown;
}

export interface NumberFieldOptions extends FieldOptions {
  id: string;
  name?: string;
  label?: string;
  min?: number;
  max?: number;
  step?: number;
  type: 'number' | 'range';
  required?: ((value: FieldValue, data: FormData) => boolean) | boolean;
  change?: (value: FieldValue) => void;
  validation?: (value: FieldValue, data: FormData, required: boolean) => true | string;
  conditions?: (value: FieldValue, data: FormData) => boolean;
  disabled?: ((value: FieldValue, data: FormData) => boolean) | boolean;
  placeholder?: string;
  default?: number | null;
  className?: string;
}

export interface RadioFieldOptions extends FieldOptions {
  id: string;
  name?: string;
  label?: string;
  type: 'radio';
  schema: RadioFieldItemOptions[];
  required?: ((value: FieldValue, data: FormData) => boolean) | boolean;
  change?: (value: FieldValue) => void;
  validation?: (value: FieldValue, data: FormData, required: boolean) => true | string;
  conditions?: (value: FieldValue, data: FormData) => boolean;
  disabled?: ((value: FieldValue, data: FormData) => boolean) | boolean;
  default?: string | null;
  className?: string;
}

export interface RadioFieldItemOptions {
  id: string;
  label: string;
  value: string;
}
