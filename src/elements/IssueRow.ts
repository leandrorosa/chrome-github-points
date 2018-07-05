import Points from '~/elements/Points'
import Title from '~/elements/Title'
import IElement from '~/types/IElement'

export default class IssueRow implements IElement {
  public static CHECK_ISSUE_OPEN_SELECTOR = '[aria-label="Open issue"]'
  public static CHECK_ISSUE_CLOSED_SELECTOR = '[aria-label="Closed issue"]'
  public static CHECK_PR_OPEN_SELECTOR = '[aria-label="Open pull request"]'
  public static CHECK_PR_MERGED_SELECTOR = '[aria-label="Merged pull request"]'
  public static CHECK_PR_CLOSED_SELECTOR = '[aria-label="Closed pull request"]'
  public static TITLE_SELECTOR = 'a.h4.js-navigation-open'
  private $el: HTMLLIElement
  private title: Title

  public constructor($el = null) {
    this.$el = $el
    this.title = new Title(this.getTitleElement())
    this.setPoints()
  }

  public getElement() {
    return this.$el
  }

  public getTitleElement() {
    return this.getElement().querySelector(IssueRow.TITLE_SELECTOR)
  }

  public getTitle() {
    return this.title
  }

  public getPoints() {
    return this.title.getPoints()
  }

  public setPoints(points = null) {
    const pointsInstance = this.isPR() ? Points.pr() : Points.issue()
    pointsInstance.setPoints(points || this.getPoints())
    this.title.setPoints(pointsInstance)
  }

  public showPoints() {
    this.title.showPoints()
  }

  public hidePoints() {
    this.title.hidePoints()
  }

  public isPR(): boolean {
    const $container = this.getElement()
    if (!$container) return false
    return Boolean(
      $container.querySelector(IssueRow.CHECK_PR_OPEN_SELECTOR) ||
        $container.querySelector(IssueRow.CHECK_PR_MERGED_SELECTOR) ||
        $container.querySelector(IssueRow.CHECK_PR_CLOSED_SELECTOR)
    )
  }

  public isOpen(): boolean {
    const $container = this.getElement()
    return Boolean(
      this.isPR()
        ? $container.querySelector(IssueRow.CHECK_PR_OPEN_SELECTOR)
        : $container.querySelector(IssueRow.CHECK_ISSUE_OPEN_SELECTOR)
    )
  }

  public isClosed(): boolean {
    const $container = this.getElement()
    return Boolean(
      this.isPR()
        ? $container.querySelector(IssueRow.CHECK_PR_CLOSED_SELECTOR)
        : $container.querySelector(IssueRow.CHECK_ISSUE_CLOSED_SELECTOR)
    )
  }

  public isMerged(): boolean {
    const $container = this.getElement()
    return (
      this.isPR() &&
      Boolean($container.querySelector(IssueRow.CHECK_PR_MERGED_SELECTOR))
    )
  }

  public isIssue(): boolean {
    return !this.isPR()
  }
}
