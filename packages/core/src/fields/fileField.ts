import * as FilePond from 'filepond';
import { Field } from '../field.js';
import { Form } from '../form.js';
import { FileFieldOptions } from '../interfaces.js';
import { HTMLElementEvent } from '../types.js';
import { debounce } from '../utils.js';

export class FileField extends Field {
  public options: FileFieldOptions = {
    id: '',
    type: 'file',
    required: false,
    validation: (value, data, required) => {
      if (required && !value) return 'This field is required';
      return true;
    },
    className: 'form-input',
    enhance: true,
    multiple: false,
    debounce: 50,
    options: {
      storeAsFile: true,
      instantUpload: false,
      allowProcess: false,
    },
  };

  private _filepond: any;

  constructor(parent: HTMLElement, form: Form, options: FileFieldOptions) {
    super(parent, form, options);
    this.initializeOptions(options);
    this.onGui();
    this.initialize();
  }

  async initialize(): Promise<void> {
    this.load();
    this.update();
    this.initFilepond();
    this.bindChange();
  }

  /**
   * Synchronizes fields value with input element
   */
  syncValue(): void {}

  createInputElement() {
    // Input element
    this.inputElement = document.createElement('input');
    this.inputElement.setAttribute('id', this.getId());
    this.inputElement.setAttribute('name', this.options.name || this.getId());
    this.inputElement.setAttribute('type', this.getType());
    this.inputElement.className = this.options.className!;
    if (this.options.multiple && !this.options.enhance) this.inputElement.setAttribute('multiple', 'true');
    if (this.options.accept) this.inputElement.setAttribute('accept', this.options.accept);
  }

  getFilepond() {
    return this._filepond;
  }

  initFilepond(): void {
    if (this.inputElement && this.options.enhance)
      this._filepond = FilePond.create(this.inputElement, this.options.options || {});
  }

  bindChange() {
    if (this.options.enhance) {
      this._filepond.on('addfile', (error: any, file: any) => {
        if (error) return;
        const files = this._filepond.getFile();
        this.change(files);
      });
      this._filepond.on('removefile', (error: any, file: any) => {
        if (error) return;
        const files = this._filepond.getFile();
        this.change(files);
      });
      this._filepond.on('updatefiles', (error: any, file: any) => {
        if (error) return;
        const files = this._filepond.getFile();
        this.change(files);
      });
    } else {
      this.inputElement?.addEventListener('change', debounce(this.coreChange, this.options.debounce!, this));
    }
  }

  change(files: any): void {
    this.setValue(files);
    if (this.options.change) this.options.change(this.getValue());
    this.validate();
  }

  coreChange(event: any): void {
    if (event.target.files) this.change(event.target.files);
  }
}
