import { Field } from '../field';
import { Form } from '../form';
import { FieldOptions } from '../interfaces';

export class EmailField extends Field {
  public options: FieldOptions = {
    id: '',
    type: 'text',
    required: false,
    validation: (value, data, required) => {
      if (required && !value) return 'This field is required';
      if (value && typeof value === 'string' && !value.match(this.mailFormat)) return 'Not a valid email address.';
      return true;
    },
    default: '',
    className: 'form-input',
  };

  public mailFormat = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  constructor(parent: HTMLElement, form: Form, options: FieldOptions) {
    super(parent, form, options);
    this.initializeOptions(options);
    this.onGui();
    this.initialize();
  }

  getValue(): string | null {
    return this._value as string | null;
  }
}
