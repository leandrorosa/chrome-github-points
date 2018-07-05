import ProjectCard from '~/elements/ProjectCard'
import ResultsBar, { IResultPoints } from '~/elements/ResultsBar'
import IElement from '~/types/IElement'

export default class ProjectColumn implements IElement {
  public static CARD_SELECTOR = '.js-project-column-card'
  public static TITLE_SELECTOR = 'h4.px-1'

  private $el: HTMLDivElement
  private resultsBar: ResultsBar

  public constructor($el) {
    this.$el = $el
    this.resultsBar = new ResultsBar()
    this.resultsBar.columnMode()
    this.resultsBar.appendTo(this.getTitleElement())
    this.setStyles()
  }

  public getElement() {
    return this.$el
  }

  public getTitleElement() {
    return this.getElement().querySelector(ProjectColumn.TITLE_SELECTOR)
  }

  public getCards(): ProjectCard[] {
    return [].map.call(
      this.getElement().querySelectorAll(ProjectColumn.CARD_SELECTOR),
      $card => {
        const card = new ProjectCard($card)
        card.setPoints()
        return card
      }
    )
  }

  public getPoints(): IResultPoints {
    const initialIssuePoints = { open: 0, closed: 0 }
    const initialPRPoints = { open: 0, merged: 0, closed: 0 }

    const cards = this.getCards()

    const issue = cards.reduce(
      ({ open, closed }, next) =>
        next.isIssue()
          ? {
              closed: next.isClosed() ? closed + next.getPoints() : closed,
              open: next.isOpen() ? open + next.getPoints() : open,
            }
          : { open, closed },
      initialIssuePoints
    )

    const pr = cards.reduce(
      ({ open, merged, closed }, next) =>
        next.isPR()
          ? {
              closed: next.isClosed() ? closed + next.getPoints() : closed,
              merged: next.isMerged() ? merged + next.getPoints() : merged,
              open: next.isOpen() ? open + next.getPoints() : open,
            }
          : { open, merged, closed },
      initialPRPoints
    )

    return { issue, pr }
  }

  public setPoints(points: IResultPoints) {
    this.resultsBar.setPoints(points)
  }

  public show() {
    this.resultsBar.show()
  }

  public hide() {
    this.resultsBar.hide()
  }

  public showPoints() {
    this.getCards().forEach(card => card.showPoints())
  }

  public hidePoints() {
    this.getCards().forEach(card => card.hidePoints())
  }

  private setStyles() {
    const $resultsBar = this.resultsBar.getElement()
    $resultsBar.style.marginTop = '5px'
    $resultsBar.style.marginBottom = '0'
  }
}
