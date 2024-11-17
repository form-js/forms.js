import { Field } from './Field';
import { FieldConfig, FlowAction, FormFlowConfig, FormFlowRule } from './types/interfaces';
import { FlowActionTypes } from './utils/enums';

export class FlowManager {
  private rules: FormFlowRule[] = [];

  constructor(
    private fields: Record<string, Field<any, FieldConfig<any>>>,
    private config: FormFlowConfig,
  ) {
    this.rules = config.rules;
  }

  initialize() {
    // Subscribe to field changes based on flow triggers
    this.rules.forEach((rule) => this.setupRule(rule));
  }

  private setupRule(rule: FormFlowRule) {
    const triggerFields = rule.triggers || Object.keys(this.fields);

    triggerFields.forEach((fieldId) => {
      this.fields[fieldId].value.subscribe(() => this.evaluateRule(rule));
    });
  }

  private evaluateRule(rule: FormFlowRule) {
    const { condition, actions } = rule;

    if (condition(this.fields)) {
      this.executeActions(actions);
    }
  }

  private executeActions(actions: FlowAction[]) {
    actions.forEach((action) => {
      const targetField = this.fields[action.targetField];
      if (!targetField) return;

      switch (action.type) {
        case FlowActionTypes.SetValue:
          targetField.setValue(action.payload);
          break;
        case FlowActionTypes.SetRequired:
          targetField.setRequired(action.payload);
          break;
        case FlowActionTypes.SetDisabled:
          targetField.setDisabled(action.payload);
          break;
        case FlowActionTypes.SetVisible:
          targetField.setVisible(action.payload);
          break;
        case FlowActionTypes.ClearValue:
          targetField.setValue(null);
          break;
      }
    });
  }

  // Dynamically add a rule
  addRule(rule: FormFlowRule) {
    this.rules.push(rule);
    this.setupRule(rule);
  }

  // Dynamically remove a rule by a unique ID
  removeRule(ruleId: string) {
    this.rules = this.rules.filter((rule) => rule.id !== ruleId);
  }
}
