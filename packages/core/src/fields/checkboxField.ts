import { Field } from '../field.js';
import { Form } from '../form.js';
import { CheckboxFieldOptions } from '../interfaces.js';
import { HTMLElementEvent } from '../types.js';
import { mountElement } from '../utils.js';

export class CheckboxField extends Field {
  public options: CheckboxFieldOptions = {
    id: '',
    type: 'checkbox',
    required: false,
    validation: (value, data, required) => {
      if (required && !value) return 'This field is required';
      return true;
    },
    default: null,
    className: 'form-input-checkbox',
    toggle: false,
  };
  public sliderElement: HTMLElement | null = null;

  constructor(parent: HTMLElement, form: Form, options: CheckboxFieldOptions) {
    super(parent, form, options);
    this.initializeOptions(options);
    this.onGui();
    this.initialize();
  }

  /**
   * Synchronizes fields value with input element
   */
  syncValue(): void {
    if (this.inputElement && this.inputElement instanceof HTMLInputElement) {
      if (this.getValue() && !this.inputElement.hasAttribute('checked')) {
        this.inputElement.setAttribute('checked', String(this.getValue()));
      } else if (!this.getValue() && this.inputElement.hasAttribute('checked'))
        this.inputElement.removeAttribute('checked');
    }
  }

  createContainerElement() {
    // Container element
    this.containerElement = document.createElement('div');
    this.containerElement.className = 'form-field ' + this.getType();
    if (this.options.toggle) this.containerElement.className += ' is-toggle';
    this.containerElement.setAttribute('id', this.getId() + '_container');
  }

  createLabelElement() {
    // Label element
    this.labelElement = document.createElement('label');
    // Append input first
    if (this.inputElement && this.labelElement) mountElement(this.inputElement, this.labelElement);
    if (this.sliderElement && this.labelElement) mountElement(this.sliderElement, this.labelElement);
    // Label text
    const label: HTMLElement = document.createElement('p');
    if (this.options.label) label.innerText = this.options.label;
    label.setAttribute('id', this.getId() + '_label');
    this.labelElement.setAttribute('for', this.options.name || this.getId());
    label.className = 'form-field-label';
    if (this.options.label) mountElement(label, this.labelElement);
  }

  createInputElement() {
    // Input element
    this.inputElement = document.createElement('input');
    this.inputElement.setAttribute('id', this.getId());
    this.inputElement.setAttribute('name', this.options.name || this.getId());
    this.inputElement.setAttribute('type', this.getType());
    if (this.options.default) this.inputElement.setAttribute('checked', String(this.options.default));
    this.inputElement.className = this.options.className!;
  }

  createToggleSpan() {
    this.sliderElement = document.createElement('span');
    this.sliderElement.className = 'toggle-slider';
  }

  onGui() {
    this.createContainerElement();
    if (this.options.toggle) this.createToggleSpan();
    this.createInputElement();
    this.createLabelElement();
    this.createValidationElement();
    // Append elements
    if (this.containerElement && this.labelElement) mountElement(this.labelElement, this.containerElement);
    if (this.labelElement && this.validationElement) mountElement(this.validationElement, this.labelElement);
  }

  bindChange() {
    if (this.inputElement)
      this.inputElement.addEventListener('change', (event: any) => {
        this.change(event);
      });
  }

  change(event: HTMLElementEvent<HTMLInputElement>): void {
    this.setValue(event.target.checked);
    if (this.options.change) this.options.change(this.getValue());
    this.validate();
  }

  getValue(): boolean | null {
    return this._value as boolean | null;
  }
}
