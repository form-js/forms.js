import { FieldOptions, NumberFieldOptions, RadioFieldOptions } from './interfaces';
import { costructorTypes, fields, formElements } from './constants';
import { Form } from './form';

export type Schema = object[];
export type Tabs = object[];

export type HTMLElementEvent<T extends HTMLElement> = Event & {
  target: T;
};

export type FormData = Record<string, any>;

export type Option = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type FieldType = (typeof fields)[number];

export type FormElementType = (typeof formElements)[number];

export type FieldValue =
  | null
  | string
  | number
  | object
  | []
  | string[]
  | number[]
  | object[]
  | File
  | boolean
  | symbol
  | Record<string, any>
  | Record<string, any>[];

export type FormElement = {
  new (parent: HTMLElement, form: Form, options: Record<string, any>): any;
  getId(): string;
  getSchemaContainer?(): HTMLElement | null;
};

export type FormTab = {
  getBody(): HTMLElement | null;
  getSchema(): Schema;
};

export type PluginSettings = {
  type: string;
  constructor: pluginConstructor;
  constructorType: string;
  licensed?: boolean;
};

export type pluginConstructor = new (a: HTMLElement, b: Form, c: any) => any;
