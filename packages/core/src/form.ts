import {
  LICENSE_STATE,
  PACKAGE_LICENSE_URL,
  costructorTypes,
  elementConstructors,
  licensePlateClass,
  licensePlateStyle,
} from './constants.js';
import {
  getFormElementType,
  getLicenseText,
  handleInvalidLicenseLog,
  isListField,
  mountElement,
  objectToFormData,
  processLicenseKey,
  setLicenseKey,
  transformFieldName,
  usesLicensedFetures,
} from './utils.js';
import { FormOptions } from './interfaces.js';
import { FieldValue, FormElement, Schema, FormData } from './types.js';
import { Group } from './group.js';
import { Button } from './button.js';
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
  private _fields: Record<string, any> = {};
  private _groups: Record<string, any> = {};
  private _buttons: Record<string, any> = {};
  private _data: FormData = {};
  private _saveProgress: boolean = false;
  private _licenseState: number = LICENSE_STATE.INVALID;
  private _schema: Schema = [];
  private _dataPrefixMap: Record<
    string,
    {
      id: string;
      dataKey: string;
      key: string | null; // will be null when group
    }
  > = {};
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
    if (!usesLicensedFetures()) return;
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
    groupId: string | null = null,
    listId: string | null = null,
    key: string | null = null,
  ) {
    schema.forEach((options: any) => {
      this.buildElement(options, parent, groupId, listId, key);
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
   * Builds a element for the form based on provided options.
   * @param options - Configuration options for the field.
   * @param parent - Parent HTML element to append the field to.
   * @param groupId - if has group parent - optional.
   * @param listId - if has list parent - optional.
   * @param key - list key - optional.
   */
  private buildElement(
    options: any,
    parent: HTMLElement,
    groupId: string | null,
    listId: string | null,
    key: string | null,
  ): void {
    const duplicatedOptions = {
      ...options,
    };

    const Constructor = elementConstructors[options.type];
    if (!Constructor) throw new Error(`Unknown type: ${options.type}`);
    const wrapper = this.createWrapper(parent);
    const Constructed: FormElement = new Constructor(wrapper, this, duplicatedOptions);

    const formElementType: string | null = getFormElementType(options.type);
    switch (formElementType) {
      case costructorTypes.button:
        if (listId && key) {
          this.assignToListField(listId, key, Constructed, formElementType, options.id);
        } else this._buttons[options.id] = Constructed;
        break;
      case costructorTypes.group:
        if (listId && key) {
          this.assignToListField(listId, key, Constructed, formElementType, options.id);
        } else this._groups[options.id] = Constructed;
        // if group has schema
        if (options.schema && Constructed.getSchemaContainer) {
          const newParent: HTMLElement | null = Constructed.getSchemaContainer();
          if (newParent) {
            this.buildSchema(
              options.schema,
              newParent,
              options.prefixSchema ? Constructed.getId() : groupId,
              listId,
              key,
            );
          }
        }
        break;
      case costructorTypes.field:
        if (listId && key) {
          this.assignToListField(listId, key, Constructed, formElementType, options.id);
        } else this._fields[options.id] = Constructed;

        console.log(this._fields[options.id]);
        

        /*if (isListField(options.type)) {
          Constructed.initialize();
        }*/
        break;
    }
  }

  private assignToListField(
    listId: string,
    key: string,
    constructed: FormElement,
    formElementType: string,
    id: string,
  ) {
    const list = this._fields[listId];
    console.log(listId);
    console.log(key);
    console.log(list);
    
    if (!list) return;
    switch (formElementType) {
      case costructorTypes.button:
        list.assignButton(id, key, constructed);
        break;
      case costructorTypes.group:
        list.assignGroup(id, key, constructed);
        break;
      case costructorTypes.field:
        list.assignField(id, key, constructed);
        break;
    }
  }

  /**
   * Updates all elements of the form (groups, rows, fields, buttons).
   */
  async update(): Promise<void> {
    Object.keys(this._groups).forEach((key: string) => {
      this._groups[key].update();
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
  setData(id: string, value: FieldValue): void {
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

  private setSimpleData(id: string, value: FieldValue) {
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
  getData(): FormData {
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
  getGroup(id: string): any {
    return this._groups[id];
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
    Object.keys(this._fields).forEach((key: string) => {
      this._fields[key].reset();
    });
    Object.keys(this._buttons).forEach((key: string) => {
      this._buttons[key].reset();
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
    if (usesLicensedFetures() && !this.hasValidLicense()) this.createInvalidElement();
  }

  private createInvalidElement() {
    const invalid = document.createElement('a');
    invalid.setAttribute('href', PACKAGE_LICENSE_URL);
    invalid.className = licensePlateClass;
    invalid.style.cssText = licensePlateStyle;
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
