import Points from '~/elements/Points'
import Title from '~/elements/Title'
import IElement from '~/types/IElement'

export default class ProjectCard implements IElement {
  public static TITLE_SELECTOR = '.js-project-card-issue-link'
  public static CHECK_ISSUE_OPEN_SELECTOR = '.octicon-issue-opened'
  public static CHECK_ISSUE_CLOSED_SELECTOR = '.octicon-issue-closed'
  public static CHECK_PR_SELECTOR = '.octicon-git-pull-request'
  public static CHECK_PR_OPEN_SELECTOR = '.octicon-git-pull-request.open'
  public static CHECK_PR_MERGED_SELECTOR = '.octicon-git-pull-request.merged'
  public static CHECK_PR_CLOSED_SELECTOR = '.octicon-git-pull-request.closed'

  private $el: HTMLDivElement
  private title: Title
  private isPointsHidden: boolean = false

  public constructor($el) {
    this.$el = $el
    this.title = new Title(this.getTitleElement())
  }

  public getElement() {
    return this.$el
  }

  public getTitleElement() {
    return this.getElement().querySelector(ProjectCard.TITLE_SELECTOR)
  }

  public setPoints(points = null) {
    const pointsInstance = this.isPR() ? Points.pr() : Points.issue()
    pointsInstance.setPoints(points === null ? this.getPoints() : points)

    if (this.isPointsHidden) {
      pointsInstance.hide()
    }

    this.title.setPoints(pointsInstance, false) // Set element inside the title
  }

  public getPoints() {
    return this.title.getPoints()
  }

  public showPoints() {
    this.isPointsHidden = false
    this.title.showPoints()
  }

  public hidePoints() {
    this.isPointsHidden = true
    this.title.hidePoints()
  }

  public isPR() {
    return Boolean(
      this.getElement().querySelector(ProjectCard.CHECK_PR_SELECTOR)
    )
  }

  public isIssue() {
    return !this.isPR()
  }

  public isOpen(): boolean {
    const $container = this.getElement()
    return Boolean(
      this.isPR()
        ? $container.querySelector(ProjectCard.CHECK_PR_OPEN_SELECTOR)
        : $container.querySelector(ProjectCard.CHECK_ISSUE_OPEN_SELECTOR)
    )
  }

  public isClosed(): boolean {
    const $container = this.getElement()
    return Boolean(
      this.isPR()
        ? $container.querySelector(ProjectCard.CHECK_PR_CLOSED_SELECTOR)
        : $container.querySelector(ProjectCard.CHECK_ISSUE_CLOSED_SELECTOR)
    )
  }

  public isMerged(): boolean {
    const $container = this.getElement()
    return (
      this.isPR() &&
      Boolean($container.querySelector(ProjectCard.CHECK_PR_MERGED_SELECTOR))
    )
  }
}
