import * as flatpickerNamespace from 'flatpickr';
const flatpickr = (flatpickerNamespace as any).default;
import { Field } from '../field';
import { Form } from '../form';
import { DateFieldOptions } from '../interfaces';
import weekSelectPlugin from 'flatpickr/dist/plugins/weekSelect/weekSelect';
import { FlatpickrFn } from 'flatpickr/dist/types/instance';
import {
  CHANGE_ATTRIBUTE,
  DEFAULT_REQUIRED_VALIDATION_MESSAGE,
  FIELD_TYPE_WEEK,
  ID_ATTRIBUTE,
  INPUT_CLASS_DEFAULT,
  INPUT_ELEMENT,
  NAME_ATTRIBUTE,
  PLACEHOLDER_ATTRIBUTE,
  TYPE_ATTRIBUTE,
} from '../constants';

export class WeekField extends Field {
  public options: DateFieldOptions = {
    id: '',
    type: FIELD_TYPE_WEEK,
    required: false,
    validation: (value, data, required) => {
      if (required && !value) return DEFAULT_REQUIRED_VALIDATION_MESSAGE;
      return true;
    },
    className: INPUT_CLASS_DEFAULT,
    enhance: true,
    options: {
      altInput: true,
      dateFormat: 'Y-W',
      altFormat: 'W, Y',
      plugins: [weekSelectPlugin()],
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
    if (this.inputElement && this.options.enhance)
      this._flatpickr = flatpickr(this.inputElement, this.options.options || {});
  }

  bindChange() {
    if (this.inputElement)
      this.inputElement.addEventListener(CHANGE_ATTRIBUTE, (event: any) => {
        this.change(event);
      });
  }

  createInputElement() {
    // Input element
    this.inputElement = document.createElement(INPUT_ELEMENT);
    this.inputElement.setAttribute(ID_ATTRIBUTE, this.getId());
    this.inputElement.setAttribute(NAME_ATTRIBUTE, this.options.name || this.getId());
    this.inputElement.setAttribute(TYPE_ATTRIBUTE, this.options.enhance ? 'text' : 'week');
    this.inputElement.className = this.options.className!;
    if (this.options.placeholder) this.inputElement.setAttribute(PLACEHOLDER_ATTRIBUTE, this.options.placeholder);
  }

  getValue(): string | null {
    return this._value as string | null;
  }
}
