import { mountElement } from '../utils/utils';
import { AriaAttributes, ClassList, FieldTypes } from '../utils/enums';
import { PasswordFieldConfig, Renderer } from '../types';

export const RenderPasswordField: Renderer<string, PasswordFieldConfig> = (
  container,
  field,
  type = FieldTypes.Text,
): HTMLElement => {
  // Create field container
  const wrapper = document.createElement('div');
  wrapper.className = `${ClassList.FieldContainer} ${type}`;

  // Create and configure the label
  const label = document.createElement('label');
  label.className = ClassList.FieldLabel;
  label.htmlFor = field.id; // Associate label with input

  const labelSpan = document.createElement('span');
  labelSpan.innerText = field.label ?? '';

  const requiredSpan = document.createElement('span');
  requiredSpan.innerText = '*';
  requiredSpan.className = ClassList.FieldRequiredSymbol;

  // Create and configure the input
  const input = document.createElement('input');
  input.type = type;
  input.className = ClassList.FieldInput;
  input.name = field.name;
  input.id = field.id; // Unique ID for label association

  // Sync the initial value
  field.value.subscribe((value) => {
    if (field.config.mask && value != null) {
      const { formatted } = field.config.mask(input.value);
      input.value = String(formatted);
    } else {
      input.value = value != null ? String(value) : '';
    }
  });

  input.oninput = (e) => field.setValue((e.target as HTMLInputElement).value);
  if (field.config.placeholder != null) input.placeholder = field.config.placeholder;

  //TODO Peek functionality

  // Error container
  const errorContainer = document.createElement('div');
  errorContainer.className = ClassList.FieldValidation;
  errorContainer.id = `${field.id}-errors`;

  // ARIA attributes for input
  field.required.subscribe((required) => {
    input.required = required;
    input.setAttribute(AriaAttributes.Required, String(required));
    requiredSpan.style.display = required ? 'inline-block' : 'none';
    wrapper.classList.toggle(ClassList.FieldRequired, required);
  });

  field.errors.subscribe((errors) => {
    const hasErrors = errors.length > 0;
    input.setAttribute(AriaAttributes.Invalid, String(hasErrors));
    wrapper.classList.toggle(ClassList.Error, hasErrors);

    // Update error messages
    errorContainer.innerHTML = ''; // Clear previous errors
    if (hasErrors) {
      errors.forEach((error) => {
        const errorElement = document.createElement('div');
        errorElement.innerText = error;
        errorContainer.appendChild(errorElement);
      });
      input.setAttribute(AriaAttributes.DescribedBy, `${field.id}-errors`);
    } else {
      input.removeAttribute(AriaAttributes.DescribedBy);
    }
  });

  // Handle disabled state
  field.disabled.subscribe((disabled) => {
    input.disabled = disabled;
    input.setAttribute(AriaAttributes.Disabled, String(disabled));
    wrapper.classList.toggle(ClassList.FieldDisabled, disabled);
  });

  // Handle visibility
  field.visible.subscribe((visible) => {
    if (visible) {
      wrapper.style.display = 'block';
      wrapper.removeAttribute(AriaAttributes.Hidden);
    } else {
      wrapper.style.display = 'none';
      wrapper.setAttribute(AriaAttributes.Hidden, 'true');
    }
  });

  // Append elements to the DOM
  mountElement(labelSpan, label);
  mountElement(requiredSpan, label);
  mountElement(label, wrapper);
  mountElement(input, wrapper);
  mountElement(errorContainer, wrapper);
  mountElement(wrapper, container);

  return container;
};
