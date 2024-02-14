import {
  Form,
  mountElement,
  unmountElement,
  Button,
  generateFieldSaveKey,
  ButtonOptions,
  FormData,
  Schema,
  evaluateParsedConditions,
  parseConditionString,
  ParsedCondition,
} from '@forms.js/core';

export class ListField {
  // Public properties
  public options: ListFieldOptions = {
    id: '',
    type: 'list',
    className: 'form-list',
    buildButtons: true,
    listRemoveClassName: 'btn form-button remove-list',
    listAddClassName: 'btn form-button add-list',
    listRemoveTemplate: '-',
    listAddTemplate: '+',
    schema: [],
  };
  public containerElement: HTMLElement | null = null;
  public addButtonContainerElement: HTMLElement | null = null;
  public listsContainerElement: HTMLElement | null = null;
  public labelElement: HTMLElement | null = null;
  public addButton: Button | null = null;

  // Private properties
  private _id: string;
  private _parent: HTMLElement;
  private _form: Form;
  private _isMounted: boolean = false;
  private _isVisible: boolean = true;
  private _type: string;
  private _saveKey: string;
  private _keys: string[] = [];
  private _fields: Record<string, any> = {};
  private _groups: Record<string, any> = {};
  private _buttons: Record<string, any> = {};
  private _parsedConditions: ParsedCondition[] | null = null;

  /**
   * Creates a new list.
   * @param parent - The parent element to which this list belongs.
   * @param form - The form associated with the list.
   * @param options - The configuration options for the list.
   */
  constructor(parent: HTMLElement, form: Form, options: ListFieldOptions) {
    this.initializeOptions(options);
    this._parent = parent;
    this._form = form;
    this._id = this.options.id;
    this._type = options.type;
    this._saveKey = generateFieldSaveKey(this._form.getId(), this._id);
    this.onGui();
    this.initialize();
  }

  /**
   * Initializes or updates the options of the list.
   * @param options - The new configuration options to apply.
   */
  initializeOptions(options: ListFieldOptions): void {
    this.options = Object.assign({}, this.options, options);
  }

  /** Initializes the list and sets up its initial visibility. */
  async initialize(): Promise<void> {
    this.parseStringConditions();
    this.load();
    this.update();
    this.handleVisibility();
  }

  /** Parse conditions from string if needed */
  private parseStringConditions(): void {
    if (typeof this.options.conditions === 'string') {
      this._parsedConditions = parseConditionString(this.options.conditions);
    }
  }

  addListRow(defkey: string | null = null, save: boolean = true): string {
    const key = defkey || String(Date.now());
    this._keys.push(key);
    this._fields[key] = {};
    this._groups[key] = {};
    this._buttons[key] = {};
    if (this.listsContainerElement) {
      this._form.buildSchema(this.newListSchema(key), this.listsContainerElement, null, this.getId(), key);
    }
    if (save) this.save();
    return key;
  }

  /** Removes a list row based on key
   * @param key - Key of new list.
   * @param save - boolean determines if changes will be saved into local storage.
   */
  removeListRow(key: string, save: boolean = true): void {
    if (this._groups[key]) {
      this._groups[key]['form-list-' + key + '-group']?.destroy();
      delete this._fields[key];
      delete this._groups[key];
      delete this._buttons[key];
    }
    this._form.removeListData(this._id, this.getKeyIndex(key));
    this._keys = this._keys.filter((k) => k !== key);
    if (save) this.save();
  }

  assignField(id: string, key: string, field: any): void {
    this._fields[key][id] = field;
  }

  assignGroup(id: string, key: string, field: any): void {
    this._groups[key][id] = field;
  }

  assignButton(id: string, key: string, field: any): void {
    this._buttons[key][id] = field;
  }

  getKeyIndex(key: string): number {
    return this._keys.indexOf(key);
  }

  /** Returns the ID of the list. */
  getId(): string {
    return this._id;
  }

  /** Returns fields. */
  getFields(): Record<string, any> {
    return this._fields;
  }

  /** Returns buttons. */
  getButtons(): Record<string, any> {
    return this._buttons;
  }

  /** Returns groups. */
  getGroups(): Record<string, any> {
    return this._buttons;
  }

  /**
   * Gets the key uder that fields value is saved in local storage.
   * @returns string key.
   */
  getSaveKey(): string {
    return this._saveKey;
  }

  /** Returns the container element of the list. */
  getContainer(): HTMLElement | null {
    return this.containerElement;
  }

  /** Returns the list type. */
  getType(): string {
    return this._type;
  }

  /** Returns the visibility status of the list. */
  getVisibility(): boolean {
    return this._isVisible;
  }

  /** Prepares a schema for new list
   * @param key - Key of new list.
   * @returns Schema
   */
  private newListSchema(key: string): Schema {
    const schema = [...this.options.schema];
    const removeButton = {
      id: 'form-list-button-remove',
      type: 'button',
      buttonType: 'button',
      className: this.options.listRemoveClassName!,
      template: this.options.listRemoveTemplate!,
      click: () => {
        if (!this._fields[key] || typeof this._fields[key] !== 'object') return;
        Object.keys(this._fields[key]).forEach((id: string) => {
          this._fields[key][id].reset();
        });
        this.removeListRow(key);
      },
    };
    if (this.options.buildButtons) {
      schema.push(removeButton);
    }
    return [
      {
        id: 'form-list-' + key + '-group',
        className: 'form-list-group',
        type: 'group',
        schema: [...schema],
      },
    ];
  }

  /** Creates and sets up the container element. */
  createContainerElement(): void {
    // Container element
    this.containerElement = document.createElement('div');
    this.containerElement.className = this.options.className!;
    this.containerElement.setAttribute('id', this._id);
  }

  /** Creates and sets up the lists container element. */
  createListsContainerElement(): void {
    // Container element
    this.listsContainerElement = document.createElement('div');
    this.listsContainerElement.className = 'form-list-container';
    this.listsContainerElement.setAttribute('id', this._id + '_list_container');
  }

  /** Creates and sets up the add button. */
  createAddButton(): void {
    const addButtonOptions: ButtonOptions = {
      id: 'form-list-' + this._id + '-button-add',
      type: 'button',
      buttonType: 'button',
      className: this.options.listAddClassName!,
      template: this.options.listAddTemplate!,
      click: () => {
        this.addListRow();
      },
    };
    this.addButtonContainerElement = document.createElement('div');
    this.addButtonContainerElement.className = 'form-list-button-add-row';
    this.addButtonContainerElement.setAttribute('id', this._id + '_button_add_row');
    if (this.options.buildButtons && this.addButtonContainerElement) {
      this.addButton = new Button(this.addButtonContainerElement, this._form, addButtonOptions);
    }
  }

  /** Creates and sets up the label element for the list. */
  createLabelElement(): void {
    // Label element
    this.labelElement = document.createElement('h3');
    // Label text
    if (this.options.label) this.labelElement.innerText = this.options.label;
    this.labelElement.setAttribute('id', this._id + '_label');
    this.labelElement.className = 'form-list-label';
  }

  /** Initializes the GUI components of the list. */
  onGui(): void {
    this.createContainerElement();
    this.createLabelElement();
    this.createListsContainerElement();
    this.createAddButton();

    if (this.containerElement && this.labelElement && this.options.label)
      mountElement(this.labelElement, this.containerElement);
    if (this.containerElement && this.listsContainerElement)
      mountElement(this.listsContainerElement, this.containerElement);
    if (this.containerElement && this.addButtonContainerElement)
      mountElement(this.addButtonContainerElement, this.containerElement);
  }

  /** Mounts the list to the DOM. */
  private mount(): void {
    if (this.containerElement) mountElement(this.containerElement, this._parent);
    this._isMounted = true;
  }

  /** Unmounts the list from the DOM. */
  private unmount(): void {
    if (this.containerElement) unmountElement(this.containerElement);
    this._isMounted = false;
  }

  /** Handles the visibility of the list, mounting or unmounting as needed. */
  handleVisibility(): void {
    if (this._isVisible && !this._isMounted) this.mount();
    if (!this._isVisible && this._isMounted) this.unmount();
  }

  /** Save the fields value into local stroage. */
  save(): void {
    if (this._form.savesProgress() && this._form.hasValidLicense()) {
      localStorage.setItem(this._saveKey, JSON.stringify(this._keys));
      this.cascadeSave();
    }
  }

  /** Load the fields value from local stroage. */
  load(): void {
    if (this._form.savesProgress() && this._form.hasValidLicense()) {
      const value: string | null = localStorage.getItem(this._saveKey);
      if (!value) {
        this.refreshLists();
        return;
      }
      const keys: string[] = JSON.parse(value);
      this.removeAllLists();
      keys.forEach((key: string) => {
        this.addListRow(key, false);
      });
      this.cascadeLoad();
      return;
    }
    this.refreshLists();
  }

  async refreshLists() {
    this.removeAllLists();
    // timeout to prevent overaping deletion and creating o new list
    setTimeout(() => {
      this.addListRow();
    }, 25);
  }

  private cascadeLoad() {
    this._keys.forEach((key: string) => {
      Object.keys(this._fields[key]).forEach((id: string) => {
        this._fields[key][id].load();
      });
    });
  }

  private cascadeSave() {
    this._keys.forEach((key: string) => {
      Object.keys(this._fields[key]).forEach((id: string) => {
        this._fields[key][id].save();
      });
    });
  }

  removeAllLists(): void {
    this._keys.forEach((key) => {
      this.removeListRow(key, false);
    });
  }

  /** Resets the list. */
  async reset(): Promise<void> {
    localStorage.removeItem(this._saveKey);
    this.refreshLists();
    this.update();
  }

  /** Updates the list based on its current state and options. */
  async update(): Promise<void> {
    this.updateVisibilityBasedOnConditions();
    this.handleVisibility();
    this._keys.forEach((key: string) => {
      Object.keys(this._groups[key]).forEach((id: string) => {
        this._groups[key][id].update();
      });
      Object.keys(this._fields[key]).forEach((id: string) => {
        this._fields[key][id].update();
      });
      Object.keys(this._buttons[key]).forEach((id: string) => {
        this._buttons[key][id].update();
      });
    });
  }

  /** Updates visibility based on options. */
  private updateVisibilityBasedOnConditions(): void {
    if (this.options.conditions) {
      if (this._parsedConditions) {
        this._isVisible = evaluateParsedConditions(this._parsedConditions, this._form.getData()) as boolean;
      } else if (typeof this.options.conditions === 'function') {
        this._isVisible = this.options.conditions(this._form.getData());
      }
    }
  }
}

export interface ListFieldOptions {
  id: string;
  label?: string;
  type: 'list';
  conditions?: ((data: FormData) => boolean) | string;
  buildButtons?: boolean;
  className?: string;
  listRemoveClassName?: string;
  listAddClassName?: string;
  listRemoveTemplate?: string;
  listAddTemplate?: string;
  schema: Schema;
}
