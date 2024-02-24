import { Form } from './form';
import { evaluateParsedConditions, mountElement, parseConditionString, unmountElement } from './utils';
import { GroupOptions } from './interfaces';
import { ParsedCondition } from './types';

export class Group {
  public options: GroupOptions = {
    id: '',
    type: 'group',
    className: 'form-group',
    prefixSchema: false,
    schema: [],
  };
  public containerElement: HTMLElement | null = null;
  public schemaContainerElement: HTMLElement | null = null;
  public labelElement: HTMLElement | null = null;

  private _id: string;
  private _parent: HTMLElement;
  private _form: Form;
  private _isMounted: boolean = false;
  private _isVisible: boolean = true;
  private _type: string;
  private _parsedConditions: ParsedCondition[] | null = null;

  /**
   * Creates a new group.
   * @param parent - The parent element to which this group belongs.
   * @param form - The form associated with the group.
   * @param options - The configuration options for the group.
   */
  constructor(parent: HTMLElement, form: Form, options: GroupOptions) {
    this.initializeOptions(options);
    this._parent = parent;
    this._form = form;
    this._id = this.options.id;
    this._type = options.type;
    this.onGui();
    this.initialize();
  }

  /**
   * Initializes or updates the options of the group.
   * @param options - The new configuration options to apply.
   */
  initializeOptions(options: GroupOptions): void {
    this.options = Object.assign({}, this.options, options);
  }

  /** Initializes the group and sets up its initial visibility. */
  async initialize(): Promise<void> {
    this.parseStringConditions();
    await this.reset();
    this.handleVisibility();
  }

  /** Parse conditions from string if needed */
  private parseStringConditions(): void {
    if (typeof this.options.conditions === 'string') {
      this._parsedConditions = parseConditionString(this.options.conditions);
    }
  }

  /** Returns the ID of the group. */
  getId(): string {
    return this._id;
  }

  /** Returns the container element of the group. */
  getContainer(): HTMLElement | null {
    return this.containerElement;
  }

  /** Returns the that group schema should be build in. */
  getSchemaContainer(): HTMLElement | null {
    return this.schemaContainerElement;
  }

  /** Returns the group type. */
  getType(): string {
    return this._type;
  }

  /** Returns the visibility status of the group. */
  getVisibility(): boolean {
    return this._isVisible;
  }

  /** Creates and sets up the container element for the group. */
  createContainerElement(): void {
    this.containerElement = document.createElement('div');
    this.containerElement.className = 'form-group-container';
    this.containerElement.setAttribute('id', this._id + '_group_container');
  }

  /** Creates and sets up the container element for the group. */
  createSchemaContainerElement(): void {
    this.schemaContainerElement = document.createElement('div');
    this.schemaContainerElement.className = this.options.className!;
    this.schemaContainerElement.setAttribute('id', this._id);
  }

  /** Creates and sets up the label element for the group. */
  createLabelElement(): void {
    this.labelElement = document.createElement('h3');
    if (this.options.label) this.labelElement.innerText = this.options.label;
    this.labelElement.setAttribute('id', this._id + '_label');
    this.labelElement.className = 'form-group-label';
  }

  /** Initializes the GUI components of the group. */
  onGui(): void {
    this.createContainerElement();
    this.createSchemaContainerElement();
    this.createLabelElement();
    if (this.containerElement && this.labelElement && this.options.label)
      mountElement(this.labelElement, this.containerElement);
    if (this.containerElement && this.schemaContainerElement)
      mountElement(this.schemaContainerElement, this.containerElement);
  }

  /** Mounts the group to the DOM. */
  private mount(): void {
    if (this.containerElement) mountElement(this.containerElement, this._parent);
    this._isMounted = true;
  }

  /** Unmounts the group from the DOM. */
  private unmount(): void {
    if (this.containerElement) unmountElement(this.containerElement);
    this._isMounted = false;
  }

  /** Fully removes the element from the DOM. */
  destroy(): void {
    if (this._parent) unmountElement(this._parent);
  }

  /** Handles the visibility of the group, mounting or unmounting as needed. */
  handleVisibility(): void {
    if (this._isVisible && !this._isMounted) this.mount();
    if (!this._isVisible && this._isMounted) this.unmount();
  }

  /** Resets the group. */
  async reset(): Promise<void> {
    this.update();
  }

  /** Updates the group based on its current state and options. */
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
        this._isVisible = this.options.conditions(this._form.getData());
      }
    }
  }
}
