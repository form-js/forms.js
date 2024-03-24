import { DEFAULT_REQUIRED_VALIDATION_MESSAGE, INPUT_CLASS_DEFAULT, INVALID_PHONE_VALIDATION_MESSAGE } from '../constants';
import { Field } from '../field';
import { Form } from '../form';
import { FieldOptions } from '../interfaces';

export class TelField extends Field {
  public options: FieldOptions = {
    id: '',
    type: 'tel',
    required: false,
    validation: (value, data, required) => {
      if (required && !value) return DEFAULT_REQUIRED_VALIDATION_MESSAGE;
      if (value && typeof value === 'string' && !value.match(this.telFormat)) return INVALID_PHONE_VALIDATION_MESSAGE;
      return true;
    },
    default: null,
    className: INPUT_CLASS_DEFAULT,
  };

  public telFormat = /^\+[1-9]\d{1,14}$/;

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
