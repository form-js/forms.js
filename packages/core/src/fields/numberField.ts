import { Field } from '../field';
import { Form } from '../form';
import { FieldOptions, NumberFieldOptions } from '../interfaces';

export class NumberField extends Field {
  public options: NumberFieldOptions = {
    id: '',
    type: 'number',
    required: false,
    validation: (value, data, required) => {
      if (required && !value && value !== 0) return 'This field is required';
      if (this.options.min && this.options.min > value) return 'The value should be bigger than ' + this.options.min;
      if (this.options.max && this.options.max < value) return 'The value should be less than ' + this.options.max;
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
    this.bindMinMax();
  }

  /**
   * Initializes the field, resetting it and binding change events.
   */
  async initialize(): Promise<void> {
    this.load();
    this.update();
    this.bindMinMax();
    this.bindChange();
  }

  private bindMinMax() {
    if (this.inputElement) {
      if (this.options.min) this.inputElement.setAttribute('min', String(this.options.min));
      if (this.options.max) this.inputElement.setAttribute('max', String(this.options.max));
      if (this.options.step) this.inputElement.setAttribute('step', String(this.options.step));
    }
  }

  getValue(): number | null {
    return this._value as number | null;
  }
}
