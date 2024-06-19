import {
  DEFAULT_REQUIRED_VALIDATION_MESSAGE,
  FIELD_TYPE_TEL,
  INPUT_CLASS_DEFAULT,
  INVALID_PHONE_VALIDATION_MESSAGE,
} from '../constants';
import { Field } from '../field';
import { Form } from '../form';
import { FieldOptions } from '../interfaces';

export class TelField extends Field {
  public options: FieldOptions = {
    id: '',
    type: FIELD_TYPE_TEL,
    required: false,
    validation: (value, data, required) => {
      if (required && !value) return DEFAULT_REQUIRED_VALIDATION_MESSAGE;
      if (value && typeof value === 'string' && !value.match(this.telFormat)) return INVALID_PHONE_VALIDATION_MESSAGE;
      return true;
    },
    default: null,
    className: INPUT_CLASS_DEFAULT,
  };

  public telFormat = /^\+?\d{1,3}?[-.\s]?\(?\d{1,4}?\)?([-.\s]?\d{1,9})*$/;
  
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
