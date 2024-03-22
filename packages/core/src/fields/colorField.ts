import { Field } from '../field';
import { Form } from '../form';
import { FieldOptions } from '../interfaces';

export class ColorField extends Field {
  public options: FieldOptions = {
    id: '',
    type: 'color',
    required: false,
    validation: (value, data, required) => {
      if (required && !value) return 'This field is required';
      return true;
    },
    default: null,
    className: 'form-input-color',
  };

  constructor(parent: HTMLElement, form: Form, options: FieldOptions) {
    super(parent, form, options);
    this.initializeOptions(options);
    this.onGui();
    this.initialize();
  }

  bindChange() {
    if (this.inputElement)
      this.inputElement.addEventListener('change', (event: any) => {
        this.change(event);
      });
  }

  getValue(): string | null {
    return this._value as string | null;
  }
}
