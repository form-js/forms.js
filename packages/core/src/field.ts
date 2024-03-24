import { Form } from './form';
import {
  debounce,
  evaluateParsedConditions,
  generateFieldSaveKey,
  isJson,
  mountElement,
  parseConditionString,
  unmountElement,
} from './utils';
import { FieldOptions } from './interfaces';
import { FieldValue, HTMLElementEvent, ParsedCondition } from './types';
import {
  ARIA_DESCRIBEDBY_ATTRIBUTE,
  ARIA_INVALID_ATTRIBUTE,
  CONTAINER_DEFINITION,
  DEFAULT_REQUIRED_MESSAGE,
  DISABLED_ATTRIBUTE,
  FIELD_CLASS_DEFAULT,
  FIELD_DISABLED_CLASS_DEFAULT,
  FIELD_REQUIRED_CLASS_DEFAULT,
  FORM_ERROR_CLASS_DEFAULT,
  FOR_ATTRIBUTE,
  ID_ATTRIBUTE,
  INPUT_ATTRIBUTE,
  INPUT_CLASS_DEFAULT,
  INPUT_ELEMENT,
  LABEL_CLASS_DEFAULT,
  LABEL_DEFINITION,
  LABEL_ELEMENT,
  NAME_ATTRIBUTE,
  PARAGRAPH_ELEMENT,
  PLACEHOLDER_ATTRIBUTE,
  TYPE_ATTRIBUTE,
  VALIDATION_CLASS_DEFAULT,
  VALIDATION_DEFINITION,
} from './constants';

export class Field {
  public options: FieldOptions = {
    id: '',
    type: 'text',
    required: false,
    validation: (value, data, required) => {
      if (required && !value) return DEFAULT_REQUIRED_MESSAGE;
      return true;
    },
    default: '',
    debounce: 200,
    className: INPUT_CLASS_DEFAULT,
  };
  public inputElement: HTMLElement | null = null;
  public containerElement: HTMLElement | null = null;
  public labelElement: HTMLElement | null = null;
  public validationElement: HTMLElement | null = null;
  public hasScheme: boolean = false;

  private _id: string;
  private _parent: HTMLElement;
  private _form: Form;
  private _isValid: boolean | null = null;
  private _isDisabled: boolean = false;
  private _isRequired: boolean = false;
  private _isMounted: boolean = false;
  private _isVisible: boolean = true;
  private _saveKey: string;
  private _vMessage: string | null = null;
  protected _value: FieldValue = null;
  private _type: string;
  private _parsedConditions: ParsedCondition[] | null = null;
  private _parsedValidationConditions: ParsedCondition[] | null = null;
  private _parsedRequiredConditions: ParsedCondition[] | null = null;
  private _parsedDisabledConditions: ParsedCondition[] | null = null;

  /**
   * Creates an instance of the Field class.
   * @param parent - The parent element to which this field will be attached.
   * @param form - The form to which this field belongs.
   * @param options - Configuration options for the field.
   */
  constructor(parent: HTMLElement, form: Form, options: FieldOptions) {
    this.initializeOptions(options);
    this._id = this.options.id;
    this._form = form;
    this._parent = parent;
    this._type = options.type;
    this._saveKey = generateFieldSaveKey(this._form.getId(), this._id);
  }

  /**
   * Merge default options with provided options.
   *
   * @param {FieldOptions} options - Options to merge with defaults.
   */
  initializeOptions(options: FieldOptions): void {
    this.options = Object.assign({}, this.options, options);
  }

  /**
   * Initializes the field, resetting it and binding change events.
   */
  async initialize(): Promise<void> {
    this.parseStringConditions();
    this.load();
    this.update();
    this.bindChange();
  }

  /** Parse conditions from string if needed */
  private parseStringConditions(): void {
    if (typeof this.options.conditions === 'string') {
      this._parsedConditions = parseConditionString(this.options.conditions);
    }
    if (typeof this.options.disabled === 'string') {
      this._parsedDisabledConditions = parseConditionString(this.options.disabled);
    }
    if (typeof this.options.required === 'string') {
      this._parsedRequiredConditions = parseConditionString(this.options.required);
    }
    if (typeof this.options.validation === 'string') {
      this._parsedValidationConditions = parseConditionString(this.options.validation);
    }
  }

  /**
   * Sets the value of the field and updates the associated input element if applicable.
   * @param {FieldValue} value - The value to set.
   */
  setValue(value: FieldValue, save: boolean = true): void {
    this._value = value;
    this.syncValue();
    this._form.setData(this._id, value);
    if (save) this.save();
  }

  /**
   * Synchronizes fields value with input element
   */
  syncValue(): void {
    if (
      this.inputElement &&
      (this.inputElement instanceof HTMLInputElement || this.inputElement instanceof HTMLTextAreaElement) &&
      this.inputElement.value !== this._value
    ) {
      this.inputElement.value = this._value;
    }
  }

  /**
   * Gets the current value of the field.
   * @returns The value of the field.
   */
  getValue(): FieldValue {
    return this._value;
  }

  /**
   * Gets the ID of the field.
   * @returns The ID of the field.
   */
  getId(): string {
    return this._id;
  }

  /**
   * Gets the key uder that fields value is saved in local storage.
   * @returns string key.
   */
  getSaveKey(): string {
    return this._saveKey;
  }

  /**
   * Gets the type of the field.
   * @returns The type of the field.
   */
  getType(): string {
    return this._type;
  }

  /**
   * Gets the visibility status of the field.
   * @returns True if the field is visible; otherwise, false.
   */
  getVisibility(): boolean {
    return this._isVisible;
  }

  /**
   * Gets the validity status of the field.
   * @returns True if the field is valid; otherwise, false.
   */
  getValidity(): boolean | null {
    return this._isValid;
  }

  /**
   * Checks if the field is disabled.
   * @returns True if the field is disabled; otherwise, false.
   */
  isDisabled(): boolean {
    return this._isDisabled;
  }

  /**
   * Checks if the field is disabled.
   * @returns True if the field is disabled; otherwise, false.
   */
  isRequired(): boolean {
    return this._isRequired;
  }

  /**
   * Gets the validation message for the field.
   * @returns The validation message or null if there is none.
   */
  getValidationMessage(): string | null {
    return this._vMessage;
  }

  /**
   * Gets the form to which this field belongs.
   * @returns The form instance.
   */
  getForm(): Form {
    return this._form;
  }

  /** Creates a container element for the field. */
  createContainerElement(): void {
    // Container element
    this.containerElement = document.createElement('div');
    this.containerElement.className = FIELD_CLASS_DEFAULT + ' ' + this._type;
    this.containerElement.setAttribute(ID_ATTRIBUTE, this._id + CONTAINER_DEFINITION);
  }

  /** Creates a input element for the field. */
  createInputElement(): void {
    // Input element
    this.inputElement = document.createElement(INPUT_ELEMENT);
    this.inputElement.setAttribute(ID_ATTRIBUTE, this._id);
    this.inputElement.setAttribute(NAME_ATTRIBUTE, this.options.name || this._id);
    this.inputElement.setAttribute(TYPE_ATTRIBUTE, this._type);
    if (this.options.placeholder) this.inputElement.setAttribute(PLACEHOLDER_ATTRIBUTE, this.options.placeholder);
    this.inputElement.className = this.options.className!;
  }

  /** Creates a label element for the field. */
  createLabelElement(): void {
    // Label element
    this.labelElement = document.createElement(LABEL_ELEMENT);
    // Label text
    const label: HTMLElement = document.createElement(PARAGRAPH_ELEMENT);
    if (this.options.label) label.innerText = this.options.label;
    label.setAttribute(ID_ATTRIBUTE, this._id + LABEL_DEFINITION);
    this.labelElement.setAttribute(FOR_ATTRIBUTE, this._id);
    label.className = LABEL_CLASS_DEFAULT;
    if (this.options.label) mountElement(label, this.labelElement);
  }

  /** Creates a validation message element for the field. */
  createValidationElement(): void {
    // Validation element
    this.validationElement = document.createElement(PARAGRAPH_ELEMENT);
    this.validationElement.setAttribute(ID_ATTRIBUTE, this._id + VALIDATION_DEFINITION);
    this.validationElement.className = VALIDATION_CLASS_DEFAULT;
    this.validationElement.style.display = 'none';
  }

  /** Handles GUI element creation and mounting. */
  onGui() {
    this.createContainerElement();
    this.createInputElement();
    this.createLabelElement();
    this.createValidationElement();
    // Append elements
    if (this.inputElement && this.labelElement) mountElement(this.inputElement, this.labelElement);
    if (this.labelElement && this.validationElement) mountElement(this.validationElement, this.labelElement);
    if (this.containerElement && this.labelElement) mountElement(this.labelElement, this.containerElement);
  }

  /**  Mounts the field's container element to the parent. */
  private mount(): void {
    if (this.containerElement) mountElement(this.containerElement, this._parent);
    this._isMounted = true;
  }

  /** Unmounts the field's container element from the parent. */
  private unmount(): void {
    if (this.containerElement) unmountElement(this.containerElement);
    this._isMounted = false;
  }

  /** Fully removes the element from the DOM. */
  destroy(): void {
    if (this._parent) this._parent.remove();
  }

  /** Handles the appearance of validation messages and error styling. */
  handleValidatedField(): void {
    if (!this._isValid) {
      this.labelElement?.classList.add(FORM_ERROR_CLASS_DEFAULT);
      if (this.validationElement && this._vMessage) {
        this.validationElement.innerText = this._vMessage;
        this.validationElement.style.display = 'block';
      }
      this.inputElement?.setAttribute(ARIA_INVALID_ATTRIBUTE, 'true');
      this.inputElement?.setAttribute(ARIA_DESCRIBEDBY_ATTRIBUTE, this.validationElement?.getAttribute('id') || '');
    } else {
      if (this.validationElement) {
        this.validationElement.style.display = 'none';
      }
      this.labelElement?.classList.remove(FORM_ERROR_CLASS_DEFAULT);
      this.inputElement?.removeAttribute(ARIA_INVALID_ATTRIBUTE);
      this.inputElement?.removeAttribute(ARIA_DESCRIBEDBY_ATTRIBUTE);
    }
    this._form.updateError(this._id, this._isValid);
  }

  /** Handles the visibility of the field. */
  handleVisibility(): void {
    if (this._isVisible && !this._isMounted) this.mount();
    if (!this._isVisible && this._isMounted) this.unmount();
  }

  /** Handles the visibility of the field. */
  handleDisabled(): void {
    if (this._isDisabled) {
      this.containerElement?.classList.add(FIELD_DISABLED_CLASS_DEFAULT);
      this.inputElement?.setAttribute(DISABLED_ATTRIBUTE, 'true');
    } else {
      this.inputElement?.removeAttribute(DISABLED_ATTRIBUTE);
      this.containerElement?.classList.remove(FIELD_DISABLED_CLASS_DEFAULT);
    }
  }

  /** Handles the required state of the field. */
  handleRequired(): void {
    if (this._isRequired) {
      this.containerElement?.classList.add(FIELD_REQUIRED_CLASS_DEFAULT);
    } else {
      this.containerElement?.classList.remove(FIELD_REQUIRED_CLASS_DEFAULT);
    }
  }

  /** Binds the change event for the input element. */
  bindChange(): void {
    if (this.inputElement)
      this.inputElement.addEventListener(INPUT_ATTRIBUTE, debounce(this.change, this.options.debounce!, this));
  }

  /** Save the fields value into local stroage. */
  save(): void {
    if (this._form.savesProgress() && this._form.hasValidLicense() && this._value !== undefined) {
      localStorage.setItem(this._saveKey, JSON.stringify(this._value));
    }
  }

  /** Load the fields value from local stroage. */
  load(): void {
    if (this._form.savesProgress() && this._form.hasValidLicense()) {
      const value: string | null = localStorage.getItem(this._saveKey);

      if (value !== null) {
        this.setValue(isJson(value) ? JSON.parse(value) : value, false);
        return;
      }
    }
    this.setValue(this.options.default ?? null, false);
  }

  /** Resets the field to its initial state. */
  async reset(): Promise<void> {
    localStorage.removeItem(this._saveKey);
    if (this.options.default !== undefined) this.setValue(this.options.default, false);
    else this.setValue(null, false);
    this.update();
  }

  /** Updates the field's properties and visibility. */
  async update(): Promise<void> {
    this.updateVisibilityBasedOnConditions();
    this.updateDisabledStatus();
    this.updateRequiredStatus();
    this.handleVisibility();
    this.handleDisabled();
    this.handleRequired();
  }

  /** Updates visibility based on options. */
  private updateVisibilityBasedOnConditions(): void {
    if (this.options.conditions) {
      if (this._parsedConditions) {
        this._isVisible = evaluateParsedConditions(
          this._parsedConditions,
          this._form.getData(),
          this._value,
          this._isRequired,
        ) as boolean;
      } else if (typeof this.options.conditions === 'function') {
        this._isVisible = this.options.conditions(this._value, this._form.getData());
      }
    }
  }

  /** Updates the field's properties and visibility. */
  private updateDisabledStatus(): void {
    if (this.options.disabled) {
      if (typeof this.options.disabled === 'string' && this._parsedDisabledConditions) {
        this._isDisabled = evaluateParsedConditions(
          this._parsedDisabledConditions,
          this._form.getData(),
          this._value,
          this._isRequired,
        ) as boolean;
      } else {
        if (typeof this.options.disabled === 'function') {
          this._isDisabled = this.options.disabled(this._value, this._form.getData());
        } else if (typeof this.options.disabled === 'boolean') {
          this._isDisabled = this.options.disabled;
        }
      }
    }
  }

  /** Updates the required status based on field options. */
  private updateRequiredStatus(): void {
    if (this.options.required) {
      if (typeof this.options.required === 'string' && this._parsedRequiredConditions) {
        this._isRequired = evaluateParsedConditions(
          this._parsedRequiredConditions,
          this._form.getData(),
          this._value,
        ) as boolean;
      } else {
        if (typeof this.options.required === 'function') {
          this._isRequired = this.options.required(this._value, this._form.getData());
        } else if (typeof this.options.required === 'boolean') {
          this._isRequired = this.options.required;
        }
      }
    }
  }

  /** Validates the field based on the configured validation function. */
  validate(): boolean | null {
    if (!this._isVisible) return true;
    if (this.options.validation) {
      if (typeof this.options.validation === 'string' && this._parsedValidationConditions) {
        const validity = evaluateParsedConditions(
          this._parsedValidationConditions,
          this._form.getData(),
          this._value,
          this._isRequired,
          true,
        ) as true | string;
        this.setValidationValues(validity);
      } else if (typeof this.options.validation === 'function') {
        const validity = this.options.validation(this._value, this._form.getData(), this._isRequired);
        this.setValidationValues(validity);
      } else this._isValid = true;
    } else this._isValid = true;
    return this._isValid;
  }

  private setValidationValues(validity: string | true) {
    this._isValid = validity === true;
    this._vMessage = validity === true ? '' : validity;
  }

  /**
   * Event handler for the input element's change event.
   * @param event - The change event.
   */
  change(event: HTMLElementEvent<HTMLInputElement>): void {
    this.setValue(event.target.value);
    this.validate();
    this.handleValidatedField();
    if (this.options.change) this.options.change(this._value);
  }
}
