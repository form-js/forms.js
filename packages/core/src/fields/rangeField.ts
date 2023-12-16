import { Field } from '../field.js';
import Form from '../form.js';
import { NumberFieldOptions } from '../interfaces.js';
import { mountElement } from '../utils.js';

export class RangeField extends Field {
  public options: NumberFieldOptions = {
    id: '',
    type: 'range',
    required: false,
    validation: (value, data, required) => {
      if (required && !value && value !== 0) return 'This field is required';
      return true;
    },
    default: 0,
    className: 'form-input-range',
  };

  public minElement: HTMLElement | null = null;
  public maxElement: HTMLElement | null = null;
  public valueElement: HTMLElement | null = null;

  constructor(parent: HTMLElement, form: Form, options: NumberFieldOptions) {
    super(parent, form, options);
    this.initializeOptions(options);
    this.onGui();
    this.initialize();
  }

  createInputElement() {
    // Input element
    this.inputElement = document.createElement('input');
    this.inputElement.setAttribute('id', this.getId());
    this.inputElement.setAttribute('name', this.options.name || this.getId());
    this.inputElement.setAttribute('type', this.getType());
    if (this.options.min) this.inputElement.setAttribute('min', String(this.options.min));
    if (this.options.max) this.inputElement.setAttribute('max', String(this.options.max));
    if (this.options.step) this.inputElement.setAttribute('step', String(this.options.step));
    this.inputElement.className = this.options.className!;
  }

  createOtherElements() {
    this.minElement = document.createElement('span');
    this.minElement.setAttribute('id', this.getId() + '_min');
    this.minElement.className = 'form-input-range-min';
    this.maxElement = document.createElement('span');
    this.maxElement.setAttribute('id', this.getId() + '_max');
    this.maxElement.className = 'form-input-range-max';
    this.valueElement = document.createElement('output');
    this.valueElement.setAttribute('id', this.getId() + '_value');
    this.valueElement.className = 'form-input-range-value';
  }

  onGui() {
    this.createContainerElement();
    this.createInputElement();
    this.createLabelElement();
    this.createValidationElement();
    this.createOtherElements();

    // Append elements
    if (this.inputElement && this.labelElement) mountElement(this.inputElement, this.labelElement);
    if (this.labelElement && this.validationElement) mountElement(this.validationElement, this.labelElement);
    if (this.labelElement && this.valueElement) mountElement(this.valueElement, this.labelElement);
    if (this.containerElement && this.labelElement) mountElement(this.labelElement, this.containerElement);
  }

  updateRangeValues() {
    if (this.minElement && this.options.min !== undefined) this.minElement.innerText = String(this.options.min);
    if (this.maxElement && this.options.max !== undefined) this.maxElement.innerText = String(this.options.max);
    // @ts-ignore
    if (this.valueElement) this.valueElement.innerText = this.getValue();
    setTimeout(() => {
      if (this.inputElement && this.valueElement)
        this.inputElement.style.paddingRight = this.valueElement.clientWidth + 5 + 'px';
    }, 10);
  }

  /**
   * Initializes the field, resetting it and binding change events.
   */
  async initialize(): Promise<void> {
    this.load();
    this.update();
    this.bindChange();
    this.updateRangeValues();
  }

  async reset(): Promise<void> {
    localStorage.removeItem(this.getSaveKey());
    this.setValue(this.options.default ?? null, false);
    this.updateRangeValues();
    this.update();
  }

  bindChange() {
    if (this.inputElement) {
      this.inputElement.addEventListener('change', (event: any) => {
        this.change(event);
        this.updateRangeValues();
      });
    }
  }
}
