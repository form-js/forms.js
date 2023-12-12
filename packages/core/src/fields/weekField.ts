import * as flatpickerNamespace from 'flatpickr';
const flatpickr = (flatpickerNamespace as any).default;
import { Field } from '../field.js';
import { Form } from '../form.js';
import { DateFieldOptions } from '../interfaces.js';
import weekSelectPlugin from 'flatpickr/dist/plugins/weekSelect/weekSelect.js';

export class WeekField extends Field {
  public options: DateFieldOptions = {
    id: '',
    type: 'week',
    required: false,
    validation: (value, data, required) => {
      if (required && !value) return 'This field is required';
      return true;
    },
    className: 'form-input',
    enhance: true,
    options: {
      altInput: true,
      plugins: [weekSelectPlugin()],
    },
  };

  private _flatpickr: any;

  constructor(parent: HTMLElement, form: Form, options: DateFieldOptions) {
    super(parent, form, options);
    this.initializeOptions(options);
    this.onGui();
    this.initialize();
  }

  async initialize(): Promise<void> {
    this.load();
    this.update();
    this.initFlatpickr();
    this.bindChange();
  }

  getFlatpickr() {
    return this._flatpickr;
  }

  initFlatpickr(): void {
    if (this.inputElement && this.options.enhance)
      this._flatpickr = flatpickr(this.inputElement, this.options.options || {});
  }

  bindChange() {
    if (this.inputElement)
      this.inputElement.addEventListener('change', (event: any) => {
        this.change(event);
      });
  }

  createInputElement() {
    // Input element
    this.inputElement = document.createElement('input');
    this.inputElement.setAttribute('id', this.getId());
    this.inputElement.setAttribute('name', this.options.name || this.getId());
    this.inputElement.setAttribute('type', this.options.enhance ? 'text' : 'week');
    this.inputElement.className = this.options.className!;
    if (this.options.placeholder) this.inputElement.setAttribute('placeholder', this.options.placeholder);
  }
}
