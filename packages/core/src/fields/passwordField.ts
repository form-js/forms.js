import { DEFAULT_REQUIRED_VALIDATION_MESSAGE, FIELD_TYPE_PASSWORD, INPUT_CLASS_DEFAULT } from '../constants';
import { Field } from '../field';
import { Form } from '../form';
import { FieldOptions } from '../interfaces';

export class PasswordField extends Field {
  public options: FieldOptions = {
    id: '',
    type: FIELD_TYPE_PASSWORD,
    required: false,
    validation: (value, data, required) => {
      if (required && !value) return DEFAULT_REQUIRED_VALIDATION_MESSAGE;
      return true;
    },
    default: '',
    className: INPUT_CLASS_DEFAULT,
  };

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
