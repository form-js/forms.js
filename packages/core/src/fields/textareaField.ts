import { Field } from '../field.js';
import { Form } from '../form.js';
import { TextareaFieldOptions } from '../interfaces.js';

export class TextareaField extends Field {
  public options: TextareaFieldOptions = {
    id: '',
    type: 'textarea',
    required: false,
    validation: (value, data, required) => {
      if (required && !value) return 'This field is required';
      return true;
    },
    className: 'form-input',
    rows: 5,
  };
  public inputElement: HTMLTextAreaElement | null = null;

  createInputElement() {
    // Input element
    this.inputElement = document.createElement('textarea');
    this.inputElement.setAttribute('id', this.getId());
    this.inputElement.setAttribute('name', this.options.name || this.getId());
    if (this.options.rows) this.inputElement.setAttribute('rows', String(this.options.rows));
    this.inputElement.setAttribute('type', this.getType());
    this.inputElement.className = this.options.className!;
    if (this.options.placeholder) this.inputElement.setAttribute('placeholder', this.options.placeholder);
  }

  constructor(parent: HTMLElement, form: Form, options: TextareaFieldOptions) {
    super(parent, form, options);
    this.initializeOptions(options);
    this.onGui();
    this.initialize();
  }
}
