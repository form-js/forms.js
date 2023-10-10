import { Form } from './form.js';
import { debounce, generateFieldSaveKey, mountElement, unmountElement } from './utils.js';
import { FieldOptions } from './interfaces.js';
import { FieldValue, HTMLElementEvent } from './types.js';

export class Field {
  public options: FieldOptions = {
    id: '',
    type: 'text',
    required: false,
    validation: (value, data, required) => {
      if (required && !value) return 'This field is required';
      return true;
    },
    default: null,
    debounce: 200,
    className: 'form-input',
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
  private _value: FieldValue = null;
  private _type: string;

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
   * @param {TabOptions} options - Options to merge with defaults.
   */
  initializeOptions(options: FieldOptions): void {
    this.options = Object.assign({}, this.options, options);
  }

  /**
   * Initializes the field, resetting it and binding change events.
   */
  async initialize(): Promise<void> {
    this.load();
    this.update();
    this.bindChange();
  }

  /**
   * Sets the value of the field and updates the associated input element if applicable.
   * @param value - The value to set.
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
      this.inputElement.value = String(this._value);
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
    this.containerElement.className = 'form-field ' + this._type;
    this.containerElement.setAttribute('id', this._id + '_container');
  }

  /** Creates a input element for the field. */
  createInputElement(): void {
    // Input element
    this.inputElement = document.createElement('input');
    this.inputElement.setAttribute('id', this._id);
    this.inputElement.setAttribute('name', this.options.name || this._id);
    this.inputElement.setAttribute('type', this._type);
    if (this.options.default) this.inputElement.setAttribute('value', String(this.options.default));
    this.inputElement.className = this.options.className!;
  }

  /** Creates a label element for the field. */
  createLabelElement(): void {
    // Label element
    this.labelElement = document.createElement('label');
    // Label text
    const label: HTMLElement = document.createElement('p');
    if (this.options.label) label.innerText = this.options.label;
    label.setAttribute('id', this._id + '_label');
    this.labelElement.setAttribute('for', this._id);
    label.className = 'form-field-label';
    if (this.options.label) mountElement(label, this.labelElement);
  }

  /** Creates a validation message element for the field. */
  createValidationElement(): void {
    // Validation element
    this.validationElement = document.createElement('p');
    this.validationElement.setAttribute('id', this._id + '_validation');
    this.validationElement.className = 'form-field-validation';
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
    if (this._parent) unmountElement(this._parent);
  }

  /** Handles the appearance of validation messages and error styling. */
  handleValidatedField(): void {
    if (!this._isValid) {
      this.labelElement?.classList.add('form-error');
      if (this.validationElement && this._vMessage) {
        this.validationElement.innerText = this._vMessage;
        this.validationElement.style.display = 'block';
      }
    } else {
      if (this.validationElement) {
        this.validationElement.style.display = 'none';
      }
      this.labelElement?.classList.remove('form-error');
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
    if (this._isDisabled) this.inputElement?.setAttribute('disabled', 'true');
    else this.inputElement?.removeAttribute('disabled');
  }

  /** Handles the required state of the field. */
  handleRequired(): void {
    if (this._isRequired) {
      this.containerElement?.classList.add('field-required');
    } else {
      this.containerElement?.classList.remove('field-required');
    }
  }

  /** Binds the change event for the input element. */
  bindChange(): void {
    if (this.inputElement)
      this.inputElement.addEventListener('input', debounce(this.change, this.options.debounce!, this));
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
        this.setValue(JSON.parse(value), false);
        return;
      }
    }
    this.setValue(this.options.default ?? null, false);
  }

  /** Resets the field to its initial state. */
  async reset(): Promise<void> {
    localStorage.removeItem(this._saveKey);
    if (this.options.default) this.setValue(this.options.default, false);
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
    if (this.options.conditions) this._isVisible = this.options.conditions(this._value, this._form.getData());
  }

  /** Updates the field's properties and visibility. */
  private updateDisabledStatus(): void {
    if (this.options.disabled) {
      this._isDisabled =
        typeof this.options.disabled === 'function'
          ? this.options.disabled(this._value, this._form.getData())
          : this.options.disabled;
    }
  }

  /** Updates the required status based on field options. */
  private updateRequiredStatus(): void {
    if (this.options.required) {
      this._isRequired =
        typeof this.options.required === 'function'
          ? this.options.required(this._value, this._form.getData())
          : this.options.required;
    }
  }

  /** Validates the field based on the configured validation function. */
  validate(): boolean {
    if (!this._isVisible) return true;
    if (this.options.validation) {
      const validation: true | string = this.options.validation(this._value, this._form.getData(), this._isRequired);
      this._isValid = validation === true;
      this._vMessage = validation === true ? '' : validation;
      this.handleValidatedField();
    } else this._isValid = true;
    return this._isValid;
  }

  /**
   * Event handler for the input element's change event.
   * @param event - The change event.
   */
  change(event: HTMLElementEvent<HTMLInputElement>): void {
    this.setValue(event.target.value);
    this.validate();
    if (this.options.change) this.options.change(this._value);
  }
}
