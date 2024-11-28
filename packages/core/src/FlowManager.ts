import { Field } from './Field';
import { FlowAction, FlowRule, FlowConfig, FieldConfig } from './types';
import { FlowActionTypes } from './utils/enums';

export class FlowManager {
  private rules: FlowRule[] = [];

  constructor(
    private fields: Record<string, Field<any, FieldConfig<any>>>,
    private config: FlowConfig,
  ) {
    this.rules = config;
  }

  initialize() {
    this.rules.forEach((rule) => this.setupRule(rule));
  }

  private setupRule(rule: FlowRule) {
    const triggerFields = rule.triggers || Object.keys(this.fields);

    triggerFields.forEach((fieldId) => {
      const field = this.fields[fieldId];
      if (!field) return;

      field.value.subscribe(() => {
        try {
          const conditionMet = rule.condition(this.fields);
          if (conditionMet) {
            this.executeActions(rule.actions);
          } else if (rule.elseActions) {
            this.executeActions(rule.elseActions);
          }
        } catch (error) {
          console.error(`Error evaluating rule "${rule.id}" for field "${fieldId}":`, error);
        }
      });
    });
  }

  private executeActions(actions: FlowAction[]) {
    actions.forEach((action) => {
      action.targetFields.forEach((targetFieldId) => {
        const targetField = this.fields[targetFieldId];
        if (!targetField) {
          console.warn(`Target field "${targetFieldId}" not found. Skipping action.`);
          return;
        }

        try {
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
            default:
              console.warn(`Unknown action type "${action.type}" for field "${targetFieldId}".`);
          }
        } catch (error) {
          console.error(`Error executing action for field "${targetFieldId}":`, error);
        }
      });
    });
  }

  addRule(rule: FlowRule) {
    try {
      this.rules.push(rule);
      this.setupRule(rule);
    } catch (error) {
      console.error(`Error adding rule "${rule.id}":`, error);
    }
  }

  removeRule(ruleId: string) {
    try {
      this.rules = this.rules.filter((rule) => rule.id !== ruleId);
    } catch (error) {
      console.error(`Error removing rule "${ruleId}":`, error);
    }
  }
}
