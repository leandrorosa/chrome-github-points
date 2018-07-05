type MutationHandler = ($el: Element, mutation: MutationRecord) => void

export interface IMutationHandlers {
  [selector: string]: MutationHandler | MutationHandler[]
}

interface IPropertyMutationHandlers {
  [selector: string]: MutationHandler[]
}

export default class MutationObserverManager {
  private observer: MutationObserver
  private handlers: IPropertyMutationHandlers = {}
  private $container: Element
  private observerOptions: MutationObserverInit = {
    childList: true,
    subtree: true,
  }

  constructor() {
    this.observer = new MutationObserver(this.handleMutations)
  }

  public getObserver() {
    return this.observer
  }

  public observe(
    $container: Element,
    observerOptions: MutationObserverInit = { childList: true, subtree: true }
  ) {
    this.$container = $container
    this.observerOptions = observerOptions
    this._observe()
  }

  public disconnect() {
    this._disconnect()
  }

  public registerHandler(selector: string, handler: MutationHandler) {
    if (!this.handlers[selector]) {
      this.handlers[selector] = []
    }

    const foundHandler = this.handlers[selector].find(
      registeredHandler => registeredHandler === handler
    )

    if (foundHandler) return

    this.handlers[selector].push(handler)
  }

  public registerHandlers(handlers: IMutationHandlers = {}) {
    Object.keys(handlers).forEach(selector => {
      this.handlers[selector] =
        typeof handlers[selector] === 'function'
          ? [handlers[selector] as MutationHandler]
          : (handlers[selector] as MutationHandler[])
    })
  }

  public removeHandler(selector: string, handler: MutationHandler) {
    if (!this.handlers[selector]) return

    const handlers = this.handlers[selector]

    this.handlers[selector] = handlers[selector].filter(
      registeredHandler => registeredHandler === handler
    )
  }

  public doMutations(fn: () => void) {
    this._disconnect()
    Promise.resolve(fn()).then(() => {
      this._observe()
    })
  }

  private handleMutations = (
    mutations: MutationRecord[],
    observer: MutationObserver
  ) => {
    mutations.forEach(mutation => {
      if (!(mutation.target instanceof Element)) return

      const target: Element = mutation.target

      Object.keys(this.handlers).forEach(selector => {
        const handlers = this.handlers[selector]

        let matchedTarget
        let record

        if (target.matches(selector)) {
          matchedTarget = target
          record = mutation
        } else {
          matchedTarget = target.querySelector(selector)
          record = mutation
        }

        if (matchedTarget) {
          this.doMutations(() => {
            handlers.forEach(handler => handler(matchedTarget, record))
          })
        }
      })
    })
  }

  private _observe() {
    this.observer.observe(this.$container, this.observerOptions)
  }

  private _disconnect() {
    this.observer.disconnect()
  }
}
