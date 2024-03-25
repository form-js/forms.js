import { FilePond, create as createFilepond, FilePondFile } from 'filepond';
import { Field } from '../field';
import { Form } from '../form';
import { FileFieldOptions } from '../interfaces';
import { debounce, getOverwritenDefaults } from '../utils';
import { HTMLElementEvent } from '../types';
import {
  ACCEPT_ATTRIBUTE,
  CHANGE_ATTRIBUTE,
  DEFAULT_REQUIRED_VALIDATION_MESSAGE,
  FIELD_TYPE_FILE,
  ID_ATTRIBUTE,
  INPUT_CLASS_DEFAULT,
  INPUT_ELEMENT,
  MULTIPLE_ATTRIBUTE,
  NAME_ATTRIBUTE,
  PLACEHOLDER_ATTRIBUTE,
  TYPE_ATTRIBUTE,
} from '../constants';

export class FileField extends Field {
  public options: FileFieldOptions = {
    id: '',
    type: FIELD_TYPE_FILE,
    required: false,
    validation: (value, data, required) => {
      if (required && !value) return DEFAULT_REQUIRED_VALIDATION_MESSAGE;
      return true;
    },
    className: INPUT_CLASS_DEFAULT,
    enhance: true,
    multiple: false,
    debounce: 50,
    options: {
      storeAsFile: true,
      instantUpload: false,
      allowProcess: false,
    },
  };

  private _filepond: FilePond | null = null;

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
   * Merge default options with provided options.
   */
  initializeOptions(options: FileFieldOptions): void {
    this.options = Object.assign(
      {},
      {
        ...this.options,
        ...{
          options: { allowMultiple: options.multiple },
        },
      },
      getOverwritenDefaults(this.options.type, options),
    );
  }

  /**
   * Synchronizes fields value with input element
   */
  syncValue(): void {
    // no way to sync files yet
  }

  createInputElement() {
    // Input element
    this.inputElement = document.createElement(INPUT_ELEMENT);
    this.inputElement.setAttribute(ID_ATTRIBUTE, this.getId());
    this.inputElement.setAttribute(NAME_ATTRIBUTE, this.options.name || this.getId());
    this.inputElement.setAttribute(TYPE_ATTRIBUTE, this.getType());
    if (this.options.placeholder) this.inputElement.setAttribute(PLACEHOLDER_ATTRIBUTE, this.options.placeholder);
    this.inputElement.className = this.options.className!;
    if (this.options.multiple && !this.options.enhance) this.inputElement.setAttribute(MULTIPLE_ATTRIBUTE, 'true');
    if (this.options.accept) this.inputElement.setAttribute(ACCEPT_ATTRIBUTE, this.options.accept);
  }

  getFilepond() {
    return this._filepond;
  }

  initFilepond(): void {
    if (this.inputElement && this.options.enhance) {
      this._filepond = createFilepond(this.inputElement, this.options.options || {});
    }
  }

  bindChange() {
    if (this.options.enhance) {
      if (!this._filepond) return;
      this._filepond.on('addfile', (error: any, file: FilePondFile) => {
        if (error) return;
        const files: FilePondFile[] = this._filepond!.getFiles();
        this.filePondChange(files);
      });
      this._filepond.on('removefile', (error: any, file: FilePondFile) => {
        if (error) return;
        const files: FilePondFile[] = this._filepond!.getFiles();
        this.filePondChange(files);
      });
      this._filepond.on('updatefiles', (error: any, file: FilePondFile) => {
        if (error) return;
        const files: FilePondFile[] = this._filepond!.getFiles();
        this.filePondChange(files);
      });
    } else {
      this.inputElement?.addEventListener(CHANGE_ATTRIBUTE, debounce(this.change, this.options.debounce!, this));
    }
  }

  filePondChange(files: FilePondFile[]): void {
    this.changeValue(files);
  }

  change(event: HTMLElementEvent<HTMLInputElement> & { files: FileList }): void {
    if (event.target?.files) {
      this.changeValue(event.target.files);
    }
  }

  changeValue(value: FilePondFile[] | FileList): void {
    this.setValue(value);
    this.validate();
    this.handleValidatedField();
    if (this.options.change) this.options.change(this._value);
  }

  getValue(): FileList | FilePondFile[] | null {
    return this._value as FileList | FilePondFile[] | null;
  }
}
