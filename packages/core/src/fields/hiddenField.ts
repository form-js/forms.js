import { Form } from '../form';
import { generateFieldSaveKey, isJson, mountElement, unmountElement } from '../utils';
import { FieldOptions } from '../interfaces';
import { FieldValue } from '../types';
import {
  CONTAINER_DEFINITION,
  DIV_ELEMENT,
  FIELD_CLASS_DEFAULT,
  ID_ATTRIBUTE,
  INPUT_ELEMENT,
  NAME_ATTRIBUTE,
  TYPE_ATTRIBUTE,
} from '../constants';

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
      this.inputElement.value = this._value;
    }
  }

  mountToParent(): void {
    if (this.containerElement) mountElement(this.containerElement, this._parent);
  }

  createContainerElement() {
    // Container element
    this.containerElement = document.createElement(DIV_ELEMENT);
    this.containerElement.className = FIELD_CLASS_DEFAULT + ' ' + this.getType();
    this.containerElement.setAttribute(ID_ATTRIBUTE, this.getId() + CONTAINER_DEFINITION);
  }

  createInputElement() {
    // Input element
    this.inputElement = document.createElement(INPUT_ELEMENT);
    this.inputElement.setAttribute(ID_ATTRIBUTE, this.getId());
    this.inputElement.setAttribute(NAME_ATTRIBUTE, this.options.name || this.getId());
    this.inputElement.setAttribute(TYPE_ATTRIBUTE, this.getType());
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
    if (this._parent) this._parent.remove();
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

  async reset(): Promise<void> {
    localStorage.removeItem(this._saveKey);
    this.setValue(this.options.default ?? null, false);
    this.update();
  }

  async update(): Promise<void> {
    return;
  }
}
