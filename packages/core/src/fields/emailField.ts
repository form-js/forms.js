import { Field } from '../field.js';
import { Form } from '../form.js';
import { FieldOptions } from '../interfaces.js';

export class EmailField extends Field {
  public options: FieldOptions = {
    id: '',
    type: 'text',
    required: false,
    validation: (value, data, required) => {
      if (required && !value) return 'This field is required';
      if (value && typeof value === 'string' && !value.match(this._mailFormat)) return 'Not a valid email address.';
      return true;
    },
    default: null,
    className: 'form-input',
  };

  private _mailFormat = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

  constructor(parent: HTMLElement, form: Form, options: FieldOptions) {
    super(parent, form, options);
    this.initializeOptions(options);
    this.onGui();
    this.initialize();
  }
}
