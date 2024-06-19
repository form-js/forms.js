import { DEFAULT_REQUIRED_VALIDATION_MESSAGE, FIELD_TYPE_PASSWORD, INPUT_CLASS_DEFAULT } from '../constants';
import { Field } from '../field';
import { Form } from '../form';
import { PasswordFieldOptions } from '../interfaces';

export class PasswordField extends Field {
  public options: PasswordFieldOptions = {
    id: '',
    type: FIELD_TYPE_PASSWORD,
    required: false,
    validation: (value, data, required) => {
      if (required && !value) return DEFAULT_REQUIRED_VALIDATION_MESSAGE;
      return true;
    },
    default: '',
    className: INPUT_CLASS_DEFAULT,
    allowPeek: false,
  };

  constructor(parent: HTMLElement, form: Form, options: PasswordFieldOptions) {
    super(parent, form, options);
    this.initializeOptions(options);
    this.onGui();
    this.initialize();

    if (options.allowPeek) {
      this.addPeekButton(parent);
    }
  }

  /** add a button to show password */
  private addPeekButton(parent: HTMLElement) {
    const button = document.createElement('button');
    const input = parent.querySelector('input')!;
    let isHidden = true;

    hide();

    button.addEventListener('click', event => {
      event.preventDefault();
      if (isHidden) {
        show();
      } else {
        hide();
      }
    });

    parent.appendChild(button);

    function hide() {
      button.classList.add('pwd-hidden');
      button.classList.remove('pwd-shown');
      button.ariaLabel = 'show password';
      input.type = 'password';
      isHidden = true;
    }

    function show() {
      button.classList.add('pwd-shown');
      button.classList.remove('pwd-hidden');
      button.ariaLabel = 'hide password';
      input.type = 'text';
      isHidden = false;
    }
  }

  getValue(): string | null {
    return this._value as string | null;
  }
}
