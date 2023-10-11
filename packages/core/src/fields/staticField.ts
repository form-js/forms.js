import { Form } from '../form.js';
import { generateFieldSaveKey, mountElement, unmountElement } from '../utils.js';
import { StaticFieldOptions } from '../interfaces.js';
import { FieldValue } from '../types.js';

export class StaticField {
  public options: StaticFieldOptions = {
    id: '',
    type: 'static',
    template: '',
    className: 'form-static',
  };
  public staticElement: HTMLElement | null = null;
  public containerElement: HTMLElement | null = null;

  private _id: string;
  private _parent: HTMLElement;
  private _form: Form;
  private _isMounted: boolean = false;
  private _isVisible: boolean = true;
  private _saveKey: string;
  private _value: string | null = null;
  private _type: string;

  /**
   * Creates an instance of the Field class.
   * @param parent - The parent element to which this field will be attached.
   * @param form - The form to which this field belongs.
   * @param options - Configuration options for the field.
   */
  constructor(parent: HTMLElement, form: Form, options: StaticFieldOptions) {
    this.initializeOptions(options);
    this._id = this.options.id;
    this._form = form;
    this._parent = parent;
    this._type = options.type;
    this._saveKey = generateFieldSaveKey(this._form.getId(), this._id);
    this.onGui();
    this.initialize();
  }

  /**
   * Merge default options with provided options.
   *
   * @param {TabOptions} options - Options to merge with defaults.
   */
  initializeOptions(options: StaticFieldOptions): void {
    this.options = Object.assign({}, this.options, options);
  }

  /**
   * Initializes the field, resetting it and binding change events.
   */
  async initialize(): Promise<void> {
    this.load();
    this.update();
  }

  /**
   * Gets the current value of the field.
   * @returns The value of the field.
   */
  getValue(): any {
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
   * Gets the form to which this field belongs.
   * @returns The form instance.
   */
  getForm(): Form {
    return this._form;
  }

  /**
   * Sets new htm template
   * @param template is a html valid string.
   */
  setTemplate(template: string, save: boolean = true): void {
    if (this.staticElement) this.staticElement.innerHTML = template;
    if (save) this.save();
  }

  /** Creates a container element for the field. */
  createContainerElement(): void {
    // Container element
    this.containerElement = document.createElement('div');
    this.containerElement.className = 'form-field ' + this._type;
    this.containerElement.setAttribute('id', this._id + '_container');
  }

  /** Creates a validation message element for the field. */
  createStaticElement(): void {
    // Validation element
    this.staticElement = document.createElement('div');
    this.staticElement.className = this.options.className!;
    this.staticElement.setAttribute('id', this._id);
  }

  /** Handles GUI element creation and mounting. */
  onGui() {
    this.createContainerElement();
    this.createStaticElement();
    // Append elements
    if (this.containerElement && this.staticElement) mountElement(this.staticElement, this.containerElement);
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

  /** Handles the visibility of the field. */
  handleVisibility(): void {
    if (this._isVisible && !this._isMounted) this.mount();
    if (!this._isVisible && this._isMounted) this.unmount();
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
        this.setTemplate(JSON.parse(value), false);
        return;
      }
    }
    this.setTemplate(this.options.template, false);
  }

  /** Blank reset */
  async reset(): Promise<void> {
    localStorage.removeItem(this._saveKey);
    this.setTemplate(this.options.template, false);
    this.update();
  }

  /** Blank update. */
  async update(): Promise<void> {
    this.updateVisibilityBasedOnConditions();
    this.handleVisibility();
  }

  /** Updates visibility based on options. */
  private updateVisibilityBasedOnConditions(): void {
    if (this.options.conditions) this._isVisible = this.options.conditions(this._value, this._form.getData());
  }
}
