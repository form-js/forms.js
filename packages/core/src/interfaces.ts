import {
  GROUP_TYPE_GROUP,
  BUTTON_TYPE_BUTTON,
  FIELD_TYPE_CHECKBOX,
  FIELD_TYPE_DATE,
  FIELD_TYPE_WEEK,
  FIELD_TYPE_DATETIME,
  FIELD_TYPE_TIME,
  FIELD_TYPE_DATERANGE,
  FIELD_TYPE_FILE,
  FIELD_TYPE_NUMBER,
  FIELD_TYPE_RANGE,
  FIELD_TYPE_RADIO,
  FIELD_TYPE_SELECT,
  FIELD_TYPE_STATIC,
  FIELD_TYPE_TEXTAREA,
} from './constants';
import { Form } from './form';
import { FieldType, FieldValue, HTMLElementEvent, Option, Schema, FormData } from './types';

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
  type: typeof GROUP_TYPE_GROUP;
  conditions?: ((data: FormData) => boolean) | string;
  prefixSchema?: boolean;
  className?: string;
  schema: Schema;
}

export interface ButtonOptions {
  id: string;
  template: string | (() => HTMLElement);
  buttonType: 'submit' | 'reset' | 'button';
  type: typeof BUTTON_TYPE_BUTTON;
  conditions?: ((data: FormData) => boolean) | string;
  click?: (event: MouseEvent, data: FormData) => void;
  className?: string;
}

export interface FieldOptions {
  id: string;
  name?: string;
  label?: string | (() => HTMLElement);
  type: FieldType;
  required?: ((value: FieldValue, data: FormData) => boolean) | boolean | string;
  change?: (value: FieldValue) => void;
  validation?: ((value: FieldValue, data: FormData, required: boolean) => true | string) | string;
  conditions?: ((value: FieldValue, data: FormData) => boolean) | string;
  disabled?: ((value: FieldValue, data: FormData) => boolean) | boolean | string;
  placeholder?: string;
  debounce?: number;
  default?: FieldValue;
  className?: string;
}

export interface StaticFieldOptions {
  id: string;
  type: typeof FIELD_TYPE_STATIC;
  conditions?: ((value: FieldValue, data: FormData) => boolean) | string;
  template: string | (() => HTMLElement);
  className?: string;
}

export interface CheckboxFieldOptions extends FieldOptions {
  id: string;
  name?: string;
  label?: string | (() => HTMLElement);
  type: typeof FIELD_TYPE_CHECKBOX;
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
  label?: string | (() => HTMLElement);
  type:
    | typeof FIELD_TYPE_DATE
    | typeof FIELD_TYPE_WEEK
    | typeof FIELD_TYPE_DATETIME
    | typeof FIELD_TYPE_TIME
    | typeof FIELD_TYPE_DATERANGE;
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
  label?: string | (() => HTMLElement);
  type: typeof FIELD_TYPE_TEXTAREA;
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
  label?: string | (() => HTMLElement);
  type: typeof FIELD_TYPE_SELECT;
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
  label?: string | (() => HTMLElement);
  type: typeof FIELD_TYPE_FILE;
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
  label?: string | (() => HTMLElement);
  min?: number;
  max?: number;
  step?: number;
  type: typeof FIELD_TYPE_NUMBER | typeof FIELD_TYPE_RANGE;
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
  label?: string | (() => HTMLElement);
  type: typeof FIELD_TYPE_RADIO;
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
  label: string | (() => HTMLElement);
  value: string;
}

export interface PasswordFieldOptions extends FieldOptions {
  allowPeek?: boolean;
}