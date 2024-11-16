import { BehaviorSubject, of, Subject, switchMap, debounceTime, catchError, Observable, from } from 'rxjs';
import { AsyncValidator, Renderer } from './types/types';
import { FieldConfig } from './types/interfaces';

export class Field<T, C extends FieldConfig<T>> {
  protected value$ = new BehaviorSubject<T | null>(null);
  protected errors$ = new Subject<string[]>();
  protected required$ = new BehaviorSubject<boolean>(false);
  protected disabled$ = new BehaviorSubject<boolean>(false);
  protected visible$ = new BehaviorSubject<boolean>(true);
  protected validationInProgress$ = new BehaviorSubject<boolean>(false);
  protected isDirty = false; // Track whether validation should run
  public config: C;

  constructor(
    config: C,
    protected renderer$:  Renderer<T, C>,
  ) {
    this.config = config;

    if (config.initialValue !== undefined) {
      this.value$.next(config.initialValue);
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

    this.setupValidation();
  }

  private setupValidation() {
    this.value$
      .pipe(
        debounceTime(this.config.validatorsDebounce ?? 300),
        switchMap((value) => {
          if (!this.isDirty) return of([]);
          return this.runValidators(value);
        }),
      )
      .subscribe((errors) => {
        this.errors$.next(errors);
      });
  }

  private runValidators(value: T | null): Observable<string[]> {
    const { validators } = this.config;

    if (!validators || validators.length === 0) {
      return of([]);
    }

    this.validationInProgress$.next(true);

    const syncErrors: string[] = [];
    const asyncValidators: AsyncValidator<T>[] = [];

    for (const validator of validators) {
      try {
        const result = validator(value, this.required$.getValue());
        if (result instanceof Promise) {
          asyncValidators.push(() => result);
        } else if (result) {
          syncErrors.push(result);
        }
      } catch (e) {
        console.error(e);
      }
    }

    if (asyncValidators.length > 0) {
      const asyncValidationPromises = asyncValidators.map((validator) =>
        validator(value, this.required$.getValue())
          .then((result) => result || [])
          .catch(() => []),
      );

      return from(Promise.all(asyncValidationPromises)).pipe(
        switchMap((results) => {
          this.validationInProgress$.next(false);
          const asyncErrors = results.flat();
          return of([...syncErrors, ...asyncErrors]);
        }),
        catchError(() => {
          this.validationInProgress$.next(false);
          return of(syncErrors);
        }),
      );
    }

    this.validationInProgress$.next(false);
    return of(syncErrors);
  }

  render(container?: HTMLElement) {
    if (!this.renderer$) return;
    if (container) {
      this.renderer$(container, this);
      return;
    }
    const dynamicContainer = document.querySelector(`[data-field="${this.config.id}"]`) as HTMLElement | null;
    if (dynamicContainer) {
      this.renderer$(dynamicContainer, this);
    } else {
      console.error(`No container specified for field ${this.config.id}`);
    }
  }

  // Setters
  setValue(value: T) {
    this.isDirty = true;
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

  // Getters
  get label(): string | null {
    return this.config.label || null;
  }

  get name(): string | null {
    return this.config.name || null;
  }

  get id(): string {
    return this.config.id;
  }

  get value(): Observable<T | null> {
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

  get validationInProgress(): Observable<boolean> {
    return this.validationInProgress$.asObservable();
  }

  get fieldName(): string {
    return this.config.name ?? this.config.id;
  }
}
