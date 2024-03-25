import {
  DEFAULT_REQUIRED_VALIDATION_MESSAGE,
  FIELD_TYPE_TEXTAREA,
  ID_ATTRIBUTE,
  INPUT_CLASS_DEFAULT,
  NAME_ATTRIBUTE,
  PLACEHOLDER_ATTRIBUTE,
  ROWS_ATTRIBUTE,
  TEXTAREA_ELEMENT,
  TYPE_ATTRIBUTE,
} from '../constants';
import { Field } from '../field';
import { Form } from '../form';
import { TextareaFieldOptions } from '../interfaces';

export class TextareaField extends Field {
  public options: TextareaFieldOptions = {
    id: '',
    type: FIELD_TYPE_TEXTAREA,
    required: false,
    validation: (value, data, required) => {
      if (required && !value) return DEFAULT_REQUIRED_VALIDATION_MESSAGE;
      return true;
    },
    className: INPUT_CLASS_DEFAULT,
    rows: 5,
  };
  public inputElement: HTMLTextAreaElement | null = null;

  createInputElement() {
    // Input element
    this.inputElement = document.createElement(TEXTAREA_ELEMENT);
    this.inputElement.setAttribute(ID_ATTRIBUTE, this.getId());
    this.inputElement.setAttribute(NAME_ATTRIBUTE, this.options.name || this.getId());
    if (this.options.rows) this.inputElement.setAttribute(ROWS_ATTRIBUTE, String(this.options.rows));
    this.inputElement.setAttribute(TYPE_ATTRIBUTE, this.getType());
    this.inputElement.className = this.options.className!;
    if (this.options.placeholder) this.inputElement.setAttribute(PLACEHOLDER_ATTRIBUTE, this.options.placeholder);
  }

  constructor(parent: HTMLElement, form: Form, options: TextareaFieldOptions) {
    super(parent, form, options);
    this.initializeOptions(options);
    this.onGui();
    this.initialize();
  }

  getValue(): string | null {
    return this._value as string | null;
  }
}
