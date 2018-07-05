import Points from '~/elements/Points'
import IElement from '~/types/IElement'

export default class Title implements IElement {
  private $el: Element
  private points: Points

  public constructor($el) {
    this.$el = $el
  }

  public getElement() {
    return this.$el
  }

  public hidePoints() {
    if (this.points) {
      this.points.hide()
    }
  }

  public showPoints() {
    if (this.points) {
      this.points.show()
    }
  }

  public getPoints() {
    if (!this.$el) return 0

    const title =
      this.$el.nextElementSibling &&
      this.$el.nextElementSibling.classList.contains(Points.SELECTOR)
        ? this.$el.nextElementSibling.textContent
        : this.$el.textContent

    return Points.parseTitle(title)
  }

  public setPoints(points: Points | number, append = true) {
    if (!this.$el) return

    if (!(points instanceof Points)) {
      // TODO: refactoring
      this.points = new Points()
      this.points.setPoints(points)
    } else {
      this.points = points
    }

    const title = this.$el.innerHTML
      .replace(Points.NUM_REGEX, '')
      .replace(/\s+$/, '') // remove the last space

    this.$el.innerHTML = `${title}`

    if (append) {
      this.points.appendTo(this.$el)
    } else {
      this.points.setToChild(this.$el)
    }

    return this.points.getPoints()
  }
}
