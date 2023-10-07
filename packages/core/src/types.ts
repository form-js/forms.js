import { fields, formElements } from './constants';

export type Schema = object[];
export type Tabs = object[];

export type HTMLElementEvent<T extends HTMLElement> = Event & {
  target: T;
};

export type Option = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type FieldType = (typeof fields)[number];

export type FormElementType = (typeof formElements)[number];
