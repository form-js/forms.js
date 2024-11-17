import { Field } from '../Field';
import { FlowActionTypes } from '../utils/enums';
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

export interface FormConfig {
  autorender?: boolean;
}

export interface TextFieldConfig extends FieldConfig<string> {
  maxLength?: number;
}

export interface NumberFieldConfig extends FieldConfig<string> {
  step?: number;
  min?: number;
  max?: number;
}

export interface FormFlowRule {
  id: string;
  condition: (fields: Record<string, Field<any, any>>) => boolean;
  actions: Array<FlowAction>;
  triggers?: string[]; // List of field IDs that will trigger this rule
}

export interface FlowAction {
  type: FlowActionTypes;
  payload: any;
  targetField: string;
}

export interface FormFlowConfig {
  rules: FormFlowRule[];
}
