import { Field } from '../field';
import { Form } from '../form';
import { FieldOptions } from '../interfaces';

export class TextField extends Field {
  constructor(parent: HTMLElement, form: Form, options: FieldOptions) {
    super(parent, form, options);
    this.initializeOptions(options);
    this.onGui();
    this.initialize();
  }

  getValue(): string | null {
    return this._value as string | null;
  }
}
