import { FlatpickrFn } from 'flatpickr/dist/types/instance.js';
import * as flatpickerNamespace from 'flatpickr';
const flatpickr = (flatpickerNamespace as any).default;
import { Form, Field, FieldValue, FormData } from '@forms.js/core';

export interface DateFieldOptions {
  id: string;
  name?: string;
  label?: string;
  type: 'date' | 'week' | 'datetime' | 'time' | 'daterange';
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

export class DaterangeField extends Field {
  public options: DateFieldOptions = {
    id: '',
    type: 'daterange',
    required: false,
    validation: (value, data, required) => {
      if (required && !value) return 'This field is required';
      return true;
    },
    className: 'form-input',
    options: {
      mode: 'range',
      altInput: true,
    },
  };

  private _flatpickr: FlatpickrFn | null = null;

  constructor(parent: HTMLElement, form: Form, options: DateFieldOptions) {
    super(parent, form, options);
    this.initializeOptions(options);
    this.onGui();
    this.initialize();
  }

  async initialize(): Promise<void> {
    this.load();
    this.update();
    this.initFlatpickr();
    this.bindChange();
  }

  getFlatpickr() {
    return this._flatpickr;
  }

  initFlatpickr(): void {
    if (this.inputElement) this._flatpickr = flatpickr(this.inputElement, this.options.options || {});
  }

  bindChange() {
    if (this.inputElement)
      this.inputElement.addEventListener('change', (event: any) => {
        this.change(event);
      });
  }

  createInputElement() {
    // Input element
    this.inputElement = document.createElement('input');
    this.inputElement.setAttribute('id', this.getId());
    this.inputElement.setAttribute('name', this.options.name || this.getId());
    this.inputElement.setAttribute('type', 'text');
    this.inputElement.className = this.options.className!;
    if (this.options.placeholder) this.inputElement.setAttribute('placeholder', this.options.placeholder);
  }

  getValue(): string | null {
    return this._value as string | null;
  }
}
