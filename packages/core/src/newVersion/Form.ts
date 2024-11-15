import { combineLatest, map, Observable } from 'rxjs';
import { Field } from './Field';
import { mountElement } from '../utils';
import { ClassList } from './utils/enums';

export class Form<TFields extends Record<string, any>> {
  private fields: Record<keyof TFields, Field<any>>;

  constructor(fieldsConfig: { [K in keyof TFields]: Field<TFields[K]> }) {
    this.fields = fieldsConfig;
  }

  // Render the form and its fields into the container
  render(container: HTMLElement) {
    const formElement = document.createElement('form');
    formElement.className = ClassList.Form;

    Object.values(this.fields).forEach((field) => {
      field.render(formElement);
    });

    mountElement(formElement, container);
  }

  // Get all field values as an observable object
  get formValues$(): Observable<TFields> {
    const fieldObservables = Object.entries(this.fields).map(([key, field]) =>
      field.value.pipe(map((value) => ({ [key]: value }))),
    );

    return combineLatest(fieldObservables).pipe(
      map((fieldEntries) => Object.assign({}, ...fieldEntries) as TFields),
    );
  }

  // Validate all fields and return their errors as an observable object
  get formErrors$(): Observable<Record<keyof TFields, string[]>> {
    const errorObservables = Object.entries(this.fields).map(([key, field]) =>
      field.errors.pipe(map((errors) => ({ [key]: errors }))),
    );

    return combineLatest(errorObservables).pipe(
      map((errorEntries) => Object.assign({}, ...errorEntries) as Record<keyof TFields, string[]>),
    );
  }

  // Set a value for a specific field programmatically
  setFieldValue<K extends keyof TFields>(fieldName: K, value: TFields[K]) {
    const field = this.fields[fieldName];
    if (!field) {
      throw new Error(`Field "${String(fieldName)}" does not exist.`);
    }
    field.setValue(value);
  }

  // Enable or disable a specific field
  setFieldDisabled<K extends keyof TFields>(fieldName: K, disabled: boolean) {
    const field = this.fields[fieldName];
    if (!field) {
      throw new Error(`Field "${String(fieldName)}" does not exist.`);
    }
    field.setDisabled(disabled);
  }

  // Get a reference to a specific field
  getField<K extends keyof TFields>(fieldName: K): Field<TFields[K]> | undefined {
    return this.fields[fieldName];
  }

  // Submit the form data (can be extended for async submission)
  submit(onSubmit: (values: TFields) => void) {
    this.formValues$.subscribe(onSubmit);
  }
}