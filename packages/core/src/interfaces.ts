import { Form } from './form.js';
import { FieldType, FieldValue, HTMLElementEvent, Option, Schema } from './types.js';

export interface FormOptions {
  id: string;
  saveProgress?: boolean;
  useFormData?: boolean;
  submit?: (data: any) => void;
  schema: Schema;
  action?: string | null;
  method?: 'get' | 'post' | null;
  licenseKey?: string;
  className?: string;
}

export interface ElementOptions {
  id: string;
  type: string;
}

export interface GroupOptions extends ElementOptions {
  id: string;
  label?: string;
  type: 'group';
  conditions?: (data: any) => boolean;
  prefixSchema?: boolean;
  className?: string;
  schema: Schema;
}

export interface TabsOptions extends ElementOptions {
  id: string;
  type: 'tabs';
  conditions?: (data: any) => boolean;
  className?: string;
  tabs: TabOptions[];
  strict?: boolean;
}

export interface TabOptions extends ElementOptions {
  id: string;
  label: string;
  conditions?: (data: any) => boolean;
  validation?: (fields: string[], form: Form) => true | string;
  disabled?: ((data: any) => boolean) | boolean;
  schema: Schema;
}

export interface RowOptions extends ElementOptions {
  id: string;
  label?: string;
  type: 'row';
  conditions?: (data: any) => boolean;
  className?: string;
  schema: Schema;
}

export interface ButtonOptions extends ElementOptions {
  id: string;
  template: string;
  buttonType: 'submit' | 'reset' | 'button';
  type: 'button';
  conditions?: (data: any) => boolean;
  click?: (event: MouseEvent, data: FormData) => void;
  className?: string;
}

export interface FieldOptions extends ElementOptions {
  id: string;
  name?: string;
  label?: string;
  type: FieldType;
  required?: ((value: any, data: any) => boolean) | boolean;
  change?: (value: any) => void;
  validation?: (value: any, data: any, required: boolean) => true | string;
  conditions?: (value: any, data: any) => boolean;
  disabled?: ((value: any, data: any) => boolean) | boolean;
  debounce?: number;
  default?: FieldValue;
  className?: string;
}

export interface ListFieldOptions extends FieldOptions {
  id: string;
  label?: string;
  type: 'list';
  conditions?: (data: any) => boolean;
  buildButtons?: boolean;
  className?: string;
  listRemoveClassName?: string;
  listAddClassName?: string;
  listRemoveTemplate?: string;
  listAddTemplate?: string;
  schema: Schema;
}
export interface StaticFieldOptions extends ElementOptions {
  id: string;
  type: 'static';
  conditions?: (value: any, data: any) => boolean;
  template: string;
  className?: string;
}

export interface CheckboxFieldOptions extends FieldOptions {
  id: string;
  name?: string;
  label?: string;
  type: 'checkbox';
  required?: ((value: any, data: any) => boolean) | boolean;
  change?: (value: any) => void;
  validation?: (value: any, data: any, required: boolean) => true | string;
  conditions?: (value: any, data: any) => boolean;
  disabled?: ((value: any, data: any) => boolean) | boolean;
  default?: boolean | null;
  className?: string;
  toggle?: boolean;
}

export interface DateFieldOptions extends FieldOptions {
  id: string;
  name?: string;
  label?: string;
  type: 'date' | 'week' | 'datetime' | 'time' | 'daterange';
  required?: ((value: any, data: any) => boolean) | boolean;
  change?: (value: any) => void;
  validation?: (value: any, data: any, required: boolean) => true | string;
  conditions?: (value: any, data: any) => boolean;
  disabled?: ((value: any, data: any) => boolean) | boolean;
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
  required?: ((value: any, data: any) => boolean) | boolean;
  change?: (value: any) => void;
  validation?: (value: any, data: any, required: boolean) => true | string;
  conditions?: (value: any, data: any) => boolean;
  disabled?: ((value: any, data: any) => boolean) | boolean;
  className?: string;
  default?: string | null;
}

export interface SelectFieldOptions extends FieldOptions {
  id: string;
  name?: string;
  label?: string;
  type: 'select';
  required?: ((value: any, data: any) => boolean) | boolean;
  change?: (value: any) => void;
  validation?: (value: any, data: any, required: boolean) => true | string;
  conditions?: (value: any, data: any) => boolean;
  disabled?: ((value: any, data: any) => boolean) | boolean;
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
  required?: ((value: any, data: any) => boolean) | boolean;
  change?: (value: any) => void;
  validation?: (value: any, data: any, required: boolean) => true | string;
  conditions?: (value: any, data: any) => boolean;
  disabled?: ((value: any, data: any) => boolean) | boolean;
  className?: string;
  options?: object;
  debounce?: number;
  enhance?: boolean;
  multiple?: boolean;
  accept?: string;
}

export interface RitchtextFieldOptions extends FieldOptions {
  id: string;
  name?: string;
  label?: string;
  type: 'ritchtext';
  required?: ((value: any, data: any) => boolean) | boolean;
  change?: (value: any) => void;
  validation?: (value: any, data: any, required: boolean) => true | string;
  conditions?: (value: any, data: any) => boolean;
  disabled?: ((value: any, data: any) => boolean) | boolean;
  className?: string;
  default?: string | null;
  options?: object;
}

export interface HiddenFieldOptions extends ElementOptions {
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
  required?: ((value: any, data: any) => boolean) | boolean;
  change?: (value: any) => void;
  validation?: (value: any, data: any, required: boolean) => true | string;
  conditions?: (value: any, data: any) => boolean;
  disabled?: ((value: any, data: any) => boolean) | boolean;
  default?: number | null;
  className?: string;
}

export interface RadioFieldOptions extends FieldOptions {
  id: string;
  name?: string;
  label?: string;
  type: 'radio';
  schema: RadioFieldItemOptions[];
  required?: ((value: any, data: any) => boolean) | boolean;
  change?: (value: any) => void;
  validation?: (value: any, data: any, required: boolean) => true | string;
  conditions?: (value: any, data: any) => boolean;
  disabled?: ((value: any, data: any) => boolean) | boolean;
  default?: string | null;
  className?: string;
}

export interface RadioFieldItemOptions {
  id: string;
  label: string;
  value: string;
}

export interface Field {
  options: FieldOptions;
  inputElement?: HTMLElement;
  containerElement?: HTMLElement;
  labelElement?: HTMLElement;
  validationElement?: HTMLElement;
  _id: string;
  _parent: HTMLElement;
  _form: Form;
}
