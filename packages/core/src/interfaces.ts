import { TomCreate, TomCreateFilter, TomLoadCallback, TomOption, TomTemplates } from 'tom-select/dist/types/types';
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
import { FieldType, FieldValue, Option, Schema, FormData } from './types';
import { TPluginHash, TPluginItem } from 'tom-select/dist/types/contrib/microplugin';

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
  optionsList?: Option[] | ((query: string) => Promise<Option[]>);
  className?: string;
  default?: string | string[] | object | object[] | null;
  multiple?: boolean;
  options?: TomSelectSettings;
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

export interface TomSelectSettings {
  options?: any[];
  optgroups?: any[];
  items?: string[];
  plugins?: string[] | TPluginItem[] | TPluginHash;
  delimiter_?: string;
  splitOn?: RegExp | string;
  persist?: boolean;
  diacritics?: boolean;
  create?: boolean | TomCreate;
  createOnBlur?: boolean;
  createFilter?: RegExp | string | TomCreateFilter;
  highlight?: boolean;
  openOnFocus?: boolean;
  shouldOpen?: boolean;
  maxOptions?: number;
  maxItems?: null | number;
  hideSelected?: boolean;
  duplicates?: boolean;
  addPrecedence?: boolean;
  selectOnTab?: boolean;
  preload?: boolean | string;
  allowEmptyOption?: boolean;
  closeAfterSelect?: boolean;
  refreshThrottle?: number;
  loadThrottle?: number;
  loadingClass?: string;
  dataAttr?: string;
  optgroupField?: string;
  valueField?: string;
  labelField?: string;
  disabledField?: string;
  optgroupLabelField?: string;
  optgroupValueField?: string;
  lockOptgroupOrder?: boolean;
  sortField?: string;
  searchField?: string[];
  searchConjunction?: string;
  nesting?: boolean;
  mode?: string;
  wrapperClass?: string;
  controlClass?: string;
  dropdownClass?: string;
  dropdownContentClass?: string;
  itemClass?: string;
  optionClass?: string;
  dropdownParent?: string;
  controlInput?: string | HTMLInputElement;
  copyClassesToDropdown?: boolean;
  placeholder?: string;
  hidePlaceholder?: boolean;
  load?: (value: string, callback: TomLoadCallback) => void;
  score?: (query: string) => () => any;
  shouldLoad?: (query: string) => boolean;
  onInitialize?: () => void;
  onChange?: (value: string | number | string[] | number[]) => void;
  onItemAdd?: (value: string | number, item: HTMLDivElement) => void;
  onItemRemove?: (value: string | number, item: HTMLDivElement) => void;
  onClear?: () => void;
  onOptionAdd?: (value: string | number, data: TomOption) => void;
  onOptionRemove?: (value: string | number) => void;
  onOptionClear?: () => void;
  onOptionGroupAdd?: (value: string | number, data: TomOption) => void;
  onOptionGroupRemove?: (value: string | number) => void;
  onOptionGroupClear?: () => void;
  onDropdownOpen?: (dropdown: HTMLDivElement) => void;
  onDropdownClose?: (dropdown: HTMLDivElement) => void;
  onType?: (str: string) => void;
  onLoad?: (options: TomOption[], optgroups: TomOption[]) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onDelete?: (values: string[], evt: KeyboardEvent | MouseEvent) => boolean;
  render?: TomTemplates;
  firstUrl?: (query: string) => any;
  shouldLoadMore?: () => boolean;
}
