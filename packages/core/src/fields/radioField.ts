import { Field } from '../field';
import { Form } from '../form';
import { FieldOptions, RadioFieldOptions } from '../interfaces';
import { HTMLElementEvent } from '../types';
import { mountElement } from '../utils';

export class RadioField extends Field {
  public options: RadioFieldOptions = {
    id: '',
    type: 'radio',
    schema: [],
    required: false,
    validation: (value, data, required) => {
      if (required && !value) return 'This field is required';
      return true;
    },
    default: null,
    className: 'form-input-radio',
  };

  public inputElements: HTMLInputElement[] = [];
  public labelElements: HTMLElement[] = [];

  constructor(parent: HTMLElement, form: Form, options: RadioFieldOptions) {
    super(parent, form, options);
    this.initializeOptions(options);
    this.onGui();
    this.initialize();
  }

  async initialize(): Promise<void> {
    this.load();
    this.update();
    this.handleVisibility();
  }

  /**
   * Synchronizes fields value with input element
   */
  syncValue(): void {
    this.inputElements.forEach((el: HTMLInputElement) => {
      if (el.value !== this.getValue() && el.hasAttribute('checked')) el.removeAttribute('checked');
      else if (el.value === this.getValue() && !el.hasAttribute('checked')) el.setAttribute('checked', '');
    });
  }

  createRadioLabelElement(labelText: string, id: string, input: HTMLInputElement, container: HTMLElement) {
    // Label element
    const labelElement: HTMLElement = document.createElement('label');
    // Append input first
    if (input && labelElement) mountElement(input, labelElement);
    // Label text
    const label: HTMLElement = document.createElement('p');
    if (labelText) label.innerText = labelText;
    label.setAttribute('id', id + '_label');
    labelElement.setAttribute('for', id);
    label.className = 'form-field-label';
    labelElement.append(label);
    this.labelElements.push(labelElement);
    if (container && labelElement) mountElement(labelElement, container);
  }

  createRadioInputElement(id: string, value: string): HTMLInputElement {
    // Input element
    const inputElement: HTMLInputElement = document.createElement('input');
    inputElement.setAttribute('id', id);
    inputElement.setAttribute('name', this.getId());
    inputElement.setAttribute('value', value);
    if (this.options.default && value === this.options.default) inputElement.setAttribute('checked', 'true');
    inputElement.setAttribute('type', this.getType());
    inputElement.className = this.options.className!;
    this.inputElements.push(inputElement);
    this.bindChange();
    return inputElement;
  }

  onGui() {
    this.createContainerElement();
    const label: HTMLElement = document.createElement('p');
    if (this.options.label) label.innerText = this.options.label;
    if (this.options.label && this.containerElement) mountElement(label, this.containerElement);
    label.setAttribute('id', this.getId() + '_label');
    label.className = 'form-field-label';

    const container: HTMLElement = document.createElement('div');
    container.className = 'form-field-container';

    this.options.schema.forEach((field) => {
      const input = this.createRadioInputElement(field.id, field.value);
      this.createRadioLabelElement(field.label, field.id, input, container);
    });

    if (this.containerElement && container) mountElement(container, this.containerElement);

    this.createValidationElement();

    // Append elements
    if (this.containerElement && this.validationElement) mountElement(this.validationElement, this.containerElement);
  }

  handleValidatedField(): void {
    if (!this.getValidity()) {
      this.inputElements.forEach((el) => {
        el?.classList.add('form-error');
        el?.setAttribute('aria-invalid', 'true');
        el?.setAttribute('aria-describedby', this.validationElement?.getAttribute('id') || '');
      });
      const vMessage = this.getValidationMessage();
      if (this.validationElement && vMessage) {
        this.validationElement.innerText = vMessage;
        this.validationElement.style.display = 'block';
      }
    } else {
      if (this.validationElement) {
        this.validationElement.style.display = 'none';
      }
      this.inputElements.forEach((el) => {
        el?.classList.remove('form-error');
        el?.removeAttribute('aria-invalid');
        el?.removeAttribute('aria-describedby');
      });
    }
    const form = this.getForm();
    form.updateError(this.getId(), this.getValidity());
  }

  bindChange() {
    if (this.inputElements[this.inputElements.length - 1])
      this.inputElements[this.inputElements.length - 1].addEventListener('change', (event: any) => {
        this.change(event);
      });
  }

  getValue(): string | null {
    return this._value as string | null;
  }
}
