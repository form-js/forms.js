import * as TomSelectNamespace from 'tom-select';
const TomSelect = (TomSelectNamespace as any).default;
import { Field } from '../field.js';
import { Form } from '../form.js';
import { SelectFieldOptions } from '../interfaces.js';
import { HTMLElementEvent, Option } from '../types.js';
import { debounce, mountElement } from '../utils.js';

export class SelectField extends Field {
  public options: SelectFieldOptions = {
    id: '',
    type: 'select',
    required: false,
    validation: (value, data, required) => {
      if (required && !value) return 'This field is required';
      return true;
    },
    enhance: true,
    multiple: false,
    optionsList: [],
    className: 'form-input-select',
    options: {},
  };

  private _tomselect: any;

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
      const value = this.getValue();

      for (let option of this.inputElement.options) {
        const hasValue = Array.isArray(value) ? value.includes(option.value) : value === option.value;
        if (hasValue && !option.hasAttribute('selected')) option.setAttribute('selected', '');
        if (!hasValue && option.hasAttribute('selected')) option.removeAttribute('selected');
      }
    } else if (this.options.enhance === true && this._tomselect) {
      const value = this.getValue();
      if (value !== this._tomselect.getValue()) this._tomselect.setValue(value, true);
    }
  }

  bindChange(): void {
    if (this.inputElement) this.inputElement.addEventListener('change', debounce(this.change, 25, this));
  }

  getTomselect() {
    return this._tomselect;
  }

  initTomselect(): void {
    if (this.inputElement && this.options.enhance)
      this._tomselect = new TomSelect(this.inputElement, this.options.options || {});
  }

  handleDisabled() {
    if (this.isDisabled()) {
      this.inputElement?.setAttribute('disabled', 'true');
      if (this._tomselect) this._tomselect.disable();
    } else {
      this.inputElement?.removeAttribute('disabled');
      if (this._tomselect) this._tomselect.enable();
    }
  }

  createSelectElement() {
    // Input element
    this.inputElement = document.createElement('select');
    this.inputElement.setAttribute('id', this.getId());
    this.inputElement.setAttribute('name', this.options.name || this.getId());
    this.inputElement.setAttribute('type', this.getType());
    if (this.options.multiple) this.inputElement.setAttribute('multiple', '');
    this.inputElement.className = this.options.className!;
    this.options.optionsList?.forEach((option: Option) => {
      const optionElement: HTMLOptionElement = document.createElement('option');
      optionElement.setAttribute('value', option.value);
      if (this.options.default && Array.isArray(this.options.default) && this.options.default.includes(option.value))
        optionElement.setAttribute('selected', 'true');
      else if (this.options.default && this.options.default === option.value)
        optionElement.setAttribute('selected', 'true');
      if (option.disabled) optionElement.setAttribute('disabled', String(option.disabled));
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
}
