import {
  DEFAULT_REQUIRED_VALIDATION_MESSAGE,
  FIELD_TYPE_URL,
  INPUT_CLASS_DEFAULT,
  INVALID_URL_VALIDATION_MESSAGE,
} from '../constants';
import { Field } from '../field';
import { Form } from '../form';
import { FieldOptions } from '../interfaces';

export class UrlField extends Field {
  public options: FieldOptions = {
    id: '',
    type: FIELD_TYPE_URL,
    required: false,
    validation: (value, data, required) => {
      if (required && !value) return DEFAULT_REQUIRED_VALIDATION_MESSAGE;
      if (value && typeof value === 'string' && !value.match(this.urlFormat)) return INVALID_URL_VALIDATION_MESSAGE;
      return true;
    },
    default: '',
    className: INPUT_CLASS_DEFAULT,
  };

  public urlFormat =
    /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?$/i;

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
