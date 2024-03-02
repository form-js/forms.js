import {
  Form,
  extractFieldsFromSchema,
  mountElement,
  unmountElement,
  Schema,
  FormData,
  evaluateParsedConditions,
  parseConditionString,
  ParsedCondition,
} from '@forms.js/core';
import { Tabs } from './tabs';
import { FormElement } from '@forms.js/core/lib/types';

export class Tab {
  public options: TabOptions = {
    id: '',
    label: '',
    schema: [],
    validation: (fields: string[], form: Form): true | string => {
      return (
        fields.every((id) => {
          const field: FormElement | undefined = form.getField(id);
          if (!field?.validate || typeof field.validate !== 'function') return;
          return field && field.validate();
        }) || ''
      );
    },
  };
  public headerElement: HTMLElement | null = null;
  public headerContainerElement: HTMLElement | null;
  public bodyElement: HTMLElement | null = null;
  public bodyContainerElement: HTMLElement | null;
  public validationElement: HTMLElement | null = null;

  private _id: string;
  private _form: Form;
  private _isMounted: boolean = false;
  private _isVisible: boolean = true;
  private _isValid: boolean | null = null;
  private _isDisabled: boolean = false;
  private _isActive: boolean = false;
  private _parent: Tabs;
  private _fields: string[] = [];
  private _vMessage: string | null = null;
  private _type: string;
  private _parsedConditions: ParsedCondition[] | null = null;
  private _parsedDisabledConditions: ParsedCondition[] | null = null;
  private _parsedValidationConditions: ParsedCondition[] | null = null;

  /**
   * Constructor to initialize a new Tab instance.
   *
   * @param {Form} form - The form instance associated with the tab.
   * @param {Tabs} tabs - The tabs component containing this tab.
   * @param {TabOptions} options - Configuration options for the tab.
   * @param {HTMLElement | null} headerContainerElement - Container for the tab header.
   * @param {HTMLElement | null} bodyContainerElement - Container for the tab body.
   */
  constructor(
    form: Form,
    tabs: Tabs,
    options: TabOptions,
    headerContainerElement: HTMLElement | null,
    bodyContainerElement: HTMLElement | null,
  ) {
    this.initializeOptions(options);
    this._id = this.options.id;
    this._parent = tabs;
    this.headerContainerElement = headerContainerElement;
    this.bodyContainerElement = bodyContainerElement;
    this._form = form;
    this._type = 'tab';
    this.onGui();
    this.initialize();
  }

  /**
   * Merge default options with provided options.
   *
   * @param {TabOptions} options - Options to merge with defaults.
   */
  initializeOptions(options: TabOptions): void {
    this.options = Object.assign({}, this.options, options);
  }

  /**
   * Perform initialization logic for the tab.
   */
  async initialize(): Promise<void> {
    this.parseStringConditions();
    this.bindTabActivate();
    this._fields = extractFieldsFromSchema(this.options.schema);
    await this.reset();
  }

  /** Parse conditions from string if needed */
  private parseStringConditions(): void {
    if (typeof this.options.conditions === 'string') {
      this._parsedConditions = parseConditionString(this.options.conditions);
    }
    if (typeof this.options.disabled === 'string') {
      this._parsedDisabledConditions = parseConditionString(this.options.disabled);
    }
    if (typeof this.options.validation === 'string') {
      this._parsedValidationConditions = parseConditionString(this.options.validation);
    }
  }

  /**
   * Retrieve the schema associated with the tab.
   *
   * @returns {Schema} The tab's schema.
   */
  getSchema(): Schema {
    return this.options.schema;
  }

  /** @returns {Array} of IDs of fields asociated with the tab. */
  getFields(): string[] {
    return this._fields;
  }

  /** Returns true if tab is currently active and false if otherwise.  */
  isActive(): boolean {
    return this._isActive;
  }

  /** Returns the body element of the tab. */
  getBody(): HTMLElement | null {
    return this.bodyElement;
  }

  /** Returns the header element of the tab. */
  getHeader(): HTMLElement | null {
    return this.headerElement;
  }

  /** Returns the disabled status of the tab. */
  isDisabled(): boolean {
    return this._isDisabled;
  }

  /** Returns the validity status of the tab. */
  getValidity(): boolean | null {
    return this._isValid;
  }

  /** Returns the ID of the tab. */
  getId(): string {
    return this._id;
  }

  /** Returns the tab type. */
  getType(): string {
    return this._type;
  }

  /** Returns the visibility status of the tab. */
  getVisibility(): boolean {
    return this._isVisible;
  }

  /**
   * Creates the header element for the tab.
   */
  createHeaderElement(): void {
    this.headerElement = document.createElement('div');
    this.headerElement.setAttribute('id', this._id + '_header');
    this.headerElement.setAttribute('role', 'tab');
    this.headerElement.setAttribute('aria-controls', this._id + '_body');
    this.headerElement.className = 'tab-header';
    this.headerElement.innerHTML = this.options.label;
  }

  /**
   * Creates the body element for the tab.
   */
  createBodyElement(): void {
    this.bodyElement = document.createElement('div');
    this.bodyElement.className = 'tab-body';
    this.bodyElement.setAttribute('id', this._id + '_body');
    this.bodyElement.setAttribute('aria-labelledby', this._id + '_header');
    this.bodyElement.setAttribute('role', 'tabpanel');
  }

  /**
   * Creates the validation element for the tab.
   */
  createValidationElement(): void {
    // Validation element
    this.validationElement = document.createElement('p');
    this.validationElement.setAttribute('id', this._id + '_validation');
    this.validationElement.className = 'form-tab-validation';
    this.validationElement.style.display = 'none';
  }

  /**
   * React to GUI changes for the tab.
   */
  onGui(): void {
    this.createHeaderElement();
    this.createBodyElement();
    this.createValidationElement();

    if (this.bodyElement && this.validationElement) mountElement(this.validationElement, this.bodyElement);
  }

  /**
   * Handle the display of the tab's validation status.
   */
  handleValidatedTab(): void {
    if (this._isValid) {
      this.headerElement?.classList.remove('error');
      this.bodyElement?.classList.remove('error');
      this.headerElement?.classList.add('validated');
      this.bodyElement?.classList.add('validated');
      if (this.validationElement) {
        this.validationElement.style.display = 'none';
      }
    } else {
      this.headerElement?.classList.remove('validated');
      this.bodyElement?.classList.remove('validated');
      this.headerElement?.classList.add('error');
      this.bodyElement?.classList.add('error');
      if (this.validationElement && this._vMessage) {
        this.validationElement.innerText = this._vMessage;
        this.validationElement.style.display = 'block';
      }
    }
  }

  /** Handles the visibility of the tab, mounting or unmounting as needed. */
  handleVisibility(): void {
    if (this._isVisible && !this._isMounted) this.mount();
    if (!this._isVisible && this._isMounted) this.unmount();
  }

  /** Handles the disability of the tab. */
  handleDisabled(): void {
    if (this._isDisabled) {
      this.headerElement?.classList.add('disabled');
      this.bodyElement?.classList.add('disabled');
    } else {
      this.headerElement?.classList.remove('disabled');
      this.bodyElement?.classList.remove('disabled');
    }
  }

  /**
   * Handle the display of the tab's validation status.
   */
  validate(): boolean | null {
    if (!this._isVisible) return true;
    if (this.options.validation) {
      if (typeof this.options.validation === 'string' && this._parsedValidationConditions) {
        const validity = evaluateParsedConditions(
          this._parsedValidationConditions,
          this._form.getData(),
          null,
          null,
          true,
        ) as true | string;
        this.setValidationValues(validity);
      } else if (typeof this.options.validation === 'function') {
        const validity = this.options.validation(this._fields, this._form);
        this.setValidationValues(validity);
      } else this._isValid = true;
      this.handleValidatedTab();
    } else this._isValid = true;
    return this._isValid;
  }

  private setValidationValues(validity: string | true) {
    this._isValid = validity === true;
    this._vMessage = validity === true ? '' : validity;
  }

  /**
   * Mounts the tab elements to their respective containers.
   */
  private mount(): void {
    if (this.headerContainerElement && this.headerElement)
      mountElement(this.headerElement, this.headerContainerElement);
    if (this.bodyContainerElement && this.bodyElement) mountElement(this.bodyElement, this.bodyContainerElement);
    this._isMounted = true;
  }

  /**
   * Unmounts the tab elements to their respective containers.
   */
  private unmount(): void {
    if (this.headerElement) unmountElement(this.headerElement);
    if (this.bodyElement) unmountElement(this.bodyElement);
    this._isMounted = false;
  }

  /**
   * Resets the tab's status and updates its display.
   */
  async reset(): Promise<void> {
    this.update();
  }

  /** Updates the tab based on its current state and options. */
  async update(): Promise<void> {
    this.updateVisibilityBasedOnConditions();
    this.updateDisabledStatus();
    if (this._isValid === false) this.validate();
    this.handleVisibility();
    this.handleDisabled();
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

  /** Updates disability based on options. */
  private updateDisabledStatus(): void {
    if (this.options.disabled) {
      if (typeof this.options.disabled === 'string' && this._parsedDisabledConditions) {
        this._isDisabled = evaluateParsedConditions(this._parsedDisabledConditions, this._form.getData()) as boolean;
      } else {
        if (typeof this.options.disabled === 'function') {
          this._isDisabled = this.options.disabled(this._form.getData());
        } else if (typeof this.options.disabled === 'boolean') {
          this._isDisabled = this.options.disabled;
        }
      }
    }
  }

  /**
   * Binds a click event to the tab header to handle activation.
   */
  bindTabActivate() {
    this.headerElement?.addEventListener('click', (event: any) => {
      this.headerClick();
    });
  }

  /**
   * Handles a click event to the tab header.
   */
  private headerClick() {
    if (!this._isVisible || this._isDisabled) return;
    this._parent.activate(this._id);
  }

  /**
   * Activates the tab, making it the currently displayed tab.
   */
  activate(): void {
    if (!this._isVisible || this._isDisabled) return;
    this.headerElement?.classList.add('active');
    this.headerElement?.setAttribute('aria-selected', 'true');
    this.headerElement?.removeAttribute('hidden');
    this.bodyElement?.classList.add('active');
    this._isActive = true;
  }

  /**
   * Activates the tab, making it the currently displayed tab.
   */
  deactivate(): void {
    if (!this._isVisible || this._isDisabled) return;
    this.headerElement?.classList.remove('active');
    this.headerElement?.removeAttribute('aria-selected');
    this.headerElement?.setAttribute('hidden', 'true');
    this.bodyElement?.classList.remove('active');
    this._isActive = false;
  }
}

export interface TabOptions {
  id: string;
  label: string;
  conditions?: ((data: FormData) => boolean) | string;
  validation?: ((fields: string[], form: Form) => true | string) | string;
  disabled?: ((data: FormData) => boolean) | boolean | string;
  schema: Schema;
}
