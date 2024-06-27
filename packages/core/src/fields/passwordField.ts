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
      this.addPeekButton();
    }
  }

  /** Add a button to show/hide password */
  private addPeekButton() {
    const button = document.createElement('button');
    const input = this.inputElement as HTMLInputElement;

    // Place the input and button into a container element
    const container = document.createElement('div');
    container.classList.add('password-container');
    input.insertAdjacentElement('afterend', container);
    container.append(input, button);

    // Initially, the password is hidden
    let isHidden = true;
    hide();

    // Toggle password visibility when the button is clicked
    button.addEventListener('click', event => {
      event.preventDefault();
      if (isHidden) {
        show();
      } else {
        hide();
      }
    });

    function hide() {
      button.classList.add('pass-hidden');
      button.classList.remove('pass-shown');
      button.ariaLabel = 'show password';
      input.type = 'password';
      isHidden = true;
    }

    function show() {
      button.classList.add('pass-shown');
      button.classList.remove('pass-hidden');
      button.ariaLabel = 'hide password';
      input.type = 'text';
      isHidden = false;
    }
  }

  getValue(): string | null {
    return this._value as string | null;
  }
}
