import TomSelect, * as TomSelectNamespace from 'tom-select';
const TomSelectInitiator = (TomSelectNamespace as any).default;
import { Field } from '../field';
import { Form } from '../form';
import { SelectFieldOptions } from '../interfaces';
import { FieldValue, HTMLElementEvent, Option, SelectFieldValue } from '../types';
import { debounce, mountElement } from '../utils';
import {
  CHANGE_ATTRIBUTE,
  DEFAULT_REQUIRED_VALIDATION_MESSAGE,
  DISABLED_ATTRIBUTE,
  ID_ATTRIBUTE,
  MULTIPLE_ATTRIBUTE,
  NAME_ATTRIBUTE,
  OPTION_ELEMENT,
  PLACEHOLDER_ATTRIBUTE,
  SELECTED_ATTRIBUTE,
  SELECT_CLASS_DEFAULT,
  SELECT_ELEMENT,
  TYPE_ATTRIBUTE,
  VALUE_ATTRIBUTE,
} from '../constants';

export class SelectField extends Field {
  public options: SelectFieldOptions = {
    id: '',
    type: 'select',
    required: false,
    validation: (value, data, required) => {
      if (required && !value) return DEFAULT_REQUIRED_VALIDATION_MESSAGE;
      return true;
    },
    enhance: true,
    multiple: false,
    optionsList: [],
    className: SELECT_CLASS_DEFAULT,
    options: {},
  };

  private _tomselect: TomSelect | null = null;

  constructor(parent: HTMLElement, form: Form, options: SelectFieldOptions) {
    super(parent, form, options);
    this.initializeOptions(options);
    this.onGui();
    this.initialize();
  }

  async initialize(): Promise<void> {
    this.initTomselect();
    this.load();
    this.update();
    this.bindChange();
  }

  /**
   * Synchronizes fields value with input element
   */
  syncValue(): void {
    if (this.inputElement && this.inputElement instanceof HTMLSelectElement && this.options.enhance === false) {
      const value: SelectFieldValue = this.getValue();

      for (const option of this.inputElement.options) {
        const hasValue =
          value && Array.isArray(value) ? value?.some((val) => val === option.value) : value === option.value;
        if (hasValue && !option.hasAttribute(SELECTED_ATTRIBUTE)) option.setAttribute(SELECTED_ATTRIBUTE, '');
        if (!hasValue && option.hasAttribute(SELECTED_ATTRIBUTE)) option.removeAttribute(SELECTED_ATTRIBUTE);
      }
    } else if (this.options.enhance === true && this._tomselect) {
      const value: SelectFieldValue = this.getValue();
      if (value !== this._tomselect.getValue()) {
        if (typeof value === 'string' || Array.isArray(value)) this._tomselect.setValue(value, true);
      }
    }
  }

  bindChange(): void {
    if (this.inputElement) this.inputElement.addEventListener(CHANGE_ATTRIBUTE, debounce(this.change, 25, this));
  }

  getTomselect(): TomSelect | null {
    return this._tomselect;
  }

  initTomselect(): void {
    if (this.inputElement && this.options.enhance)
      this._tomselect = new TomSelectInitiator(this.inputElement, this.options.options || {});
  }

  handleDisabled() {
    if (this.isDisabled()) {
      this.inputElement?.setAttribute(DISABLED_ATTRIBUTE, 'true');
      if (this._tomselect) this._tomselect.disable();
    } else {
      this.inputElement?.removeAttribute(DISABLED_ATTRIBUTE);
      if (this._tomselect) this._tomselect.enable();
    }
  }

  createSelectElement() {
    // Input element
    this.inputElement = document.createElement(SELECT_ELEMENT);
    this.inputElement.setAttribute(ID_ATTRIBUTE, this.getId());
    this.inputElement.setAttribute(NAME_ATTRIBUTE, this.options.name || this.getId());
    this.inputElement.setAttribute(TYPE_ATTRIBUTE, this.getType());
    if (this.options.multiple) this.inputElement.setAttribute(MULTIPLE_ATTRIBUTE, '');
    if (this.options.placeholder) this.inputElement.setAttribute(PLACEHOLDER_ATTRIBUTE, this.options.placeholder);
    this.inputElement.className = this.options.className!;
    this.options.optionsList?.forEach((option: Option) => {
      const optionElement: HTMLOptionElement = document.createElement(OPTION_ELEMENT);
      optionElement.setAttribute(VALUE_ATTRIBUTE, option.value);
      if (
        typeof option.value === 'string' &&
        this.options.default &&
        Array.isArray(this.options.default) &&
        this.options.default?.findIndex((val) => val === option.value) >= 0
      ) {
        optionElement.setAttribute(SELECTED_ATTRIBUTE, 'true');
      } else if (this.options.default && this.options.default === option.value) {
        optionElement.setAttribute(SELECTED_ATTRIBUTE, 'true');
      }

      if (option.disabled) optionElement.setAttribute(DISABLED_ATTRIBUTE, String(option.disabled));
      optionElement.innerText = option.label;
      this.inputElement?.append(optionElement);
    });
  }

  onGui() {
    this.createContainerElement();
    this.createSelectElement();
    this.createLabelElement();
    this.createValidationElement();
    // Append elements
    if (this.inputElement && this.labelElement) mountElement(this.inputElement, this.labelElement);
    if (this.labelElement && this.validationElement) mountElement(this.validationElement, this.labelElement);
    if (this.containerElement && this.labelElement) mountElement(this.labelElement, this.containerElement);
  }

  /**
   * Event handler for the input element's change event.
   * @param event - The change event.
   */
  change(event: HTMLElementEvent<HTMLInputElement>): void {
    if (this.options.enhance && this._tomselect) {
      this.setValue(this._tomselect.getValue());
    } else if (this.inputElement && this.inputElement instanceof HTMLSelectElement) {
      if (this.options.multiple) {
        const options = this.inputElement.options;
        const selectedValues = [];

        for (let i = 0; i < options.length; i++) {
          if (options[i].selected) {
            selectedValues.push(options[i].value);
          }
        }

        this.setValue(selectedValues);
      } else {
        this.setValue(event.target.value);
      }
    }
    this.validate();
    if (this.options.change) this.options.change(this.getValue());
  }

  getValue(): SelectFieldValue {
    return this._value as SelectFieldValue;
  }
}
