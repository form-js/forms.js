import { Field } from '../field.js';
import { Form } from '../form.js';
import { FieldOptions, NumberFieldOptions } from '../interfaces.js';

export class NumberField extends Field {
  public options: NumberFieldOptions = {
    id: '',
    type: 'number',
    required: false,
    validation: (value, data, required) => {
      if (required && !value) return 'This field is required';
      return true;
    },
    default: null,
    className: 'form-input',
  };

  constructor(parent: HTMLElement, form: Form, options: NumberFieldOptions) {
    super(parent, form, options);
    this.initializeOptions(options);
    this.onGui();
    this.initialize();
  }
}
