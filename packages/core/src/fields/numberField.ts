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

  private bindMinMax(){
    if(this.inputElement){
      if (this.options.min) this.inputElement.setAttribute('min', String(this.options.min));
      if (this.options.max) this.inputElement.setAttribute('max', String(this.options.max));
      if (this.options.step) this.inputElement.setAttribute('step', String(this.options.step));
    }
  }
}
