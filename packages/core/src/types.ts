import { FieldOptions, NumberFieldOptions, RadioFieldOptions } from './interfaces';
import { costructorTypes, fields, formElements } from './constants';
import { Form } from './form.js';
import { FilePondFile } from 'filepond';

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
  | File[]
  | FileList
  | boolean
  | symbol
  | Record<string, any>
  | Record<string, any>[]
  | FilePondFile[];

export type FormElement = {
  new (parent: HTMLElement, form: Form, options: Record<string, any>): any;
  getId(): string;
  initialize() : void;
  getSchemaContainer?(): HTMLElement | null;
  getKeyIndex?(key:string):number;
  assignButton?(id: string, key:string, constructed:FormElement):void;
  assignGroup?(id: string, key:string, constructed:FormElement):void;
  assignField?(id: string, key:string, constructed:FormElement):void;
  update():void;
  reset?():void;
  validate?():void;
  save?():void;
  load?():void;
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
