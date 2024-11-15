import { mountElement } from '../utils/utils';
import { Field } from '../Field';
import { BaseInputTypes, ClassList } from '../utils/enums';

export function renderInputField(container: HTMLElement, field: Field, type: BaseInputTypes) {
  const wrapper = document.createElement('div');
  wrapper.className = ClassList.FieldContainer;
  const label = document.createElement('label');
  const labelSpan = document.createElement('span');
  const requiredSpan = document.createElement('span');
  requiredSpan.innerText = '*';
  requiredSpan.className = ClassList.FieldRequiredSymbol;
  labelSpan.innerText = field.label ?? '';
  label.className = ClassList.FieldLabel;

  const input = document.createElement('input');
  input.type = type;
  input.value = String(field.value) || '';
  input.oninput = (e) => field.setValue((e.target as HTMLInputElement).value);
  input.className = ClassList.FieldInput;
  input.name = field.name ? field.name : field.id;

  const errorContainer = document.createElement('div');

  // Subscribe to value and errors observables
  field.value.subscribe((value) => (input.value = value || ''));
  field.errors.subscribe((errors) => {
    if (errors.length > 0) {
      wrapper.classList.add(ClassList.Error);
    } else {
      wrapper.classList.remove(ClassList.Error);
    }
    errorContainer.innerHTML = ''; // Clear previous errors
    errorContainer.className = ClassList.FieldValidation;
    errors.forEach((error) => {
      const errorElement = document.createElement('div');
      errorElement.innerText = error;
      errorContainer.appendChild(errorElement);
    });
  });

  field.disabled.subscribe((value) => {
    input.disabled = value;
    if (value) {
      wrapper.classList.add(ClassList.FieldDisabled);
    } else {
      wrapper.classList.remove(ClassList.FieldDisabled);
    }
  });

  field.required.subscribe((value) => {
    input.required = value;
    if (value) {
      wrapper.classList.add(ClassList.FieldRequired);
      requiredSpan.style.display = 'inline-block';
    } else {
      wrapper.classList.remove(ClassList.FieldRequired);
      requiredSpan.style.display = 'none';
    }
  });

  // Append to container
  mountElement(labelSpan, label);
  mountElement(requiredSpan, label);
  mountElement(label, wrapper);
  mountElement(input, wrapper);
  mountElement(errorContainer, wrapper);
  mountElement(wrapper, container);

  return container;
}
