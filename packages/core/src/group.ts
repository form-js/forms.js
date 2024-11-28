import { BehaviorSubject, combineLatest, debounceTime, map, Observable } from 'rxjs';
import { Field } from './Field';
import { GroupConfig } from './types';

export class Group<TFields extends Record<string, any>> {
  private fields: Record<string, Field<any, any>> = {};
  private groups: Record<string, Group<any>> = {};

  private disabled$ = new BehaviorSubject<boolean>(false);
  private visible$ = new BehaviorSubject<boolean>(true);
  private required$ = new BehaviorSubject<boolean>(false);

  constructor(
    private id: string,
    config: GroupConfig,
  ) {
    this.fields = config.fields || {};
    this.groups = config.groups || {};
  }

  // Add a field to the group
  addField(fieldName: string, field: Field<any, any>) {
    this.fields[fieldName] = field;
    this.propagateState(); // Update field states
  }

  // Add a sub-group to the group
  addGroup(groupName: string, group: Group<any>) {
    this.groups[groupName] = group;
    this.propagateState(); // Update nested group states
  }

  render() {   
    Object.values(this.fields).forEach((field) => field.render());
    Object.values(this.groups).forEach((group) => group.render());
  }

  // Propagate global state changes (disabled, visible, required)
  private propagateState() {
    const disabled = this.disabled$.getValue();
    const visible = this.visible$.getValue();
    const required = this.required$.getValue();

    Object.values(this.fields).forEach((field) => {
      field.setDisabled(disabled);
      field.setVisible(visible);
      field.setRequired(required);
    });

    Object.values(this.groups).forEach((group) => {
      group.setDisabled(disabled);
      group.setVisible(visible);
      group.setRequired(required);
    });
  }

  // Reactive data method
  watchData(callback: (values: Record<string, any>) => void) {
    const fieldObservables = Object.entries(this.fields).map(([key, field]) =>
      field.value.pipe(map((value) => ({ [key]: value }))),
    );

    const groupObservables = Object.entries(this.groups).map(([key, group]) =>
      group.watchDataAsObservable().pipe(map((values) => ({ [key]: values }))),
    );

    combineLatest([...fieldObservables, ...groupObservables])
      .pipe(
        debounceTime(300), // Optional: Adjust debounce time as needed
        map((fieldValues) => Object.assign({}, ...fieldValues)), // Combine all data
        map((combinedValues) => ({ [this.id]: combinedValues })), // Prefix with group ID
      )
      .subscribe(callback);
  }

  // Helper for returning observable of group data
  watchDataAsObservable(): Observable<Record<string, any>> {
    const fieldObservables = Object.entries(this.fields).map(([key, field]) =>
      field.value.pipe(map((value) => ({ [key]: value }))),
    );

    const groupObservables = Object.entries(this.groups).map(([key, group]) =>
      group.watchDataAsObservable().pipe(map((values) => ({ [key]: values }))),
    );

    return combineLatest([...fieldObservables, ...groupObservables]).pipe(
      map((fieldValues) => Object.assign({}, ...fieldValues)), // Combine into a single object
    );
  }

  // Group-level controls for state
  setDisabled(value: boolean) {
    this.disabled$.next(value);
    Object.values(this.fields).forEach((field) => {
      field.setDisabled(value);
    });

    Object.values(this.groups).forEach((group) => {
      group.setDisabled(value);
    });
  }

  setVisible(value: boolean) {
    this.visible$.next(value);
    Object.values(this.fields).forEach((field) => {
      field.setVisible(value);
    });

    Object.values(this.groups).forEach((group) => {
      group.setVisible(value);
    });
  }

  setRequired(value: boolean) {
    this.required$.next(value);
    Object.values(this.fields).forEach((field) => {
      field.setRequired(value);
    });

    Object.values(this.groups).forEach((group) => {
      group.setRequired(value);
    });
  }

  // Collect and prefix group data
  data(): Record<string, any> {
    // Collect data from fields, prefixing with the group's ID
    const fieldData: Record<string, any> = {};
    Object.entries(this.fields).forEach(([key, field]) => {
      fieldData[key] = field.getValue();
    });

    // Add fields data under the group's ID
    const groupData: Record<string, any> = { ...fieldData };

    // Collect and nest data from sub-groups
    Object.entries(this.groups).forEach(([key, group]) => {
      groupData[key] = group.data();
    });

    return groupData;
  }

  // Track progress
  progress() {
    let correctlyFilledFields = 0;
    let correctlyFilledRequiredFields = 0;
    let totalRequiredFields = 0;
    let totalFields = 0;

    Object.values(this.fields).forEach((field) => {
      totalFields++;
      if (field.isValid()) correctlyFilledFields++;
      if (field.isRequired() && field.isValid()) correctlyFilledRequiredFields++;
      if (field.isRequired()) totalRequiredFields++;
    });

    Object.values(this.groups).forEach((group) => {
      const groupProgress = group.progress();
      correctlyFilledFields += groupProgress.correctlyFilledFields;
      correctlyFilledRequiredFields += groupProgress.correctlyFilledRequiredFields;
      totalRequiredFields += groupProgress.totalRequiredFields;
      totalFields += groupProgress.totalFields;
    });

    return {
      correctlyFilledFields,
      correctlyFilledRequiredFields,
      totalRequiredFields,
      totalFields,
    };
  }
}
