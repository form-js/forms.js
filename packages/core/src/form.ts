import { LICENSE_STATE, elementConstructors } from './constants.js';
import {
  getLicenseText,
  handleInvalidLicenseLog,
  isField,
  isListField,
  mountElement,
  objectToFormData,
  processLicenseKey,
  setLicenseKey,
  transformFieldName,
} from './utils.js';
import { FormOptions, GroupOptions, RowOptions, TabsOptions } from './interfaces.js';
import { Schema } from './types.js';
import { Group } from './group.js';
import { Row } from './row.js';
import { Button } from './button.js';
//import { Tab } from './tab.js';
//import { ListField } from './fields/listField.js';
export class Form {
  public options: FormOptions = {
    id: '',
    saveProgress: false,
    useFormData: false,
    schema: [],
    action: null,
    method: null,
    className: 'formjs-form',
  };

  private _parent: HTMLElement | null = null;
  private _formElement: HTMLFormElement | null = null;
  private _id: string = '';
  private _isValid: boolean | null = null;
  private _errors: string[] = [];
  private _fields: any = {};
  private _groups: any = {};
  private _rows: any = {};
  private _saveProgress: boolean = false;
  private _licenseState: number = LICENSE_STATE.INVALID;
  private _buttons: any = {};
  private _schema: Schema = [];
  private _data: any = {};
  private _dataPrefixMap: {
    [key: string]: {
      id: string;
      dataKey: string;
      key: string | null; // will be null when group
    };
  } = {};

  /**
   * Constructs a new Form instance.
   * @param parentId - The ID of the parent element.
   * @param options - Form configuration options.
   */
  constructor(parentId: string, options: FormOptions) {
    this.initializeOptions(options);
    this.setParentElement(parentId);
    this.processLicense();
    this.onGui();
    this.initForm();
  }

  /**
   * Sets the parent HTML element using the provided ID.
   * @param parentId - The ID of the parent element.
   */
  private setParentElement(parentId: string): void {
    this._parent = document.getElementById(parentId);
    if (!this._parent) throw new Error('Parent does not exist in the document');
  }

  /**
   * Initializes form options with provided configuration.
   * @param options - Form configuration options.
   */
  private initializeOptions(options: FormOptions): void {
    this.options = Object.assign({}, this.options, options);
    this._id = options.id;
    this._schema = options.schema;
    this._saveProgress = options.saveProgress!;
  }

  /**
   * Initiates the form, builds the schema and mounts the form to the parent.
   */
  private initForm(): void {
    if (this._formElement) this.buildSchema(this._schema, this._formElement);
    if (this._formElement && this._parent) mountElement(this._formElement, this._parent);
  }

  /* processes license */
  private processLicense(): void {
    if (this.options.licenseKey) setLicenseKey(this.options.licenseKey);
    this._licenseState = processLicenseKey();
    if (!this.hasValidLicense()) {
      handleInvalidLicenseLog(this._licenseState);
    }
  }

  /**
   * Processes and constructs form elements based on the provided schema.
   * @param schema - Form schema.
   * @param parent - Parent HTML element to append schema to.
   */
  public buildSchema(
    schema: Schema,
    parent: HTMLElement,
    //    group: Group | null = null,
    //    list: ListField | null = null,
    //    key: string | null = null,
  ) {
    schema.forEach((options: any) => {
      switch (options.type) {
        case 'group':
          this.buildGroup(options, parent);
          break;
        case 'row':
          this.buildRow(options, parent);
          break;
        default:
          this.buildField(options, parent);
      }
    });
  }

  /**
   * Checks if the form is valid.
   * @returns Boolean indicating form validity.
   */
  private isFormValid(): boolean | null {
    return this._isValid;
  }

  /**
   * Creates a wrapper element to handle the visibility of a field.
   * @param parent - The parent element.
   * @returns The created wrapper element.
   */
  private createWrapper(parent: HTMLElement): HTMLElement {
    const wrapper = document.createElement('div');
    mountElement(wrapper, parent);
    return wrapper;
  }

  private mapFieldToDataPrefix(options: any, id: string, key: string | null = null): void {
    let newId = options.id;
    if (key) {
      newId = transformFieldName(id, key, options.id);
    }

    this._dataPrefixMap[newId] = {
      id: id,
      dataKey: options.id,
      key: key,
    };

    if (key) {
      options.id = newId;
      options.name = newId;
    }
  }

  /**
   * Builds a field for the form based on provided options.
   * @param options - Configuration options for the field.
   * @param parent - Parent HTML element to append the field to.
   * @param group - if has group parent - optional.
   * @param list - if has list parent - optional.
   * @param key - list key - optional.
   */
  private buildField(
    options: any,
    parent: HTMLElement,
  ): void {
    const optionsDupe = {
      ...options,
    };

    const Constructor = elementConstructors[options.type];
    if (!Constructor) throw new Error(`Unknown type: ${options.type}`);
    const wrapper = this.createWrapper(parent);
    const Constructed = new Constructor(wrapper, this, optionsDupe);

    this._fields[options.id] = Constructed;

    //List field fallback to properly init the form data object;
    if (isListField(options.type)) {
      Constructed.initialize();
    }
  }

  /**
   * Builds a field for the form based on provided options.
   * @param options - Configuration options for the field.
   * @param parent - Parent HTML element to append the field to.
   */
  private buildGroup(
    options: GroupOptions,
    parent: HTMLElement,
  ): void {
    const Constructor = elementConstructors[options.type];
    if (!Constructor) throw new Error(`Unknown type: ${options.type}`);
    const wrapper = this.createWrapper(parent);
    const Constructed = new Constructor(wrapper, this, options);

    this._groups[options.id] = Constructed;

    const newParent: HTMLElement = Constructed.getContainer();
    this.buildSchema(options.schema, newParent);

  }

  /**
   * Constructs a row structure for the form based on provided options.
   * @param options - Configuration options for the row.
   * @param parent - Parent HTML element to append the row to.
   */
  private buildRow(
    options: RowOptions,
    parent: HTMLElement,
  ) {
    const Constructor = elementConstructors[options.type];
    if (!Constructor) throw new Error(`Unknown type: ${options.type}`);
    const wrapper = this.createWrapper(parent);
    const Constructed = new Constructor(wrapper, this, options);

    this._rows[options.id] = Constructed;

    const newParent: HTMLElement | null = Constructed.getRow();
    if (newParent) this.buildSchema(options.schema, newParent);
  }

  /**
   * Updates all elements of the form (groups, rows, fields, buttons).
   */
  async update(): Promise<void> {
    Object.keys(this._groups).forEach((key: string) => {
      this._groups[key].update();
    });
    Object.keys(this._rows).forEach((key: string) => {
      this._rows[key].update();
    });
    Object.keys(this._fields).forEach((key: string) => {
      this._fields[key].update();
    });
    Object.keys(this._buttons).forEach((key: string) => {
      this._buttons[key].update();
    });
  }

  /**
   * Fetches a specified field from the form by ID.
   * @param id - The ID of the desired field.
   * @returns The field with the specified ID or undefined.
   */
  getField(id: string) {
    return this._fields[id];
  }

  /**
   * Gets the main form element.
   * @returns The form element.
   */
  getFormElement() {
    return this._formElement;
  }

  /**
   * Updates the form data with the provided value.
   * @param id - The ID of the data point.
   * @param value - The value to set.
   * @param prefixes - Optional prefixes for the data.
   */
  setData(id: string, value: any): void {
    // Check if the ID exists in the map
    if (this._dataPrefixMap.hasOwnProperty(id)) {
      this.setDataFromMap(id, value);
    } else {
      this.setSimpleData(id, value);
    }
    this.update();
  }

  private setDataFromMap(id: string, value: any) {
    const fieldMapping = this._dataPrefixMap[id];
    const { dataKey, key, id: prefixDataId } = fieldMapping;

    // Ensure all necessary properties exist
    if (!dataKey || !prefixDataId) return;

    if (key) {
      const list = this.getField(prefixDataId);
      if (!list) return;
      const prefixId = list.getId();
      const keyIndex = list.getKeyIndex(key);
      this.ensureDataStructureExists(prefixId, keyIndex);
      this._data[prefixId][keyIndex][dataKey] = value;
    } else {
      const group = this.getGroup(prefixDataId);
      if (!group) return;
      const prefixId = group.getId();
      this.ensureDataStructureExists(prefixId);
      this._data[prefixId][dataKey] = value;
    }
  }

  private setSimpleData(id: string, value: any) {
    this._data[id] = value;
  }

  private ensureDataStructureExists(listId: string, keyIndex: number | null = null) {
    if (keyIndex === null && !this._data[listId]) {
      this._data[listId] = {};
      return;
    } else if (keyIndex || keyIndex === 0) {
      if (!this._data[listId]) this._data[listId] = [];
      if (!this._data[listId][keyIndex]) this._data[listId][keyIndex] = {};
    }
  }

  removeListData(listId: string, index: number) {
    if (this._data[listId] && this._data[listId][index]) {
      this._data[listId].splice(index, 1);
    }
  }

  /**
   * Gets the ID of the form.
   * @returns The ID of the form.
   */
  getId(): string {
    return this._id;
  }

  /**
   * Retrieves all data from the form.
   * @returns The form's data.
   */
  getData(): any {
    return this._data;
  }

  /**
   * Retrieves all data from the form.
   * @returns The form's data.
   */
  getButtons(): any {
    return this._buttons;
  }

  /**
   * Fetches a specified button from the form by ID.
   * @param id - The ID of the desired button.
   * @returns The button with the specified ID or undefined.
   */
  getButton(id: string): Button | undefined {
    return this._buttons[id];
  }

  /**
   * Fetches all groups present in the form.
   * @returns The groups.
   */
  getGroups(): any {
    return this._groups;
  }

  /**
   * Fetches a specified group from the form by ID.
   * @param id - The ID of the desired group.
   * @returns The group with the specified ID or undefined.
   */
  getGroup(id: string): Group | undefined {
    return this._groups[id];
  }

  /**
   * Fetches a specified group from the form by ID.
   * @param id - The ID of the desired group.
   * @returns The group with the specified ID or undefined.
   */
  getRows(): any {
    return this._rows;
  }

  /**
   * Fetches a specified row from the form by ID.
   * @param id - The ID of the desired row.
   * @returns The row with the specified ID or undefined.
   */
  getRow(id: string): Row | undefined {
    return this._rows[id];
  }

  /**
   * Fetches save progress option.
   * @returns Boolean.
   */
  savesProgress(): boolean {
    return this._saveProgress;
  }

  /**
   * Looks if form has valid license
   * @returns Boolean.
   */
  hasValidLicense(): boolean {
    return this._licenseState === LICENSE_STATE.VALID;
  }

  /**
   * Updates the form's error state.
   * @param id - The ID of the field with the error.
   * @param isValid - Boolean indicating the validity of the field.
   */
  updateError(id: string, isValid: boolean | null) {
    if (this._errors.includes(id) && isValid) {
      this._errors = this._errors.filter((field: string) => {
        return field !== id;
      });
    } else if (!this._errors.includes(id) && !isValid) {
      this._errors.push(id);
    }
    this._isValid = this._errors.length === 0;
  }

  /**
   * Resets all elements of the form.
   * @param event - Optional event that triggered the reset.
   */
  reset(event?: Event): void {
    if (event) event.preventDefault();
    Object.keys(this._groups).forEach((key: string) => {
      this._groups[key].reset();
    });
    Object.keys(this._rows).forEach((key: string) => {
      this._rows[key].reset();
    });
    Object.keys(this._fields).forEach((key: string) => {
      this._fields[key].reset();
    });
  }

  /**
   * Validates all fields of the form.
   */
  validate(): void {
    Object.keys(this._fields).forEach((key: string) => {
      if (this._fields[key].validate) this._fields[key].validate();
    });
  }

  /**
   * Validates all fields of the form.
   */
  save(): void {
    if (!this._saveProgress || !this.hasValidLicense()) return;
    Object.keys(this._fields).forEach((key: string) => {
      this._fields[key].save();
    });
    Object.keys(this._groups).forEach((key: string) => {
      if (typeof this._groups[key].save === 'function') this._groups[key].save();
    });
  }

  /**
   * Validates all fields of the form.
   */
  load(): void {
    if (!this._saveProgress || !this.hasValidLicense()) return;
    Object.keys(this._fields).forEach((key: string) => {
      this._fields[key].load();
    });
    Object.keys(this._groups).forEach((key: string) => {
      if (typeof this._groups[key].save === 'function') this._groups[key].load();
    });
  }

  /**
   * Initializes the form's GUI elements.
   */
  onGui(): void {
    this._formElement = document.createElement('form');
    this._formElement.setAttribute('id', this._id);
    this._formElement.className = this.options.className!;
    if (this.options.action) this._formElement.setAttribute('action', this.options.action);
    if (this.options.method) this._formElement.setAttribute('method', this.options.method);
    this._formElement.addEventListener('submit', (event: Event) => this.submit(event, this));
    this._formElement.addEventListener('reset', this.reset);
    if (!this.hasValidLicense()) this.createInvalidElement();
  }

  private createInvalidElement() {
    const invalid = document.createElement('a');
    invalid.setAttribute('href', '#');
    invalid.className = 'license-plate';
    invalid.style.cssText =
      'position: fixed !important; font-weight: bold; font-size: .8rem;  bottom: 1rem !important;  left: 1rem !important;  background: #fff;  border: 2px solid red;  padding: .5rem;  border-radius: 0.15rem;  z-index: 99999 !important;  display: inline-flex !important;  align-items: center;  color: red;  text-decoration: none;  transition: 0.2s linear;';
    const text = document.createElement('span');
    text.innerText = getLicenseText(this._licenseState);
    mountElement(text, invalid);
    if (this._parent) mountElement(invalid, this._parent);
  }

  /**
   * Handles the form's submit action, validates fields, and sends data if applicable.
   * @param event - The event that triggered the submission.
   * @param form - The current form instance.
   */
  submit(event: Event, form: Form): void {
    event.preventDefault();
    form.validate();
    if (!form.isFormValid()) {
      return;
    }
    if (this.options.action) {
      const element = this.getFormElement();
      if (element) element.submit();
    }
    let data = form.getData();
    if (this.options.useFormData) {
      data = objectToFormData(form.getData());
    }
    if (form.options.submit) form.options.submit(data);
  }
}
