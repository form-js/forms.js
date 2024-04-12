import { Form } from './form';
import {
  evaluateParsedConditions,
  getOverwritenDefaults,
  mountElement,
  parseConditionString,
  unmountElement,
} from './utils';
import { ButtonOptions } from './interfaces';
import { ParsedCondition } from './types';
import {
  BUTTON_CLASS_DEFAULT,
  BUTTON_CONTAINER_CLASS_DEFAULT,
  BUTTON_ELEMENT,
  CLICK_ATTRIBUTE,
  CONTAINER_DEFINITION,
  DIV_ELEMENT,
  ID_ATTRIBUTE,
  TYPE_ATTRIBUTE,
} from './constants';

export class Button {
  public options: ButtonOptions = {
    id: '',
    type: 'button',
    buttonType: 'submit',
    className: BUTTON_CLASS_DEFAULT,
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
  private _parsedConditions: ParsedCondition[] | null = null;

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
    this.options = Object.assign({}, this.options, getOverwritenDefaults(this.options.type, options));
  }

  /** Initialization logic after setting up the button. */
  async initialize(): Promise<void> {
    this.parseStringConditions();
    await this.reset();
  }

  /** Parse conditions from string if needed */
  private parseStringConditions(): void {
    if (typeof this.options.conditions === 'string') {
      this._parsedConditions = parseConditionString(this.options.conditions);
    }
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
    this.containerElement = document.createElement(DIV_ELEMENT);
    this.containerElement.className = BUTTON_CONTAINER_CLASS_DEFAULT;
    this.containerElement.setAttribute(ID_ATTRIBUTE, this._id + CONTAINER_DEFINITION);
  }

  /** Create the button element and its attributes. */
  createButtonElement(): void {
    this.buttonElement = document.createElement(BUTTON_ELEMENT);
    this.buttonElement.className = this.options.className!;
    this.buttonElement.setAttribute(ID_ATTRIBUTE, this._id);
    this.buttonElement.setAttribute(TYPE_ATTRIBUTE, this.options.buttonType);
    if (typeof this.options.template === 'string') {
      this.buttonElement.innerText = this.options.template;
    } else if (typeof this.options.template === 'function') {
      this.buttonElement.innerHTML = '';
      this.buttonElement.append(this.options.template());
    }
    this.buttonElement.addEventListener(CLICK_ATTRIBUTE, (event: MouseEvent): void => this.onClick(event));
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
    if (this._parent) this._parent.remove();
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
    if (this.options.conditions) {
      if (this._parsedConditions) {
        this._isVisible = evaluateParsedConditions(this._parsedConditions, this._form.getData()) as boolean;
      } else if (typeof this.options.conditions === 'function') {
        this._isVisible = this.options.conditions(this._form.getData());
      }
    }
  }
}
