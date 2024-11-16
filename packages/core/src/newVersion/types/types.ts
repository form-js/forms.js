import { FieldType } from '../../types';
import { Field } from '../Field';
import { FieldConfig } from './interfaces';

export type SyncValidator<T> = (value: T | null, required: boolean) => string | null;
export type AsyncValidator<T> = (value: T | null, required: boolean) => Promise<string | string[] | null>;

export type Validator<T> = SyncValidator<T> | AsyncValidator<T>;

export type Renderer<T, C extends FieldConfig<T>> = (
    container: HTMLElement,
    field: Field<T, C>
  ) => HTMLElement;
