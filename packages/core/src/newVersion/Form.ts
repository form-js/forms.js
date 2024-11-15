import { combineLatest, map, Observable } from 'rxjs';
import { Field } from './Field';
import { mountElement } from '../utils';
import { ClassList } from './utils/enums';

export class Form {
  private fields: Record<string, Field>;

  constructor(fieldsConfig: Record<string, Field>) {
    this.fields = fieldsConfig;
  }

  render(container: HTMLElement) {
    Object.values(this.fields).forEach((field) => {
      const formElement = document.createElement('form');
      formElement.className = ClassList.Form;
      field.render(formElement);
      mountElement(formElement, container);
    });
  }

  // Aggregate all field values into a single observable
  get formValues$(): Observable<Record<string, any>> {
    const fieldObservables = Object.entries(this.fields).map(([key, field]) =>
      field.value.pipe(map((value) => ({ [key]: value }))),
    );

    return combineLatest(fieldObservables).pipe(map((fieldEntries) => Object.assign({}, ...fieldEntries)));
  }
}
