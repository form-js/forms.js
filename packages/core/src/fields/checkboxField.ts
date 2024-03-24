import {
  CHANGE_ATTRIBUTE,
  CHECKBOX_CLASS_DEFAULT,
  CHECKED_ATTRIBUTE,
  CONTAINER_DEFINITION,
  DEFAULT_REQUIRED_VALIDATION_MESSAGE,
  DIV_ELEMENT,
  FIELD_CLASS_DEFAULT,
  FOR_ATTRIBUTE,
  ID_ATTRIBUTE,
  INPUT_ELEMENT,
  LABEL_CLASS_DEFAULT,
  LABEL_DEFINITION,
  LABEL_ELEMENT,
  NAME_ATTRIBUTE,
  PARAGRAPH_ELEMENT,
  SPAN_ELEMENT,
  TOGGLE_CLASS_DEFAULT,
  TOGGLE_SLIDER_CLASS_DEFAULT,
  TYPE_ATTRIBUTE,
} from '../constants';
import { Field } from '../field';
import { Form } from '../form';
import { CheckboxFieldOptions } from '../interfaces';
import { HTMLElementEvent } from '../types';
import { mountElement } from '../utils';

export class CheckboxField extends Field {
  public options: CheckboxFieldOptions = {
    id: '',
    type: 'checkbox',
    required: false,
    validation: (value, data, required) => {
      if (required && !value) return DEFAULT_REQUIRED_VALIDATION_MESSAGE;
      return true;
    },
    default: null,
    className: CHECKBOX_CLASS_DEFAULT,
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
      if (this.getValue() && !this.inputElement.hasAttribute(CHECKED_ATTRIBUTE)) {
        this.inputElement.setAttribute(CHECKED_ATTRIBUTE, String(this.getValue()));
      } else if (!this.getValue() && this.inputElement.hasAttribute(CHECKED_ATTRIBUTE))
        this.inputElement.removeAttribute(CHECKED_ATTRIBUTE);
    }
  }

  createContainerElement() {
    // Container element
    this.containerElement = document.createElement(DIV_ELEMENT);
    this.containerElement.className = FIELD_CLASS_DEFAULT + ' ' + this.getType();
    if (this.options.toggle) this.containerElement.className += ' ' + TOGGLE_CLASS_DEFAULT;
    this.containerElement.setAttribute(ID_ATTRIBUTE, this.getId() + CONTAINER_DEFINITION);
  }

  createLabelElement() {
    // Label element
    this.labelElement = document.createElement(LABEL_ELEMENT);
    // Append input first
    if (this.inputElement && this.labelElement) mountElement(this.inputElement, this.labelElement);
    if (this.sliderElement && this.labelElement) mountElement(this.sliderElement, this.labelElement);
    // Label text
    const label: HTMLElement = document.createElement(PARAGRAPH_ELEMENT);
    if (this.options.label) label.innerText = this.options.label;
    label.setAttribute(ID_ATTRIBUTE, this.getId() + LABEL_DEFINITION);
    this.labelElement.setAttribute(FOR_ATTRIBUTE, this.options.name || this.getId());
    label.className = LABEL_CLASS_DEFAULT;
    if (this.options.label) mountElement(label, this.labelElement);
  }

  createInputElement() {
    // Input element
    this.inputElement = document.createElement(INPUT_ELEMENT);
    this.inputElement.setAttribute(ID_ATTRIBUTE, this.getId());
    this.inputElement.setAttribute(NAME_ATTRIBUTE, this.options.name || this.getId());
    this.inputElement.setAttribute(TYPE_ATTRIBUTE, this.getType());
    if (this.options.default) this.inputElement.setAttribute(CHECKED_ATTRIBUTE, String(this.options.default));
    this.inputElement.className = this.options.className!;
  }

  createToggleSpan() {
    this.sliderElement = document.createElement(SPAN_ELEMENT);
    this.sliderElement.className = TOGGLE_SLIDER_CLASS_DEFAULT;
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
      this.inputElement.addEventListener(CHANGE_ATTRIBUTE, (event: any) => {
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
