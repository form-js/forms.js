import { Field } from './Field';
import { FlowActionTypes } from './utils/enums';

export type SyncValidator<T> = (value: T | null, required: boolean) => string | null;
export type AsyncValidator<T> = (value: T | null, required: boolean) => Promise<string | string[] | null>;

export type Validator<T> = SyncValidator<T> | AsyncValidator<T>;

export type Renderer<T, C extends FieldConfig<T>> = (container: HTMLElement, field: Field<T, C>) => HTMLElement;

//Form configs
export interface FormConfig {
  autorender?: boolean;
  useFormData?: boolean;
  licenseKey?: string;
}

//Field configs

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

export interface TextFieldConfig extends FieldConfig<string> {
  maxLength?: number;
}

export interface NumberFieldConfig extends FieldConfig<string> {
  step?: number;
  min?: number;
  max?: number;
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
