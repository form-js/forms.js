import { DEFAULT_REQUIRED_VALIDATION_MESSAGE, INPUT_CLASS_DEFAULT, INVALID_EMAIL_VALIDATION_MESSAGE } from '../constants';
import { Field } from '../field';
import { Form } from '../form';
import { FieldOptions } from '../interfaces';

export class EmailField extends Field {
  public options: FieldOptions = {
    id: '',
    type: 'text',
    required: false,
    validation: (value, data, required) => {
      if (required && !value) return DEFAULT_REQUIRED_VALIDATION_MESSAGE;
      if (value && typeof value === 'string' && !value.match(this.mailFormat)) return INVALID_EMAIL_VALIDATION_MESSAGE;
      return true;
    },
    default: '',
    className: INPUT_CLASS_DEFAULT,
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
