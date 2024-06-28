import {
  BUTTON_ELEMENT,
  CLICK_ATTRIBUTE,
  DEFAULT_REQUIRED_VALIDATION_MESSAGE,
  DIV_ELEMENT,
  FIELD_CONTAINER_PASSWORD_CLASS,
  FIELD_TYPE_PASSWORD,
  FIELD_TYPE_TEXT,
  INPUT_CLASS_DEFAULT,
  PASSWORD_HIDDEN_CLASS,
  PASSWORD_SHOWN_CLASS,
} from '../constants';
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

    if (this.options.allowPeek) {
      this.addPeekButton();
    }
  }

  /** Add a button to show/hide password */
  private addPeekButton() {
    const button = document.createElement(BUTTON_ELEMENT);
    const input = this.inputElement as HTMLInputElement;

    // Place the input and button into a container element
    const container = document.createElement(DIV_ELEMENT);
    container.classList.add(FIELD_CONTAINER_PASSWORD_CLASS);
    input.insertAdjacentElement('afterend', container);
    container.append(input, button);

    // Initially, the password is hidden
    let isHidden = true;
    hide();

    // Toggle password visibility when the button is clicked
    button.addEventListener(CLICK_ATTRIBUTE, (event) => {
      event.preventDefault();
      if (isHidden) {
        show();
      } else {
        hide();
      }
    });

    function hide() {
      button.classList.add(PASSWORD_HIDDEN_CLASS);
      button.classList.remove(PASSWORD_SHOWN_CLASS);
      button.ariaLabel = 'show password';
      input.type = FIELD_TYPE_PASSWORD;
      isHidden = true;
    }

    function show() {
      button.classList.add(PASSWORD_SHOWN_CLASS);
      button.classList.remove(PASSWORD_HIDDEN_CLASS);
      button.ariaLabel = 'hide password';
      input.type = FIELD_TYPE_TEXT;
      isHidden = false;
    }
  }

  getValue(): string | null {
    return this._value as string | null;
  }
}
