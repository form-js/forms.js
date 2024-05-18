import { Form, Field, FieldValue, FormData, mountElement, FieldOptions } from '@forms.js/core';

export interface RatingFieldOptions extends FieldOptions {
  id: string;
  name?: string;
  label?: string | (() => HTMLElement);
  type: 'rating';
  required?: ((value: FieldValue, data: FormData) => boolean) | boolean;
  change?: (value: FieldValue) => void;
  validation?: (value: FieldValue, data: FormData, required: boolean) => true | string;
  conditions?: (value: FieldValue, data: FormData) => boolean;
  disabled?: ((value: FieldValue, data: FormData) => boolean) | boolean;
  className?: string;
  default?: number | null;
  // allowHalfStar?: boolean;
  starEmpty?: () => HTMLElement;
  // starHalf?: string;
  starFull?: () => HTMLElement;
}

export class RatingField extends Field {
  public ratingStars: HTMLDivElement | null = null;
  private starsValueList: number[] = [1, 2, 3, 4, 5];
  private ratingIcons: HTMLSpanElement[] = [];

  public options: RatingFieldOptions = {
    id: '',
    type: 'rating',
    required: false,
    validation: (value, data, required) => {
      if (required && !value) return 'This field is required';
      return true;
    },
    className: 'form-rating',
    // allowHalfStar: false,
    starEmpty: () => {
      const span = document.createElement('span');
      span.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-star" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>  <path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z" /></svg>';
      return span;
    },
    // starHalf: '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-star-half-filled" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>  <path d="M12 1a.993 .993 0 0 1 .823 .443l.067 .116l2.852 5.781l6.38 .925c.741 .108 1.08 .94 .703 1.526l-.07 .095l-.078 .086l-4.624 4.499l1.09 6.355a1.001 1.001 0 0 1 -1.249 1.135l-.101 -.035l-.101 -.046l-5.693 -3l-5.706 3c-.105 .055 -.212 .09 -.32 .106l-.106 .01a1.003 1.003 0 0 1 -1.038 -1.06l.013 -.11l1.09 -6.355l-4.623 -4.5a1.001 1.001 0 0 1 .328 -1.647l.113 -.036l.114 -.023l6.379 -.925l2.853 -5.78a.968 .968 0 0 1 .904 -.56zm0 3.274v12.476a1 1 0 0 1 .239 .029l.115 .036l.112 .05l4.363 2.299l-.836 -4.873a1 1 0 0 1 .136 -.696l.07 -.099l.082 -.09l3.546 -3.453l-4.891 -.708a1 1 0 0 1 -.62 -.344l-.073 -.097l-.06 -.106l-2.183 -4.424z" stroke-width="0" fill="currentColor" /></svg>',
    starFull: () => {
      const span = document.createElement('span');
      span.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-star-filled" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>  <path d="M8.243 7.34l-6.38 .925l-.113 .023a1 1 0 0 0 -.44 1.684l4.622 4.499l-1.09 6.355l-.013 .11a1 1 0 0 0 1.464 .944l5.706 -3l5.693 3l.1 .046a1 1 0 0 0 1.352 -1.1l-1.091 -6.355l4.624 -4.5l.078 -.085a1 1 0 0 0 -.633 -1.62l-6.38 -.926l-2.852 -5.78a1 1 0 0 0 -1.794 0l-2.853 5.78z" stroke-width="0" fill="currentColor" /></svg>';
      return span;
    },
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

  private updateSelection() {
    this.ratingIcons.forEach((icon: HTMLSpanElement, i: number) => {
      if (i < Number(this.getValue())) {
        icon.classList.add('selected');
      } else {
        icon.classList.remove('selected');
      }
    });
  }

  private highlightStars(index: number) {
    this.ratingIcons.forEach((icon: HTMLSpanElement, i: number) => {
      if (i <= index) {
        icon.classList.add('highlight');
      } else {
        icon.classList.remove('highlight');
      }
    });
  }

  private stopHighlight() {
    this.ratingIcons.forEach((icon: HTMLSpanElement, i: number) => {
      icon.classList.remove('highlight');
    });
  }

  createRatingElements() {
    const element = document.createElement('div');
    element.className = 'rating-stars';
    this.starsValueList.forEach((value: number, index: number) => {
      // if(!Number.isInteger(value) && !this.options.allowHalfStar) return;
      const input = document.createElement('input');
      input.setAttribute('id', this.getId() + '_rating_' + String(value));
      input.setAttribute('name', this.options.name || this.getId());
      input.setAttribute('value', String(value));
      input.setAttribute('type', 'radio');
      input.addEventListener('change', (e: any) => {
        if (this.isDisabled()) return;
        this.change(e);
        this.updateSelection();
      });
      const label = document.createElement('label');
      const span = document.createElement('span');
      const spanEmpty = document.createElement('span');
      const spanFull = document.createElement('span');
      spanEmpty.className = 'empty';
      spanFull.className = 'full';
      if (this.options.starEmpty) spanEmpty.append(this.options.starEmpty());
      if (this.options.starFull) spanFull.append(this.options.starFull());
      mountElement(spanEmpty, span);
      mountElement(spanFull, span);
      label.setAttribute('for', this.getId() + '_rating_' + String(value));
      label.setAttribute('title', value + ' stars');
      label.addEventListener('mouseover', (e: any) => {
        if (this.isDisabled()) return;
        this.highlightStars(index);
      });
      label.addEventListener('mouseout', (e: any) => {
        this.stopHighlight();
      });
      mountElement(input, element);
      mountElement(span, label);
      mountElement(label, element);
      this.ratingIcons.push(span);
    });
    this.ratingStars = element;
  }

  getValue(): number | null {
    return this._value as number | null;
  }
}
