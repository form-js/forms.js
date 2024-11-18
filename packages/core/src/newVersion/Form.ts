import { combineLatest, debounceTime, map, Observable } from 'rxjs';
import { Field } from './Field';
import { mountElement } from './utils/utils';
import { ClassList } from './utils/enums';
import { FormConfig, FlowRule, FlowConfig } from './types';
import { FlowManager } from './FlowManager';
import { objectToFormData } from '../utils';

const defaultFormConfig: FormConfig = {
  autorender: false,
};

export class Form<TFields extends Record<string, any>> {
  private fields: Record<keyof TFields, Field<any, any>>;
  private config: FormConfig;
  private flowManager?: FlowManager;

  constructor(
    fieldsConfig: { [K in keyof TFields]: Field<TFields[K], any> },
    formConfig?: FormConfig,
    flowConfig?: FlowConfig,
  ) {
    this.fields = fieldsConfig;
    this.config = formConfig ?? defaultFormConfig;

    if (this.config.autorender) {
      this.render();
    }

    if (flowConfig) {
      this.flowManager = new FlowManager(this.fields, flowConfig);
      this.flowManager.initialize();
    }
  }

  render(container?: HTMLElement) {
    if (container) {
      const formElement = document.createElement('div');
      formElement.className = ClassList.Form;

      Object.values(this.fields).forEach((field) => field.render(formElement));
      mountElement(formElement, container);
      return;
    }
    Object.values(this.fields).forEach((field) => field.render());
  }

  setFieldValue<K extends keyof TFields>(fieldName: K, value: TFields[K]) {
    const field = this.fields[fieldName];
    if (!field) throw new Error(`Field "${String(fieldName)}" does not exist.`);
    field.setValue(value);
  }

  setFieldDisabled<K extends keyof TFields>(fieldName: K, disabled: boolean) {
    const field = this.fields[fieldName];
    if (!field) throw new Error(`Field "${String(fieldName)}" does not exist.`);
    field.setDisabled(disabled);
  }

  setFieldRequired<K extends keyof TFields>(fieldName: K, required: boolean) {
    const field = this.fields[fieldName];
    if (!field) throw new Error(`Field "${String(fieldName)}" does not exist.`);
    field.setRequired(required);
  }

  setFieldVisible<K extends keyof TFields>(fieldName: K, visible: boolean) {
    const field = this.fields[fieldName];
    if (!field) throw new Error(`Field "${String(fieldName)}" does not exist.`);
    field.setVisible(visible);
  }

  getField<K extends keyof TFields>(fieldName: K): Field<TFields[K], any> | undefined {
    return this.fields[fieldName];
  }

  addFlowRule(rule: FlowRule) {
    if (!this.flowManager) throw new Error('FlowManager is not initialized.');
    this.flowManager.addRule(rule);
  }

  removeFlowRule(ruleId: string) {
    if (!this.flowManager) throw new Error('FlowManager is not initialized.');
    this.flowManager.removeRule(ruleId);
  }

  // Synchronous getter for form values
  data(): TFields {
    return Object.keys(this.fields).reduce((acc, key) => {
      const fieldKey = key as keyof TFields;
      acc[fieldKey] = this.fields[fieldKey].getValue(); // Explicitly cast
      return acc;
    }, {} as TFields);
  }

  // Synchronous getter for form errors
  errors(): Record<keyof TFields, string[]> {
    return Object.keys(this.fields).reduce(
      (acc, key) => {
        const fieldKey = key as keyof TFields;
        acc[fieldKey] = this.fields[fieldKey].getErrors(); // Explicitly cast
        return acc;
      },
      {} as Record<keyof TFields, string[]>,
    );
  }

  formData() {
    return objectToFormData(this.data());
  }

  // Debounced observer for form changes
  watchData(debounceTimeMs: number, callback: (values: TFields) => void) {
    const formValues$ = combineLatest(
      Object.entries(this.fields).map(([key, field]) => field.value.pipe(map((value) => ({ [key]: value })))),
    ).pipe(map((fieldValues) => Object.assign({}, ...fieldValues) as TFields));

    formValues$.pipe(debounceTime(debounceTimeMs)).subscribe(callback);
  }

  // Load a set of values into the form
  load(values: Partial<TFields>) {
    Object.entries(values).forEach(([key, value]) => {
      if (this.fields[key]) {
        this.fields[key].setValue(value);
      }
    });
  }

  reset() {
    Object.values(this.fields).forEach((field) => field.reset());
  }

  validate() {
    Object.values(this.fields).forEach((field) => field.validate());
  }

  trackFormProgress(): {
    correctlyFilledFields: number;
    correctlyFilledRequiredFields: number;
    totalRequiredFields: number;
    totalFields: number;
  } {
    let correctlyFilledFields = 0;
    let correctlyFilledRequiredFields = 0;
    let totalRequiredFields = 0;
    const totalFields = Object.keys(this.fields).length;

    Object.values(this.fields).forEach((field) => {
      const isValid = field.isValid();
      const isRequired = field.isRequired();

      if (isValid) {
        correctlyFilledFields++;
        if (isRequired) correctlyFilledRequiredFields++;
      }

      if (isRequired) {
        totalRequiredFields++;
      }
    });

    return {
      correctlyFilledFields,
      correctlyFilledRequiredFields,
      totalRequiredFields,
      totalFields,
    };
  }
}
