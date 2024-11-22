import { combineLatest, debounceTime, map } from 'rxjs';
import { Field } from './Field';
import { FormConfig, FlowRule } from './types';
import { FlowManager } from './FlowManager';
import { objectToFormData } from '../utils';
import { Group } from './Group';

const defaultFormConfig: FormConfig = {
  autorender: false,
};

export class Form<TFields extends Record<string, any>> {
  private fields: Record<keyof TFields, Field<any, any>>;
  private groups: Record<string, Group<any>> = {};
  private config: FormConfig;
  private flowManager?: FlowManager;

  constructor(
    fieldsConfig: { [K in keyof TFields]: Field<TFields[K], any> },
    groupConfig?: Record<string, Group<any>>,
    formConfig?: FormConfig,
  ) {
    this.fields = fieldsConfig;
    this.config = formConfig ?? defaultFormConfig;
    this.groups = groupConfig || {};

    if (this.config.autorender) {
      this.render();
    }

    if (this.config.flow) {
      this.flowManager = new FlowManager(this.fields, this.config.flow);
      this.flowManager.initialize();
    }
  }

  render() {
    Object.values(this.fields).forEach((field) => field.render());
    Object.values(this.groups).forEach((group) => group.render());
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

  getGroup(groupName: string): Group<TFields> | undefined {
    return this.groups[groupName];
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
    const formData: Record<string, any> = {};

    // Collect data from individual fields
    Object.entries(this.fields).forEach(([key, field]) => {
      formData[key] = field.getValue();
    });

    // Collect data from groups with prefixes
    Object.entries(this.groups).forEach(([key, group]) => {
      const groupData = group.data();
      Object.assign(formData, groupData);
    });

    return formData as TFields;
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
    const fieldObservables = Object.entries(this.fields).map(([key, field]) =>
      field.value.pipe(map((value) => ({ [key]: value }))),
    );

    const groupObservables = Object.entries(this.groups).map(([key, group]) =>
      group.watchDataAsObservable().pipe(map((values) => values)),
    );

    combineLatest([...fieldObservables, ...groupObservables])
      .pipe(
        debounceTime(debounceTimeMs),
        map((fieldValues) => Object.assign({}, ...fieldValues)),
      )
      .subscribe(callback);
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

  progress(): {
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
