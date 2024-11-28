import { Field } from './Field';
import { Group } from './Group';
import { FieldTypes, FlowActionTypes } from './utils/enums';

export type SyncValidator<T, C extends FieldConfig<T>> = (value: T | null, state: FieldState<C>) => string | null;

export type AsyncValidator<T, C extends FieldConfig<T>> = (
  value: T | null,
  state: FieldState<C>,
) => Promise<string | string[] | null>;

export type Validator<T, C extends FieldConfig<T>> = SyncValidator<T, C> | AsyncValidator<T, C>;

export type Renderer<T, C extends FieldConfig<T>> = (
  container: HTMLElement,
  field: Field<T, C>,
  type?: FieldTypes,
) => HTMLElement;

export type FieldMask = (value: any) => { raw: any; formatted: any };

//Form configs
export interface FormConfig {
  autorender?: boolean;
  licenseKey?: string;
  flow?: FlowConfig;
}

export interface FieldState<C extends FieldConfig<any>> {
  required: boolean;
  disabled: boolean;
  visible: boolean;
  config: C;
}

//Field configs
export interface FieldConfig<T> {
  id: string;
  name?: string;
  label?: string; // Add label here
  description?: string;
  initialValue?: T;
  required?: boolean;
  disabled?: boolean;
  visible?: boolean;
  validators?: Validator<T, FieldConfig<T>>[];
  validatorsDebounce?: number;
  mask: FieldMask;
  useDefaultValidators?: boolean;
}

export interface TextFieldConfig extends FieldConfig<string> {
  placeholder?: string;
  maxLength?: number;
  minLength?: number;
}

export interface NumberFieldConfig extends FieldConfig<number> {
  placeholder?: string;
  step?: number;
  min?: number;
  max?: number;
}

export interface DateFieldConfig extends FieldConfig<string> {
  placeholder?: string;
  min?: number;
  max?: number;
}

export interface TextAreaFieldConfig extends FieldConfig<string> {
  placeholder?: string;
  maxLength?: number;
  minLength?: number;
  rows?: number;
}

export interface FileFieldConfig extends FieldConfig<FileList | null> {
  multiple?: boolean;
  accept?: string;
}

export interface PasswordFieldConfig extends FieldConfig<string> {
  placeholder?: string;
  allowPeek?: boolean;
}

//Group config

export interface GroupConfig {
  fields?: Record<string, Field<any, any>>;
  groups?: Record<string, Group<any>>;
}

//Form flow

export interface FlowRule {
  id: string;
  condition: (fields: Record<string, Field<any, FieldConfig<any>>>) => boolean;
  actions: FlowAction[];
  elseActions?: FlowAction[]; // Optional actions when the condition is false
  triggers?: string[]; // List of field IDs that will trigger this rule
}

export interface FlowAction {
  type: FlowActionTypes;
  payload: any;
  targetFields: string[];
}

export type FlowConfig = FlowRule[];
