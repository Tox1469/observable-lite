export type Observer<T> = {
  next: (value: T) => void;
  error?: (err: any) => void;
  complete?: () => void;
};

export type Unsubscribe = () => void;

export class Observable<T> {
  constructor(private producer: (observer: Observer<T>) => Unsubscribe | void) {}

  subscribe(observer: Observer<T> | ((value: T) => void)): Unsubscribe {
    const obs: Observer<T> = typeof observer === "function" ? { next: observer } : observer;
    const teardown = this.producer(obs);
    return () => {
      if (typeof teardown === "function") teardown();
    };
  }

  map<U>(fn: (v: T) => U): Observable<U> {
    return new Observable<U>((obs) =>
      this.subscribe({
        next: (v) => obs.next(fn(v)),
        error: obs.error,
        complete: obs.complete,
      })
    );
  }

  filter(fn: (v: T) => boolean): Observable<T> {
    return new Observable<T>((obs) =>
      this.subscribe({
        next: (v) => { if (fn(v)) obs.next(v); },
        error: obs.error,
        complete: obs.complete,
      })
    );
  }
}

export class Subject<T> {
  private observers = new Set<Observer<T>>();
  private closed = false;

  next(value: T): void {
    if (this.closed) return;
    this.observers.forEach((o) => o.next(value));
  }

  error(err: any): void {
    this.observers.forEach((o) => o.error?.(err));
    this.closed = true;
  }

  complete(): void {
    this.observers.forEach((o) => o.complete?.());
    this.observers.clear();
    this.closed = true;
  }

  subscribe(observer: Observer<T> | ((value: T) => void)): Unsubscribe {
    const obs: Observer<T> = typeof observer === "function" ? { next: observer } : observer;
    this.observers.add(obs);
    return () => this.observers.delete(obs);
  }
}

export class BehaviorSubject<T> extends Subject<T> {
  constructor(private value: T) {
    super();
  }
  getValue(): T {
    return this.value;
  }
  next(value: T): void {
    this.value = value;
    super.next(value);
  }
  subscribe(observer: Observer<T> | ((value: T) => void)): Unsubscribe {
    const obs: Observer<T> = typeof observer === "function" ? { next: observer } : observer;
    obs.next(this.value);
    return super.subscribe(obs);
  }
}
