import { Field } from '../Field';

export type SyncValidator = (value: any, required: boolean) => string | null;
export type AsyncValidator = (value: any, required: boolean) => Promise<string[] | null>;

export type Validator = SyncValidator | AsyncValidator;

export type Renderer = (container: HTMLElement, field: Field) => HTMLElement;
