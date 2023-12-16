import Form  from './form.js';
import { mountElement, unmountElement } from './utils.js';
import { ButtonOptions } from './interfaces.js';
import { HTMLElementEvent } from './types.js';

export class Button {
  public options: ButtonOptions = {
    id: '',
    type: 'button',
    buttonType: 'submit',
    className: 'btn form-button',
    template: 'Submit',
  };
  public containerElement: HTMLElement | null = null;
  public buttonElement: HTMLElement | null = null;

  private _id: string;
  private _parent: HTMLElement;
  private _form: Form;
  private _isMounted: boolean = false;
  private _isVisible: boolean = true;
  private _type: string;

  /**
   * Create a new Button.
   * @param parent - The parent element to mount the button on.
   * @param form - Associated form instance.
   * @param options - Configuration options for the button.
   */
  constructor(parent: HTMLElement, form: Form, options: ButtonOptions) {
    this.initializeOptions(options);
    this._parent = parent;
    this._form = form;
    this._id = this.options.id;
    this._type = options.type;
    this.onGui();
    this.initialize();
  }

  /**
   * Merge default options with provided options.
   * @param options - Configuration options for the button.
   */
  initializeOptions(options: ButtonOptions): void {
    this.options = Object.assign({}, this.options, options);
  }

  /** Initialization logic after setting up the button. */
  async initialize(): Promise<void> {
    await this.reset();
  }

  /** Get the ID of the button. */
  getId(): string {
    return this._id;
  }

  /** Get the container element of the button. */
  getContainer(): HTMLElement | null {
    return this.containerElement;
  }

  /** Get the type of the button. */
  getType(): string {
    return this._type;
  }

  /** Get the button type of the button. */
  getButtonType(): string {
    return this.options.buttonType;
  }

  /** Get the visibility status of the button. */
  getVisibility(): boolean {
    return this._isVisible;
  }

  /** Create the container element for the button. */
  createContainerElement(): void {
    this.containerElement = document.createElement('div');
    this.containerElement.className = 'form-button-container';
    this.containerElement.setAttribute('id', this._id + '_container');
  }

  /** Create the button element and its attributes. */
  createButtonElement(): void {
    this.buttonElement = document.createElement('button');
    this.buttonElement.className = this.options.className!;
    this.buttonElement.setAttribute('id', this._id);
    this.buttonElement.setAttribute('type', this.options.buttonType);
    this.buttonElement.innerHTML = this.options.template;
    this.buttonElement.addEventListener('click', (event: MouseEvent): void => this.onClick(event));
  }

  /** Set up GUI elements for the button. */
  onGui(): void {
    this.createContainerElement();
    this.createButtonElement();
    if (this.containerElement && this.buttonElement) mountElement(this.buttonElement, this.containerElement);
  }

  /** Mount the button to the parent element. */
  private mount(): void {
    if (this.buttonElement) mountElement(this.buttonElement, this._parent);
    this._isMounted = true;
  }

  /** Unmount the button from the parent element. */
  private unmount(): void {
    if (this.buttonElement) unmountElement(this.buttonElement);
    this._isMounted = false;
  }

  /** Fully removes the element from the DOM. */
  destroy(): void {
    if (this._parent) unmountElement(this._parent);
  }

  /** Handle the visibility of the button based on its status. */
  handleVisibility(): void {
    if (this._isVisible && !this._isMounted) this.mount();
    if (!this._isVisible && this._isMounted) this.unmount();
  }

  /**
   * Click event handler for the button.
   * @param event - The click event.
   */
  onClick(event: MouseEvent) {
    if (this.options.click) this.options.click(event, this._form.getData());
  }

  /** Reset the button state. */
  async reset(): Promise<void> {
    this.update();
  }

  /** Update the button's visibility based on conditions. */
  async update(): Promise<void> {
    this.updateVisibilityBasedOnConditions();
    this.handleVisibility();
  }

  /** Updates visibility based on options. */
  private updateVisibilityBasedOnConditions(): void {
    if (this.options.conditions) this._isVisible = this.options.conditions(this._form.getData());
  }
}
