import { mountElement } from '../utils/utils';
import { ClassList, FieldTypes } from '../utils/enums';
import { Renderer } from '../types/types';
import { NumberFieldConfig } from '../types/interfaces';

export const RenderNumberField: Renderer<string, NumberFieldConfig> = (
  container,
  field, // Field is generic, with T being the value type of the field
): HTMLElement => {
  // Create field container
  const wrapper = document.createElement('div');
  wrapper.className = ClassList.FieldContainer;

  // Create and configure the label
  const label = document.createElement('label');
  label.className = ClassList.FieldLabel;

  const labelSpan = document.createElement('span');
  labelSpan.innerText = field.label ?? '';

  const requiredSpan = document.createElement('span');
  requiredSpan.innerText = '*';
  requiredSpan.className = ClassList.FieldRequiredSymbol;

  // Create and configure the input
  const input = document.createElement('input');
  input.type = FieldTypes.Number;
  input.className = ClassList.FieldInput;
  input.name = field.name;

  // Sync the initial value
  field.value.subscribe((value) => (input.value = value != null ? String(value) : ''));
  input.oninput = (e) => field.setValue((e.target as HTMLInputElement).value);
  if (field.config.step != null) input.step = String(field.config.step);
  if (field.config.min != null) input.min = String(field.config.min);
  if (field.config.max != null) input.max = String(field.config.max);

  // Create error container
  const errorContainer = document.createElement('div');
  errorContainer.className = ClassList.FieldValidation;

  // Subscribe to field observables
  field.errors.subscribe((errors) => {
    wrapper.classList.toggle(ClassList.Error, errors.length > 0);
    errorContainer.innerHTML = ''; // Clear previous errors
    errors.forEach((error) => {
      const errorElement = document.createElement('div');
      errorElement.innerText = error;
      errorContainer.appendChild(errorElement);
    });
  });

  field.disabled.subscribe((disabled) => {
    input.disabled = disabled;
    wrapper.classList.toggle(ClassList.FieldDisabled, disabled);
  });

  field.required.subscribe((required) => {
    input.required = required;
    requiredSpan.style.display = required ? 'inline-block' : 'none';
    wrapper.classList.toggle(ClassList.FieldRequired, required);
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

