import QuillNamespace, { Quill as QuillEditor } from 'quill';
const Quill: any = QuillNamespace;
import { Form, Field, mountElement, FormData, FieldValue } from '@forms.js/core';

export class RitchtextField extends Field {
  public options: RitchtextFieldOptions = {
    id: '',
    type: 'ritchtext',
    required: false,
    validation: (value, data, required) => {
      if (required && !value) return 'This field is required';
      return true;
    },
    className: 'form-input-ritchtext',
    options: {
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],
          ['blockquote', 'code-block'],
          [{ header: 1 }, { header: 2 }],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ script: 'sub' }, { script: 'super' }],
          [{ indent: '-1' }, { indent: '+1' }],
          [{ size: ['small', false, 'large', 'huge'] }],
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ color: [] }, { background: [] }],
          [{ align: [] }],
          ['link', 'image', 'video'],
          ['clean'],
        ],
      },
      theme: 'snow',
    },
  };

  public editorElement: HTMLElement | null = null;
  public inputElement: HTMLInputElement | null = null;
  private _editor: QuillEditor | null = null;

  constructor(parent: HTMLElement, form: Form, options: RitchtextFieldOptions) {
    super(parent, form, options);
    this.initializeOptions(options);
    this.onGui();
    this.initialize();
  }

  async initialize(): Promise<void> {
    this.initEditor();
    this.load();
    this.update();
    this.bindChange();
  }

  getEditor() {
    return this._editor;
  }

  initEditor(): void {
    if (this.inputElement && this.editorElement)
      this._editor = new Quill(this.editorElement, {
        ...this.options.options!,
      });
  }

  bindChange() {
    if (!this._editor) return;
    this._editor.on('text-change', () => {
      if (this.inputElement && this._editor) {
        this.inputElement.value = this._editor.root.innerHTML;
        this.change(this._editor.root.innerHTML);
      }
    });
  }

  change(value: any): void {
    this.setValue(value);
    this.validate();
    if (this.options.change) this.options.change(this.getValue());
  }

  handleDisabled() {
    if (this.isDisabled()) {
      if (this._editor) this._editor.disable();
    } else {
      if (this._editor) this._editor.enable();
    }
  }

  createInputElement() {
    // Input element
    this.inputElement = document.createElement('input');
    this.inputElement.setAttribute('id', this.getId());
    this.inputElement.setAttribute('name', this.options.name || this.getId());
    this.inputElement.setAttribute('type', 'hidden');
  }

  createEditorElement() {
    this.editorElement = document.createElement('div');
    this.editorElement.setAttribute('id', this.getId() + '_editor');
    if (this.options.default) this.editorElement.innerHTML = String(this.options.default);
    this.editorElement.className = this.options.className!;
  }

  onGui() {
    this.createContainerElement();
    this.createInputElement();
    this.createLabelElement();
    this.createValidationElement();
    this.createEditorElement();
    // Append elements
    if (this.inputElement && this.labelElement) mountElement(this.inputElement, this.labelElement);
    if (this.editorElement && this.labelElement) mountElement(this.editorElement, this.labelElement);
    if (this.labelElement && this.validationElement) mountElement(this.validationElement, this.labelElement);
    if (this.containerElement && this.labelElement) mountElement(this.labelElement, this.containerElement);
  }

  syncValue() {
    if (!this._editor) return;
    const value = this.getValue();
    if (value && JSON.stringify(this._editor.root.innerHTML) !== JSON.stringify(value)) {
      // @ts-expect-error converting from clipboard does not respect the type
      const delta = this._editor.clipboard.convert(value);
      const hasFocus = this._editor.hasFocus();
      this._editor.updateContents(delta, 'silent');
      if (hasFocus) this._editor.focus();
    }
  }

  /** Load the fields value from local stroage. */
  load(): void {
    if (this.getForm().savesProgress() && this.getForm().hasValidLicense()) {
      const value: string | null = localStorage.getItem(this.getSaveKey());
      if (value) {
        const parsed = JSON.parse(value);
        this.setValue(parsed, false);
        // this.preloadValueToEditor(parsed);
        return;
      }
    }
    this.setValue(this.options.default || '', false);
    // this.preloadValueToEditor(this.options.default || '');
  }

  /** Resets the field to its initial state. */
  async reset(): Promise<void> {
    localStorage.removeItem(this.getSaveKey());
    this.setValue(this.options.default || '', false);
    // this.preloadValueToEditor(this.options.default || '');
    this.update();
  }

  getValue(): string | null {
    return this._value as string | null;
  }
}

export interface RitchtextFieldOptions {
  id: string;
  name?: string;
  label?: string;
  type: 'ritchtext';
  required?: ((value: FieldValue, data: FormData) => boolean) | boolean;
  change?: (value: FieldValue) => void;
  validation?: (value: FieldValue, data: FormData, required: boolean) => true | string;
  conditions?: (value: FieldValue, data: FormData) => boolean;
  disabled?: ((value: FieldValue, data: FormData) => boolean) | boolean;
  className?: string;
  default?: string | null;
  options?: object;
}
