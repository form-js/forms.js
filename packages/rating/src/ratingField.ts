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
  public ratingStars: HTMLDivElement | null = null;
  private starsValueList: number[] = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

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

  /** Handles GUI element creation and mounting. */
  onGui() {
    this.createContainerElement();
    this.createRatingElements();
    this.createLabelElement();
    this.createValidationElement();
    // Append elements
    if (this.labelElement && this.ratingStars) mountElement(this.ratingStars, this.labelElement);
    if (this.labelElement && this.validationElement) mountElement(this.validationElement, this.labelElement);
    if (this.containerElement && this.labelElement) mountElement(this.labelElement, this.containerElement);
  }

  private getRadioName(name: string, value: number): string {
    return name + '_rating_' + String(value);
  }

  createRatingElements() {
    const element = document.createElement('div');
    element.className = 'rating-stars';
    this.starsValueList.forEach((value: number) => {
      if(!Number.isInteger(value) && !this.options.allowHalfStar) return;
      const name = this.options.name ? this.getRadioName(this.options.name, value) : this.getRadioName(this.getId(), value);
      const input = document.createElement('input');
      input.setAttribute('id', this.getId());
      input.setAttribute('name', name);
      input.setAttribute('type', 'radio');
      input.addEventListener('change', (e: any)=>{
        console.log("change");
        
        this.change(e)
      });
      const label = document.createElement('label');
      label.setAttribute('for', name);
      label.setAttribute('title', value + ' stars');
      label.className = Number.isInteger(value) ? 'full' : 'half';
      mountElement(input, element);
      mountElement(label, element);
    });
    this.ratingStars = element;
  }
}