import {
  ACTION_ATTRIBUTE,
  DIV_ELEMENT,
  FORM_CLASS_DEFAULT,
  FORM_ELEMENT,
  FormEvents,
  HREF_ATTRIBUTE,
  ID_ATTRIBUTE,
  LICENSE_STATE,
  LINK_ELEMENT,
  METHOD_ATTRIBUTE,
  PACKAGE_LICENSE_URL,
  RESET_ATTRIBUTE,
  SPAN_ELEMENT,
  SUBMIT_ATTRIBUTE,
  constructorTypes,
  elementConstructors,
  licensePlateClass,
  licensePlateStyle,
} from './constants';
import {
  getFormElementType,
  getLicenseText,
  handleInvalidLicenseLog,
  mountElement,
  objectToFormData,
  processLicenseKey,
  setLicenseKey,
  transformFieldName,
  usesLicensedFetures,
  useLicensedFetures,
} from './utils';
import { FormOptions } from './interfaces';
import { FieldValue, FormElement, Schema, FormData, DataPrefixMap } from './types';
export class Form {
  public options: FormOptions = {
    id: '',
    saveProgress: false,
    useFormData: false,
    schema: [],
    action: null,
    method: null,
    className: FORM_CLASS_DEFAULT,
  };

  private _parent: HTMLElement | null = null;
  private _formElement: HTMLFormElement | null = null;
  private _id: string = '';
  private _isValid: boolean | null = null;
  private _errors: string[] = [];
  private _fields: Record<string, FormElement> = {};
  private _groups: Record<string, FormElement> = {};
  private _buttons: Record<string, FormElement> = {};
  private _data: FormData = {};
  private _saveProgress: boolean = false;
  private _licenseState: number = LICENSE_STATE.INVALID;
  private _schema: Schema = [];
  private _dataPrefixMap: DataPrefixMap = {};
  private _triggerEvents = true;
  /**
   * Constructs a new Form instance.
   * @param parent - The parent HTML element or string id.
   * @param options - Form configuration options.
   */
  constructor(parent: HTMLElement | string, options: FormOptions) {
    this.initializeOptions(options);
    this.setParentElement(parent);
    this.processLicense();
    this.onGui();
    this.initForm();
  }

  /**
   * Sets the parent HTML element using the provided ID.
   * @param parent - The present HTML element or string id.
   */
  private setParentElement(parent: HTMLElement | string): void {
    let parentElement: HTMLElement | null;
    if (typeof parent === 'string') {
      parentElement = document.getElementById(parent);
    } else {
      parentElement = parent;
    }
    this._parent = parentElement;
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
    if (this._saveProgress) {
      useLicensedFetures();
    }
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
    schema.forEach((options: Record<string, any>) => {
      this.buildElement(options, parent, groupId, listId, key);
    });
  }

  /**
   * Checks if the form is valid.
   * @returns Boolean indicating form validity.
   */
  isValid(): boolean | null {
    return this._isValid;
  }

  /**
   * Creates a wrapper element to handle the visibility of a field.
   * @param parent - The parent element.
   * @returns The created wrapper element.
   */
  private createWrapper(parent: HTMLElement): HTMLElement {
    const wrapper = document.createElement(DIV_ELEMENT);
    mountElement(wrapper, parent);
    return wrapper;
  }

  private mapFieldToDataPrefix(options: Record<string, any>, id: string, key: string | null = null): void {
    let newId = options.id;
    if (key) {
      newId = transformFieldName(id, key, options.id);
    }

    this._dataPrefixMap[newId] = {
      id,
      dataKey: options.id,
      key,
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
    options: Record<string, any>,
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
    const formElementType: string | null = getFormElementType(options.type);

    if (listId && key && formElementType === constructorTypes.field) {
      this.mapFieldToDataPrefix(duplicatedOptions, listId, key);
    }
    if (groupId && formElementType === constructorTypes.field) {
      this.mapFieldToDataPrefix(duplicatedOptions, groupId, null);
    }

    const Constructed: FormElement = new Constructor(wrapper, this, duplicatedOptions);

    switch (formElementType) {
      case constructorTypes.button:
        if (listId && key) {
          this.assignToListField(listId, key, Constructed, formElementType, options.id);
        } else this._buttons[options.id] = Constructed;
        break;
      case constructorTypes.group:
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
      case constructorTypes.field:
        if (listId && key) {
          this.assignToListField(listId, key, Constructed, formElementType, options.id);
        } else {
          this._fields[options.id] = Constructed;
        }
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

    if (!list || !list.assignButton || !list.assignGroup || !list.assignField) return;
    switch (formElementType) {
      case constructorTypes.button:
        list.assignButton(id, key, constructed);
        break;
      case constructorTypes.group:
        list.assignGroup(id, key, constructed);
        break;
      case constructorTypes.field:
        list.assignField(id, key, constructed);
        break;
    }
  }

  /**
   * Updates all elements of the form (groups, rows, fields, buttons).
   */
  async update(): Promise<void> {
    if (this._groups) {
      Object.keys(this._groups).forEach((key: string) => {
        this._groups[key].update();
      });
    }
    if (this._fields) {
      Object.keys(this._fields).forEach((key: string) => {
        this._fields[key].update();
      });
    }
    if (this._buttons) {
      Object.keys(this._buttons).forEach((key: string) => {
        this._buttons[key].update();
      });
    }
  }

  /**
   * Fetches a specified field from the form by ID.
   * @param id - The ID of the desired field.
   * @returns The field with the specified ID or undefined.
   */
  getField(id: string): FormElement | undefined {
    return this._fields[id];
  }

  /**
   * Gets the main form element.
   * @returns The form element.
   */
  getFormElement() {
    return this._formElement;
  }

  private dispatchEvent(event: FormEvents, data: object | null = null) {
    if (!this._triggerEvents) return;
    const dispatched =
      data !== null
        ? new CustomEvent(event, {
            detail: data,
          })
        : new CustomEvent(event);
    this._formElement?.dispatchEvent(dispatched);
  }

  /**
   * Updates the form data with the provided value.
   * @param id - The ID of the data point.
   * @param value - The value to set.
   * @param prefixes - Optional prefixes for the data.
   */
  setData(id: string, value: FieldValue): void {
    // Check if the ID exists in the map
    if (Object.prototype.hasOwnProperty.call(this._dataPrefixMap, id)) {
      this.setDataFromMap(id, value);
    } else {
      this.setSimpleData(id, value);
    }
    this.update();
    this.dispatchEvent(FormEvents.DataUpdated, this._data);
  }

  removeData(id: string): void {
    if (Object.prototype.hasOwnProperty.call(this._dataPrefixMap, id)) {
      this.removeMappedData(id);
    } else {
      delete this._data[id];
    }
    this.dispatchEvent(FormEvents.DataUpdated, this._data);
  }

  private removeMappedData(id: string) {
    const fieldMapping = this._dataPrefixMap[id];
    const { dataKey, key, id: prefixDataId } = fieldMapping;

    // Ensure all necessary properties exist
    if (!dataKey || !prefixDataId) return;

    if (key) {
      const list = this.getField(prefixDataId);
      if (!list || !list.getKeyIndex) return;
      const prefixId = list.getId();
      const keyIndex = list.getKeyIndex(key);
      delete this._data[prefixId][keyIndex][dataKey];
      if (
        typeof this._data[prefixId][keyIndex] === 'object' &&
        Object.keys(this._data[prefixId][keyIndex]).length === 0
      ) {
        delete this._data[prefixId][keyIndex];
      }
    } else {
      const group = this.getGroup(prefixDataId);
      if (!group) return;
      const prefixId = group.getId();
      delete this._data[prefixId][dataKey];
      if (typeof this._data[prefixId] === 'object' && Object.keys(this._data[prefixId]).length === 0) {
        delete this._data[prefixId];
      }
    }
  }

  private setDataFromMap(id: string, value: FieldValue) {
    const fieldMapping = this._dataPrefixMap[id];
    const { dataKey, key, id: prefixDataId } = fieldMapping;

    // Ensure all necessary properties exist
    if (!dataKey || !prefixDataId) return;

    if (key) {
      const list = this.getField(prefixDataId);
      if (!list || !list.getKeyIndex) return;
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
  getButtons(): Record<string, FormElement> {
    return this._buttons;
  }

  /**
   * Fetches a specified button from the form by ID.
   * @param id - The ID of the desired button.
   * @returns The button with the specified ID or undefined.
   */
  getButton(id: string): FormElement | undefined {
    return this._buttons[id];
  }

  /**
   * Fetches all groups present in the form.
   * @returns The groups.
   */
  getGroups(): Record<string, FormElement> {
    return this._groups;
  }

  /**
   * Fetches a specified group from the form by ID.
   * @param id - The ID of the desired group.
   * @returns The group with the specified ID or undefined.
   */
  getGroup(id: string): FormElement | undefined {
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
   * Fetches save progress option.
   * @returns array of string errors.
   */
  getErrors(): string[] {
    return this._errors;
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
    this._triggerEvents = false;
    if (event) event.preventDefault();
    if (this._groups) {
      Object.keys(this._groups).forEach((key: string) => {
        const group = this._groups[key];
        if (group.reset && typeof group.reset === 'function') group.reset();
      });
    }
    if (this._fields) {
      Object.keys(this._fields).forEach((key: string) => {
        const field = this._fields[key];
        if (field.reset && typeof field.reset === 'function') field.reset();
      });
    }
    if (this._buttons) {
      Object.keys(this._buttons).forEach((key: string) => {
        const button = this._buttons[key];
        if (button.reset && typeof button.reset === 'function') button.reset();
      });
    }
    this._isValid = null;
    this._triggerEvents = true;
    this.dispatchEvent(FormEvents.Resetted);
  }

  /**
   * Validates all fields of the form.
   */
  validate(): void {
    if (this._fields) {
      Object.keys(this._fields).forEach((key: string) => {
        const field = this._fields[key];
        if (field.validate && typeof field.validate === 'function') field.validate();
      });
    }
    this._isValid = this._errors.length === 0;
  }

  /**
   * Validates all fields of the form.
   */
  save(): void {
    if (!this._saveProgress || !this.hasValidLicense()) return;
    if (this._fields) {
      Object.keys(this._fields).forEach((key: string) => {
        const field = this._fields[key];
        if (field.save && typeof field.save === 'function') field.save();
      });
    }
    if (this._groups) {
      Object.keys(this._groups).forEach((key: string) => {
        const group = this._groups[key];
        if (group.save && typeof group.save === 'function') group.save();
      });
    }
  }

  /**
   * Validates all fields of the form.
   */
  load(): void {
    if (!this._saveProgress || !this.hasValidLicense()) return;
    if (this._fields) {
      Object.keys(this._fields).forEach((key: string) => {
        const field = this._fields[key];
        if (field.load && typeof field.load === 'function') field.load();
      });
    }
    if (this._groups) {
      Object.keys(this._groups).forEach((key: string) => {
        const group = this._groups[key];
        if (group.load && typeof group.load === 'function') group.load();
      });
    }
  }

  /**
   * Initializes the form's GUI elements.
   */
  onGui(): void {
    this._formElement = document.createElement(FORM_ELEMENT);
    this._formElement.setAttribute(ID_ATTRIBUTE, this._id);
    this._formElement.className = this.options.className!;
    if (this.options.action) this._formElement.setAttribute(ACTION_ATTRIBUTE, this.options.action);
    if (this.options.method) this._formElement.setAttribute(METHOD_ATTRIBUTE, this.options.method);
    this._formElement.addEventListener(SUBMIT_ATTRIBUTE, (event: SubmitEvent) => this.submit(event));
    this._formElement.addEventListener(RESET_ATTRIBUTE, this.reset);
    if (usesLicensedFetures() && !this.hasValidLicense()) this.createInvalidElement();
  }

  private createInvalidElement() {
    
  }

  /**
   * Handles the form's submit action, validates fields, and sends data if applicable.
   * @param event - The event that triggered the submission.
   * @param form - The current form instance.
   */
  submit(event?: SubmitEvent): void {
    if (!this.options.action && event) event.preventDefault();
    this.validate();

    if (!this.isValid()) {
      this.dispatchEvent(FormEvents.ValidationFailed);
      return;
    }
    let data = this.getData();
    if (this.options.useFormData) {
      data = objectToFormData(this.getData());
    }
    if (this.options.submit) this.options.submit(data);
    this.dispatchEvent(FormEvents.Submitted, data);
  }

  /**
   * Handles destruction of the form.
   */
  destroy() {
    if (this._parent) this._parent.remove();
  }

  /**
   * Adds event listener to the form.
   */
  on(event: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) {
    this._formElement?.addEventListener(event, listener, options);
  }

  /**
   * Removes event listener to the form.
   */
  off(event: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) {
    this._formElement?.removeEventListener(event, listener, options);
  }
}
