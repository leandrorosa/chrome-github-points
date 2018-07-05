import IssueTitleInput from '~/elements/IssueTitleInput'
import Points from '~/elements/Points'
import Title from '~/elements/Title'
import Toolbar from '~/elements/Toolbar'
import IElement from '~/types/IElement'

export default class ProjectPaneHeader implements IElement {
  public static TITLE_SELECTOR = '.js-issue-title'
  public static PR_CHECK_SELECTOR = '.octicon-git-pull-request'
  public static TITLE_INPUT_SELECTOR = '#issue_title'
  public static EDIT_BUTTON_SELECTOR = '.comment-action.js-details-target'
  public static SAVE_BUTTON_SELECTOR = 'button[type="submit"]'
  public static CANCEL_BUTTON_SELECTOR = 'button.js-details-target'

  private $el: HTMLInputElement
  private title: Title
  private toolbar: Toolbar
  private input: IssueTitleInput
  private isHandlersRegistered: boolean = false

  public constructor($el) {
    this.$el = $el
    this.toolbar = new Toolbar()
  }

  public getElement() {
    return this.$el
  }

  public getTitleElement() {
    return this.getElement().querySelector(ProjectPaneHeader.TITLE_SELECTOR)
  }

  public getTitleInputElement(): HTMLInputElement {
    return this.getElement().querySelector(
      ProjectPaneHeader.TITLE_INPUT_SELECTOR
    )
  }

  public isPR() {
    return Boolean(
      this.getElement().querySelector(ProjectPaneHeader.PR_CHECK_SELECTOR)
    )
  }

  public isIssue() {
    return !this.isPR()
  }

  public setPoints(points = null) {
    const pointsInstance = this.isPR() ? Points.pr() : Points.issue()
    pointsInstance.setPoints(points === null ? this.getPoints() : points)
    this.title.setPoints(pointsInstance, false) // Set element inside the title
  }

  public getPoints() {
    return this.title.getPoints()
  }

  public showPoints() {
    if (this.title) this.title.showPoints()
  }

  public hidePoints() {
    if (this.title) this.title.hidePoints()
  }

  public setToolbarPoints(points) {
    this.toolbar.setSelectedPoints(points)
  }

  public getToolbarPoints() {
    return this.toolbar.getSelectedPoints()
  }

  public openToolbar = () => {
    this.toolbar.open()
  }

  public closeToolbar = () => {
    this.toolbar.close()
  }

  public setupToolbar() {
    const $input = this.getTitleInputElement()
    if (!$input) return

    this.input = new IssueTitleInput($input)

    this.toolbar.appendTo($input)
    this.toolbar.clearHandlers()
    this.toolbar.registerHandler(points => {
      $input.value.match(Points.NUM_REGEX)
        ? ($input.value = $input.value.replace(Points.NUM_REGEX, `[${points}]`))
        : ($input.value = `${$input.value} [${points}]`)
    })
  }

  public setup() {
    if (!this.getElement()) return

    const $title = this.getTitleElement()

    // Replace the `Issue|PR: X Points` from the span content, to `[X]`
    const match = $title.textContent.match(Points.STR_REGEX)

    if (match) {
      $title.textContent = $title.textContent.replace(
        Points.STR_REGEX,
        `[${match[1]}]`
      )
    }

    this.title = new Title($title)
    const points = this.title.getPoints()

    this.setPoints(points)
    this.toolbar.setSelectedPoints(points)
  }

  public registerEditButtonHandler(handler) {
    const $editButton = this.$el.querySelector(
      ProjectPaneHeader.EDIT_BUTTON_SELECTOR
    )

    if (!$editButton) return

    $editButton.removeEventListener('click', handler)
    $editButton.addEventListener('click', handler)
  }

  public registerSaveButtonHandler(handler) {
    const $saveButton = this.$el.querySelector(
      ProjectPaneHeader.SAVE_BUTTON_SELECTOR
    )

    if (!$saveButton) return

    $saveButton.removeEventListener('click', handler)
    $saveButton.addEventListener('click', handler)
  }

  public registerCancelButtonHandler(handler) {
    const $cancelButton = this.$el.querySelector(
      ProjectPaneHeader.CANCEL_BUTTON_SELECTOR
    )

    if (!$cancelButton) return

    $cancelButton.removeEventListener('click', handler)
    $cancelButton.addEventListener('click', handler)
  }
}
