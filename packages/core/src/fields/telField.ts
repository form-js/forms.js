import { Field } from '../field.js';
import { Form } from '../form.js';
import { FieldOptions } from '../interfaces.js';

export class TelField extends Field {
  public options: FieldOptions = {
    id: '',
    type: 'tel',
    required: false,
    validation: (value, data, required) => {
      if (required && !value) return 'This field is required';
      if (value && typeof value === 'string' && !value.match(this._telFormat)) return 'Not a valid telephone number.';
      return true;
    },
    default: null,
    className: 'form-input',
  };

  private _telFormat = /^\+[1-9]\d{1,14}$/;

  constructor(parent: HTMLElement, form: Form, options: FieldOptions) {
    super(parent, form, options);
    this.initializeOptions(options);
    this.onGui();
    this.initialize();
  }
}
