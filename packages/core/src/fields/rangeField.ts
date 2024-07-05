import {
  BIGGER_THAN_VALIDATION_MESSAGE,
  CHANGE_ATTRIBUTE,
  DEFAULT_REQUIRED_VALIDATION_MESSAGE,
  FIELD_TYPE_RANGE,
  FieldEvents,
  ID_ATTRIBUTE,
  INPUT_ELEMENT,
  LESS_THAN_VALIDATION_MESSAGE,
  MAX_ATTRIBUTE,
  MAX_DEFINITION,
  MIN_ATTRIBUTE,
  MIN_DEFINITION,
  NAME_ATTRIBUTE,
  OUTPUT_ELEMENT,
  RANGE_CLASS_DEFAULT,
  RANGE_MAX_CLASS_DEFAULT,
  RANGE_MIN_CLASS_DEFAULT,
  RANGE_VALUE_CLASS_DEFAULT,
  SPAN_ELEMENT,
  STEP_ATTRIBUTE,
  TYPE_ATTRIBUTE,
  VALUE_DEFINITION,
} from '../constants';
import { Field } from '../field';
import { Form } from '../form';
import { NumberFieldOptions } from '../interfaces';
import { mountElement } from '../utils';

export class RangeField extends Field {
  public options: NumberFieldOptions = {
    id: '',
    type: FIELD_TYPE_RANGE,
    required: false,
    validation: (value, data, required) => {
      if (required && !value && value !== 0) return DEFAULT_REQUIRED_VALIDATION_MESSAGE;
      if (this.options.min && this.options.min > value) return BIGGER_THAN_VALIDATION_MESSAGE + this.options.min;
      if (this.options.max && this.options.max < value) return LESS_THAN_VALIDATION_MESSAGE + this.options.max;
      return true;
    },
    default: 0,
    className: RANGE_CLASS_DEFAULT,
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
    this.inputElement = document.createElement(INPUT_ELEMENT);
    this.inputElement.setAttribute(ID_ATTRIBUTE, this.getId());
    this.inputElement.setAttribute(NAME_ATTRIBUTE, this.options.name || this.getId());
    this.inputElement.setAttribute(TYPE_ATTRIBUTE, this.getType());
    if (this.options.min) this.inputElement.setAttribute(MIN_ATTRIBUTE, String(this.options.min));
    if (this.options.max) this.inputElement.setAttribute(MAX_ATTRIBUTE, String(this.options.max));
    if (this.options.step) this.inputElement.setAttribute(STEP_ATTRIBUTE, String(this.options.step));
    this.inputElement.className = this.options.className!;
  }

  createOtherElements() {
    this.minElement = document.createElement(SPAN_ELEMENT);
    this.minElement.setAttribute(ID_ATTRIBUTE, this.getId() + MIN_DEFINITION);
    this.minElement.className = RANGE_MIN_CLASS_DEFAULT;
    this.maxElement = document.createElement(SPAN_ELEMENT);
    this.maxElement.setAttribute(ID_ATTRIBUTE, this.getId() + MAX_DEFINITION);
    this.maxElement.className = RANGE_MAX_CLASS_DEFAULT;
    this.valueElement = document.createElement(OUTPUT_ELEMENT);
    this.valueElement.setAttribute(ID_ATTRIBUTE, this.getId() + VALUE_DEFINITION);
    this.valueElement.className = RANGE_VALUE_CLASS_DEFAULT;
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
    if (this.valueElement) this.valueElement.innerText = this.getValue() ? String(this.getValue()) : '';
    setTimeout(this.updateInputPadding, 10);
  }

  updateInputPadding() {
    if (this.inputElement && this.valueElement)
      this.inputElement.style.paddingRight = this.valueElement.clientWidth + 5 + 'px';
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
    this.triggerEvents(false);
    localStorage.removeItem(this.getSaveKey());
    this.setValue(this.options.default ?? null, false);
    this.updateRangeValues();
    this.update();
    this.triggerEvents(true);
    this.dispatchEvent(FieldEvents.Resetted);
  }

  bindChange() {
    if (this.inputElement) {
      this.inputElement.addEventListener(CHANGE_ATTRIBUTE, (event: any) => {
        this.change(event);
        this.updateRangeValues();
      });
    }
  }

  getValue(): number | null {
    return this._value as number | null;
  }
}
