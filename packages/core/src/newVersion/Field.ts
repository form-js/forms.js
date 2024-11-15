import { BehaviorSubject, of, Subject, switchMap, debounceTime, catchError, Observable, from } from 'rxjs';
import { AsyncValidator, Renderer, Validator } from './types/types';

export class Field {
  private value$ = new BehaviorSubject<any>(null);
  private errors$ = new Subject<string[]>();
  private required$ = new BehaviorSubject<boolean>(false);
  private disabled$ = new BehaviorSubject<boolean>(false);
  private visible$ = new BehaviorSubject<boolean>(true);
  private label$: string | null = null;
  private description$: string | null = null;
  private asyncValidationInProgress$ = new BehaviorSubject<boolean>(false);
  private isDirty = false; // Track whether validation should run
  private id$: string;
  private name$: string | null = null;

  constructor(
    private config: {
      id: string;
      name?: string;
      label?: string;
      placeholder?: string;
      description?: string;
      initialValue?: any;
      required?: boolean;
      disabled?: boolean;
      visible?: boolean;
      validators?: Validator[];
      validatorsDebounce?: number;
    },
    private renderer$: Renderer | null = null,
  ) {
    this.id$ = config.id;

    if (config.initialValue !== undefined) {
      this.value$.next(config.initialValue);
    }

    if (config.name !== undefined) {
      this.name$ = config.name;
    }
    if (config.required !== undefined) {
      this.required$.next(config.required);
    }
    if (config.disabled !== undefined) {
      this.disabled$.next(config.disabled);
    }
    if (config.visible !== undefined) {
      this.visible$.next(config.visible);
    }

    if (config.label) {
      this.label$ = config.label;
    }
    if (config.description) {
      this.description$ = config.description;
    }

    // Run initial validation
    this.setupValidation();
  }

  private setupValidation() {
    this.value$
      .pipe(
        debounceTime(this.config.validatorsDebounce ?? 300), // Avoid rapid-fire validations
        switchMap((value) => {
          if (!this.isDirty) return of([]); // Skip validation until the field is dirty
          return this.runValidators(value); // Handle sync and async validation
        }),
      )
      .subscribe((errors) => {
        this.errors$.next(errors); // Update errors
      });
  }

  private runValidators(value: any): Observable<string[]> {
    const { validators } = this.config;

    if (!validators || validators.length === 0) {
      return of([]); // No validators, no errors
    }

    this.asyncValidationInProgress$.next(true);

    const syncErrors: string[] = [];
    const asyncValidators: AsyncValidator[] = [];

    // Process validators
    for (const validator of validators) {
      try {
        const result = validator(value, this.required$.getValue()); // Pass required to each validator
        if (result instanceof Promise) {
          // Async validator
          asyncValidators.push(() => result);
        } else if (result) {
          // Sync error
          syncErrors.push(result);
        }
      } catch (e) {
        console.error('Validator error:', e);
      }
    }

    // Handle async validators
    if (asyncValidators.length > 0) {
      const asyncValidationPromises = asyncValidators.map(
        (validator) =>
          validator(value, this.required$.getValue())
            .then((result) => result || []) // Ensure null is treated as an empty array
            .catch(() => []), // Handle errors gracefully
      );

      return from(Promise.all(asyncValidationPromises)).pipe(
        switchMap((results) => {
          this.asyncValidationInProgress$.next(false);

          // Combine sync and async errors
          const asyncErrors = results.flat();
          return of([...syncErrors, ...asyncErrors]);
        }),
        catchError(() => {
          this.asyncValidationInProgress$.next(false);
          return of(syncErrors); // Return only sync errors on failure
        }),
      );
    }

    this.asyncValidationInProgress$.next(false);
    return of(syncErrors); // Only sync errors
  }

  render(container: HTMLElement) {
    if (this.renderer$) this.renderer$(container, this);
  }

  //Setters

  setValue(value: any) {
    this.isDirty = true; // Mark the field as dirty
    this.value$.next(value);
  }

  setRequired(value: boolean) {
    this.required$.next(value);
  }

  setDisabled(value: boolean) {
    this.disabled$.next(value);
  }

  setVisible(value: boolean) {
    this.visible$.next(value);
  }

  //Getters

  get value(): Observable<any> {
    return this.value$.asObservable();
  }

  get errors(): Observable<string[]> {
    return this.errors$.asObservable();
  }

  get required(): Observable<boolean> {
    return this.required$.asObservable();
  }

  get disabled(): Observable<boolean> {
    return this.disabled$.asObservable();
  }

  get visible(): Observable<boolean> {
    return this.visible$.asObservable();
  }

  get label(): string | null {
    return this.label$;
  }

  get description(): string | null {
    return this.description$;
  }

  get id(): string {
    return this.id$;
  }

  get name(): string | null {
    return this.name$;
  }

  get asyncValidationInProgress(): Observable<boolean> {
    return this.asyncValidationInProgress$.asObservable();
  }
}
