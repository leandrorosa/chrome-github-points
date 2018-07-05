import IElement from '~/types/IElement'
import insertAfter from '~/utils/insertAfter'

type Handler = (points: number) => void

export default class Toolbar implements IElement {
  public static SELECTOR = '__GHP_TOOLBAR__'
  public static AVAILABLE_POINTS = [0, 1, 2, 3, 5, 8, 13, 21]

  private $el: HTMLDivElement
  private handlers: Handler[] = []

  public constructor() {
    this.$el = this.createDOM()
  }

  public getElement() {
    return this.$el
  }

  public open() {
    this.$el.style.display = 'block'
  }

  public close() {
    this.$el.style.display = 'none'
  }

  public appendTo($target) {
    if (
      $target.nextElementSibling &&
      $target.nextElementSibling.classList.contains(Toolbar.SELECTOR)
    ) {
      return
    }

    insertAfter($target, this.$el)
  }

  public setSelectedPoints(points) {
    const $selectedButton = this.$el.querySelector(`button.selected`)
    const $nextButton = this.$el.querySelector(
      `[data-points-value="${points}"]`
    )

    if ($selectedButton) {
      $selectedButton.classList.remove('selected')
    }

    if ($nextButton) {
      $nextButton.classList.add('selected')
    }
  }

  public registerHandler(handler) {
    this.handlers.push(handler)
    return () => this.removeHandler(handler)
  }

  public removeHandler = handler => {
    this.handlers = this.handlers.filter(
      registeredHandler => registeredHandler === handler
    )
  }

  public clearHandlers() {
    this.handlers = []
  }

  public hasSelectedButton(): boolean {
    return Boolean(this.getSelectedButton())
  }

  public getSelectedButton(): HTMLButtonElement {
    return this.$el.querySelector('.selected')
  }

  public getSelectedPoints() {
    const $button = this.getSelectedButton()
    if (!$button) return 0
    return parseInt($button.getAttribute('data-points-value'), 10)
  }

  private createDOM() {
    const $toolbar = document.createElement('div')
    $toolbar.classList.add(Toolbar.SELECTOR)
    $toolbar.style.display = 'none'
    $toolbar.style.marginTop = '0.5em'

    Toolbar.AVAILABLE_POINTS.forEach(point => {
      const $button = document.createElement('button')

      $button.classList.add('btn', 'btn-sm')
      $button.setAttribute('data-points-value', `${point}`)
      $button.style.marginRight = '0.5em'
      $button.style.marginBottom = '0.5em'
      $button.style.minWidth = '6em'
      $button.style.padding = '3px 8px'

      $button.textContent = `${point} Point${point === 1 ? '' : 's'}`

      $button.addEventListener('click', e => {
        e.preventDefault()
        this.setSelectedPoints(point)
        this.handlers.forEach(handler => handler(point))
      })

      $toolbar.appendChild($button)
    })

    return $toolbar
  }
}
