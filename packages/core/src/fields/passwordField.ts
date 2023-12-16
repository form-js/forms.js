import { Field } from '../field.js';
import Form from '../form.js';
import { FieldOptions } from '../interfaces.js';

export class PasswordField extends Field {
  public options: FieldOptions = {
    id: '',
    type: 'password',
    required: false,
    validation: (value, data, required) => {
      if (required && !value) return 'This field is required';
      return true;
    },
    default: "",
    className: 'form-input',
  };

  constructor(parent: HTMLElement, form: Form, options: FieldOptions) {
    super(parent, form, options);
    this.initializeOptions(options);
    this.onGui();
    this.initialize();
  }
}
