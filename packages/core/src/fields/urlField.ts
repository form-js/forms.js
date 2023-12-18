import { Field } from '../field.js';
import { Form } from '../form.js';
import { FieldOptions } from '../interfaces.js';

export class UrlField extends Field {
  public options: FieldOptions = {
    id: '',
    type: 'url',
    required: false,
    validation: (value, data, required) => {
      if (required && !value) return 'This field is required';
      if (value && typeof value === 'string' && !value.match(this._urlFormat)) return 'Not a valid url address.';
      return true;
    },
    default: "",
    className: 'form-input',
  };

  private _urlFormat =
    /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?$/i;

  constructor(parent: HTMLElement, form: Form, options: FieldOptions) {
    super(parent, form, options);
    this.initializeOptions(options);
    this.onGui();
    this.initialize();
  }
}
