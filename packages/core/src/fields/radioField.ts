import {
  ARIA_DESCRIBEDBY_ATTRIBUTE,
  ARIA_INVALID_ATTRIBUTE,
  CHANGE_ATTRIBUTE,
  CHECKED_ATTRIBUTE,
  DEFAULT_REQUIRED_VALIDATION_MESSAGE,
  DIV_ELEMENT,
  FIELD_CONTAINER_CLASS_DEFAULT,
  FIELD_TYPE_RADIO,
  FORM_ERROR_CLASS_DEFAULT,
  FOR_ATTRIBUTE,
  ID_ATTRIBUTE,
  INPUT_ELEMENT,
  LABEL_CLASS_DEFAULT,
  LABEL_DEFINITION,
  LABEL_ELEMENT,
  NAME_ATTRIBUTE,
  PARAGRAPH_ELEMENT,
  RADIO_CLASS_DEFAULT,
  TYPE_ATTRIBUTE,
  VALUE_ATTRIBUTE,
} from '../constants';
import { Field } from '../field';
import { Form } from '../form';
import { FieldOptions, RadioFieldOptions } from '../interfaces';
import { HTMLElementEvent } from '../types';
import { mountElement } from '../utils';

export class RadioField extends Field {
  public options: RadioFieldOptions = {
    id: '',
    type: FIELD_TYPE_RADIO,
    schema: [],
    required: false,
    validation: (value, data, required) => {
      if (required && !value) return DEFAULT_REQUIRED_VALIDATION_MESSAGE;
      return true;
    },
    default: null,
    className: RADIO_CLASS_DEFAULT,
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
      if (el.value !== this.getValue() && el.hasAttribute(CHECKED_ATTRIBUTE)) el.removeAttribute(CHECKED_ATTRIBUTE);
      else if (el.value === this.getValue() && !el.hasAttribute(CHECKED_ATTRIBUTE))
        el.setAttribute(CHECKED_ATTRIBUTE, '');
    });
  }

  createRadioLabelElement(labelText: string, id: string, input: HTMLInputElement, container: HTMLElement) {
    // Label element
    const labelElement: HTMLElement = document.createElement(LABEL_ELEMENT);
    // Append input first
    if (input && labelElement) mountElement(input, labelElement);
    // Label text
    const label: HTMLElement = document.createElement(PARAGRAPH_ELEMENT);
    if (labelText) label.innerText = labelText;
    label.setAttribute(ID_ATTRIBUTE, id + LABEL_DEFINITION);
    labelElement.setAttribute(FOR_ATTRIBUTE, id);
    label.className = LABEL_CLASS_DEFAULT;
    labelElement.append(label);
    this.labelElements.push(labelElement);
    if (container && labelElement) mountElement(labelElement, container);
  }

  createRadioInputElement(id: string, value: string): HTMLInputElement {
    // Input element
    const inputElement: HTMLInputElement = document.createElement(INPUT_ELEMENT);
    inputElement.setAttribute(ID_ATTRIBUTE, id);
    inputElement.setAttribute(NAME_ATTRIBUTE, this.getId());
    inputElement.setAttribute(VALUE_ATTRIBUTE, value);
    if (this.options.default && value === this.options.default) inputElement.setAttribute(CHECKED_ATTRIBUTE, 'true');
    inputElement.setAttribute(TYPE_ATTRIBUTE, this.getType());
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
    label.setAttribute(ID_ATTRIBUTE, this.getId() + LABEL_DEFINITION);
    label.className = LABEL_CLASS_DEFAULT;

    const container: HTMLElement = document.createElement(DIV_ELEMENT);
    container.className = FIELD_CONTAINER_CLASS_DEFAULT;

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
        el?.classList.add(FORM_ERROR_CLASS_DEFAULT);
        el?.setAttribute(ARIA_INVALID_ATTRIBUTE, 'true');
        el?.setAttribute(ARIA_DESCRIBEDBY_ATTRIBUTE, this.validationElement?.getAttribute('id') || '');
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
        el?.classList.remove(FORM_ERROR_CLASS_DEFAULT);
        el?.removeAttribute(ARIA_INVALID_ATTRIBUTE);
        el?.removeAttribute(ARIA_DESCRIBEDBY_ATTRIBUTE);
      });
    }
    const form = this.getForm();
    form.updateError(this.getId(), this.getValidity());
  }

  bindChange() {
    if (this.inputElements[this.inputElements.length - 1])
      this.inputElements[this.inputElements.length - 1].addEventListener(CHANGE_ATTRIBUTE, (event: any) => {
        this.change(event);
      });
  }

  getValue(): string | null {
    return this._value as string | null;
  }
}
