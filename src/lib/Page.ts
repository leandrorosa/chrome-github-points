import Path from 'path-parser'
import MutationObserverManager, {
  IMutationHandlers,
} from '~/lib/MutationObserverManager'
import {
  registerKeyboardEvents,
  removeKeyboardEvents,
} from '~/registerKeyboardEvents'

export default abstract class Page {
  public paths: string[] = []
  public mutationHandlers: IMutationHandlers = {}
  private observerManager: MutationObserverManager

  constructor() {
    this.observerManager = new MutationObserverManager()
  }

  public abstract initialize(): void
  public abstract destroy(): void
  public abstract getElement(): Element

  public run() {
    this._initialize()
  }

  public restart() {
    this._destroy()
    this._initialize()
  }

  public getLocation() {
    return `${window.location.pathname}${window.location.search}`
  }

  public isActivePage(): boolean {
    if (!this.paths) return true
    const location = this.getLocation()

    let isActive = false
    this.paths.forEach(path => {
      const pathParser = new Path(path)
      if (pathParser.test(location)) {
        isActive = true
      }
    })

    return isActive
  }

  public doMutations(fn: () => void) {
    this.observerManager.doMutations(fn.bind(this))
  }

  public _initialize() {
    if (!this.isActivePage()) return // skip the rest if not active page

    this.observerManager.registerHandlers(this.mutationHandlers)
    this.observerManager.observe(this.getElement())

    registerKeyboardEvents()

    if (!this.getElement()) {
      throw new Error(
        "Trying to initialize a page on element which doesn't exist"
      )
    }

    this.doMutations(() => this.initialize())
  }

  public _destroy() {
    if (!this.isActivePage()) return // skip the rest if not active page

    this.observerManager.disconnect()

    removeKeyboardEvents()

    if (!this.getElement()) {
      throw new Error("Trying to destroy a page on element which doesn't exist")
    }

    this.doMutations(() => this.destroy())
  }
}
