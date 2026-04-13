# observable-lite

Implementação mínima de Observable, Subject e BehaviorSubject inspirada em RxJS.

## Instalação

```bash
npm install observable-lite
```

## Uso

```ts
import { Observable, Subject, BehaviorSubject } from "observable-lite";

const obs = new Observable<number>((o) => {
  o.next(1); o.next(2); o.next(3);
  return () => console.log("cleanup");
});
obs.map((n) => n * 2).filter((n) => n > 2).subscribe((v) => console.log(v));

const subj = new Subject<string>();
subj.subscribe((v) => console.log(v));
subj.next("hello");

const b = new BehaviorSubject<number>(0);
b.subscribe((v) => console.log(v));
b.next(10);
```

## API

- `new Observable(producer)` — com `.map()`, `.filter()`, `.subscribe()`
- `new Subject()` — `next`, `error`, `complete`, `subscribe`
- `new BehaviorSubject(initial)` — `getValue()`, emite valor atual ao assinar

## Licença

MIT
