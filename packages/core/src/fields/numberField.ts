import { BIGGER_THAN_VALIDATION_MESSAGE, DEFAULT_REQUIRED_VALIDATION_MESSAGE, INPUT_CLASS_DEFAULT, LESS_THAN_VALIDATION_MESSAGE, MAX_ATTRIBUTE, MIN_ATTRIBUTE, STEP_ATTRIBUTE } from '../constants';
import { Field } from '../field';
import { Form } from '../form';
import { FieldOptions, NumberFieldOptions } from '../interfaces';

export class NumberField extends Field {
  public options: NumberFieldOptions = {
    id: '',
    type: 'number',
    required: false,
    validation: (value, data, required) => {
      if (required && !value && value !== 0) return DEFAULT_REQUIRED_VALIDATION_MESSAGE;
      if (this.options.min && this.options.min > value) return BIGGER_THAN_VALIDATION_MESSAGE + this.options.min;
      if (this.options.max && this.options.max < value) return LESS_THAN_VALIDATION_MESSAGE + this.options.max;
      return true;
    },
    default: null,
    className: INPUT_CLASS_DEFAULT,
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
      if (this.options.min) this.inputElement.setAttribute(MIN_ATTRIBUTE, String(this.options.min));
      if (this.options.max) this.inputElement.setAttribute(MAX_ATTRIBUTE, String(this.options.max));
      if (this.options.step) this.inputElement.setAttribute(STEP_ATTRIBUTE, String(this.options.step));
    }
  }

  getValue(): number | null {
    return this._value as number | null;
  }
}
