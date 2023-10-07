import { Form } from './form.js';
import { mountElement, unmountElement } from './utils.js';
import { RowOptions } from './interfaces.js';

export class Row {
  public options: RowOptions = {
    id: '',
    type: 'row',
    className: 'form-row',
    schema: [],
  };
  public containerElement: HTMLElement | null = null;
  public labelElement: HTMLElement | null = null;
  public rowElement: HTMLElement | null = null;

  private _id: string;
  private _parent: HTMLElement;
  private _form: Form;
  private _isMounted: boolean = false;
  private _isVisible: boolean = true;
  private _type: string;

  /**
   * Creates a new row.
   * @param parent - The parent element to which this row belongs.
   * @param form - The form associated with the row.
   * @param options - The configuration options for the row.
   */
  constructor(parent: HTMLElement, form: Form, options: RowOptions) {
    this.initializeOptions(options);
    this._parent = parent;
    this._form = form;
    this._id = this.options.id;
    this._type = options.type;
    this.onGui();
    this.initialize();
  }

  /**
   * Initializes or updates the options of the row.
   * @param options - The new configuration options to apply.
   */
  initializeOptions(options: RowOptions): void {
    this.options = Object.assign({}, this.options, options);
  }

  /** Initializes the row and sets up its initial visibility. */
  async initialize(): Promise<void> {
    await this.reset();
  }

  /** Returns the ID of the row. */
  getId(): string {
    return this._id;
  }

  /** Returns the container element of the row. */
  getContainer(): HTMLElement | null {
    return this.containerElement;
  }

  /** Returns the row element of the row. */
  getRow(): HTMLElement | null {
    return this.rowElement;
  }

  /** Returns the container element of the group. */
  getType(): string {
    return this._type;
  }

  /** Returns the visibility status of the group. */
  getVisibility(): boolean {
    return this._isVisible;
  }

  /** Creates and sets up the container element for the row. */
  createContainerElement(): void {
    this.containerElement = document.createElement('div');
    this.containerElement.className = 'form-row-container';
    this.containerElement.setAttribute('id', this._id + '_container');
  }

  /** Creates and sets up the row element for the row. */
  createRowElement(): void {
    this.rowElement = document.createElement('div');
    this.rowElement.className = this.options.className!;
    this.rowElement.setAttribute('id', this._id);
  }

  /** Creates and sets up the label element for the row. */
  createLabelElement(): void {
    this.labelElement = document.createElement('p');
    if (this.options.label) this.labelElement.innerText = this.options.label;
    this.labelElement.setAttribute('id', this._id + '_label');
    this.labelElement.className = 'form-row-label';
  }

  /** Initializes the GUI components of the row. */
  onGui() {
    this.createContainerElement();
    this.createLabelElement();
    this.createRowElement();
    // Append elements
    if (this.containerElement && this.labelElement && this.options.label)
      mountElement(this.labelElement, this.containerElement);
    if (this.containerElement && this.rowElement) mountElement(this.rowElement, this.containerElement);
  }

  /** Mounts the row to the DOM. */
  private mount(): void {
    if (this.containerElement) mountElement(this.containerElement, this._parent);
    this._isMounted = true;
  }

  /** Unmounts the row from the DOM. */
  private unmount(): void {
    if (this.containerElement) unmountElement(this.containerElement);
    this._isMounted = false;
  }

  /** Fully removes the element from the DOM. */
  destroy(): void {
    if (this._parent) unmountElement(this._parent);
  }

  /** Handles the visibility of the row, mounting or unmounting as needed. */
  handleVisibility(): void {
    if (this._isVisible && !this._isMounted) this.mount();
    if (!this._isVisible && this._isMounted) this.unmount();
  }

  /** Resets the row. */
  async reset(): Promise<void> {
    this.update();
  }

  /** Updates the row based on its current state and options. */
  async update(): Promise<void> {
    this.updateVisibilityBasedOnConditions();
    this.handleVisibility();
  }

  /** Updates visibility based on options. */
  private updateVisibilityBasedOnConditions(): void {
    if (this.options.conditions) this._isVisible = this.options.conditions(this._form.getData());
  }
}
