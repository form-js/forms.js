import { Form, Field, FieldValue, FormData, mountElement } from '@forms.js/core';

export interface RatingFieldOptions {
  id: string;
  name?: string;
  label?: string;
  type: 'rating';
  required?: ((value: FieldValue, data: FormData) => boolean) | boolean;
  change?: (value: FieldValue) => void;
  validation?: (value: FieldValue, data: FormData, required: boolean) => true | string;
  conditions?: (value: FieldValue, data: FormData) => boolean;
  disabled?: ((value: FieldValue, data: FormData) => boolean) | boolean;
  className?: string;
  default?: number | null;
  allowHalfStar?: boolean;
}

export class RatingField extends Field {
  public ratingStars: HTMLInputElement[] = [];

  public options: RatingFieldOptions = {
    id: '',
    type: 'rating',
    required: false,
    validation: (value, data, required) => {
      if (required && !value) return 'This field is required';
      return true;
    },
    className: 'form-rating',
    allowHalfStar: false,
  };

  constructor(parent: HTMLElement, form: Form, options: RatingFieldOptions) {
    super(parent, form, options);
    this.initializeOptions(options);
    this.onGui();
    this.initialize();
  }

  async initialize(): Promise<void> {
    this.load();
    this.update();
  }

  /**
 * Event handler for the input element's change event.
 */
  ratingChange(rating: number): void {
    this.setValue(rating);
    this.validate();
    if (this.options.change) this.options.change(this.getValue());
  }

  /** Handles GUI element creation and mounting. */
  onGui() {
    this.createContainerElement();
    this.createRatingElements();
    this.createLabelElement();
    this.createValidationElement();
    // Append elements
    if (this.labelElement && this.validationElement) mountElement(this.validationElement, this.labelElement);
    if (this.containerElement && this.labelElement) mountElement(this.labelElement, this.containerElement);
  }

  createRatingElements() {
    /*or (let i = 1; i <= 5; i++) {
      const element = document.createElement('div');
      element.className = 'rating-star';
      element.innerHTML = this.options.starEmpty ?? '';
      this.ratingStars.push(element);
      this.bindStarFunctions(element, i);
      this.ratingElement.append(element);
    }*/
  }

  createInputElement() {
    // Input element
    this.inputElement = document.createElement('input');
    this.inputElement.setAttribute('id', this.getId());
    this.inputElement.setAttribute('name', this.options.name || this.getId());
    this.inputElement.setAttribute('type', 'hidden');
  }
}