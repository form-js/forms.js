import { Form } from '../form';
import {
  evaluateParsedConditions,
  generateFieldSaveKey,
  getOverwritenDefaults,
  isJson,
  mountElement,
  parseConditionString,
  unmountElement,
} from '../utils';
import { StaticFieldOptions } from '../interfaces';
import { FieldValue, ParsedCondition } from '../types';
import {
  CONTAINER_DEFINITION,
  DIV_ELEMENT,
  FIELD_CLASS_DEFAULT,
  FIELD_TYPE_STATIC,
  ID_ATTRIBUTE,
  STATIC_CLASS_DEFAULT,
} from '../constants';

export class StaticField {
  public options: StaticFieldOptions = {
    id: '',
    type: FIELD_TYPE_STATIC,
    template: '',
    className: STATIC_CLASS_DEFAULT,
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
  private _parsedConditions: ParsedCondition[] | null = null;

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
    this.options = Object.assign({}, this.options, getOverwritenDefaults(this.options.type, options));
  }

  /**
   * Initializes the field, resetting it and binding change events.
   */
  async initialize(): Promise<void> {
    this.parseStringConditions();
    this.load();
    this.update();
  }

  /** Parse conditions from string if needed */
  private parseStringConditions(): void {
    if (typeof this.options.conditions === 'string') {
      this._parsedConditions = parseConditionString(this.options.conditions);
    }
  }

  /**
   * Gets the current value of the field.
   * @returns The value of the field.
   */
  getValue(): string | null {
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
    this._value = template;
    if (this.staticElement) this.staticElement.innerHTML = template;
    if (save) this.save();
  }

  /** Creates a container element for the field. */
  createContainerElement(): void {
    // Container element
    this.containerElement = document.createElement(DIV_ELEMENT);
    this.containerElement.className = FIELD_CLASS_DEFAULT + ' ' + this._type;
    this.containerElement.setAttribute(ID_ATTRIBUTE, this._id + CONTAINER_DEFINITION);
  }

  /** Creates a validation message element for the field. */
  createStaticElement(): void {
    // Validation element
    this.staticElement = document.createElement(DIV_ELEMENT);
    this.staticElement.className = this.options.className!;
    this.staticElement.setAttribute(ID_ATTRIBUTE, this._id);
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
    if (this._parent) this._parent.remove();
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
        this.setTemplate(isJson(value) ? JSON.parse(value) : value, false);
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
    if (this.options.conditions) {
      if (this._parsedConditions) {
        this._isVisible = evaluateParsedConditions(this._parsedConditions, this._form.getData()) as boolean;
      } else if (typeof this.options.conditions === 'function') {
        this._isVisible = this.options.conditions(this.getValue(), this._form.getData());
      }
    }
  }
}
