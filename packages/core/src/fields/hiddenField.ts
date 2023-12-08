import { Form } from '../form.js';
import { generateFieldSaveKey, mountElement, unmountElement } from '../utils.js';
import { FieldOptions } from '../interfaces.js';
import { FieldValue } from '../types.js';

export class HiddenField {
  public options: FieldOptions = {
    id: '',
    type: 'hidden',
    default: null,
  };

  public inputElement: HTMLElement | null = null;
  public containerElement: HTMLElement | null = null;
  public labelElement: HTMLElement | null = null;
  public validationElement: HTMLElement | null = null;

  private _id: string;
  private _parent: HTMLElement;
  private _form: Form;
  private _saveKey: string;
  private _value: FieldValue = null;
  private _type: string;

  constructor(parent: HTMLElement, form: Form, options: FieldOptions) {
    // Define properties
    this.initializeOptions(options);
    this._id = this.options.id;
    this._form = form;
    this._parent = parent;
    this._type = options.type;
    this._saveKey = generateFieldSaveKey(this._form.getId(), this._id);
    this.onGui();
    this.initialize();
  }

  initializeOptions(options: FieldOptions) {
    this.options = Object.assign({}, this.options, options);
  }

  async initialize(): Promise<void> {
    this.load();
    this.update();
  }

  public setValue(value: FieldValue, save: boolean = true): void {
    this._value = value;
    this.syncValue();
    this._form.setData(this._id, value);
    if (save) this.save();
  }

  /**
   * Gets the current value of the field.
   * @returns The value of the field.
   */
  getValue(): FieldValue {
    return this._value;
  }

  /**
   * Synchronizes fields value with input element
   */
  syncValue(): void {
    if (this.inputElement && this.inputElement instanceof HTMLInputElement && this.inputElement.value !== this._value) {
      //@ts-ignore
      this.inputElement.value = this._value;
    }
  }

  mountToParent(): void {
    if (this.containerElement) mountElement(this.containerElement, this._parent);
  }

  createContainerElement() {
    // Container element
    this.containerElement = document.createElement('div');
    this.containerElement.className = 'form-field ' + this.getType();
    this.containerElement.setAttribute('id', this.getId() + '_container');
  }

  createInputElement() {
    // Input element
    this.inputElement = document.createElement('input');
    this.inputElement.setAttribute('id', this._id);
    this.inputElement.setAttribute('name', this.options.name || this.getId());
    this.inputElement.setAttribute('type', this.getType());
    this.inputElement.className = this.options.className!;
  }

  getId() {
    return this._id;
  }

  /**
   * Gets the key uder that fields value is saved in local storage.
   * @returns string key.
   */
  getSaveKey(): string {
    return this._saveKey;
  }

  getType() {
    return this._type;
  }

  /**
   * Gets the form to which this field belongs.
   * @returns The form instance.
  */
  getForm(): Form {
    return this._form;
  }

  onGui() {
    this.createContainerElement();
    this.createInputElement();
    if (this.containerElement && this.inputElement) mountElement(this.inputElement, this.containerElement);
    this.mountToParent();
  }

  /** Fully removes the element from the DOM. */
  destroy(): void {
    if (this._parent) unmountElement(this._parent);
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
      const value: any = localStorage.getItem(this._saveKey);
      if (value !== undefined) {
        this.setValue(JSON.parse(value), false);
        return;
      }
    }
    this.setValue(this.options.default ?? null, false);
  }

  async reset(): Promise<void> {
    localStorage.removeItem(this._saveKey);
    this.setValue(this.options.default ?? null, false);
    this.update();
  }

  async update(): Promise<void> {
    return;
  }
}
