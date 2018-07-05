import Page from '~/lib/Page'

export default abstract class PjaxPage extends Page {
  public _initialize() {
    document.addEventListener('pjax:start', this.handlePjaxStart)
    document.addEventListener('pjax:end', this.handlePjaxEnd)
    document.addEventListener('pjax:timeout', this.handlePjaxTimeout)

    super._initialize()
  }

  public _destroy() {
    document.removeEventListener('pjax:start', this.handlePjaxStart)
    document.removeEventListener('pjax:end', this.handlePjaxEnd)
    document.removeEventListener('pjax:timeout', this.handlePjaxTimeout)

    super._destroy()
  }

  public abstract getElement(): Element
  public onRequestStart() {}
  public onRequestEnd() {}
  public destroy() {}

  private handlePjaxStart = () => {
    this.onRequestStart()
  }

  private handlePjaxEnd = () => {
    this.restart()
    this.onRequestEnd()
  }

  private handlePjaxTimeout = (e: Event) => {
    e.preventDefault()
  }
}
