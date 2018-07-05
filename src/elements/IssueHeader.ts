import IssueTitleInput from '~/elements/IssueTitleInput'
import Points from '~/elements/Points'
import Title from '~/elements/Title'
import Toolbar from '~/elements/Toolbar'
import IElement from '~/types/IElement'

export default class IssueHeader implements IElement {
  public static PR_CHECK_SELECTOR = '.pull.request'
  public static TITLE_SELECTOR = '.js-issue-title'
  public static EDIT_AREA_SELECTOR = '.gh-header-edit'
  public static TITLE_INPUT_SELECTOR = '.edit-issue-title'
  public static TITLE_UPDATE_FORM_SELECTOR = 'form.js-issue-update'
  public static EDIT_BUTTON_SELECTOR = '.gh-header-actions > .js-details-target'
  public static CANCEL_BUTTON_SELECTOR = '.js-issue-update .js-details-target'

  private $el: HTMLDivElement
  private title: Title
  private toolbar: Toolbar
  private input: IssueTitleInput
  private isPointsHidden: boolean = false

  public constructor($el = null) {
    this.$el = $el
    this.title = new Title(this.getTitleElement())
    this.input = new IssueTitleInput(this.getTitleInputElement())
    this.toolbar = new Toolbar()
    this.setupHandlers()
  }

  public getElement() {
    return this.$el
  }

  public getTitleElement() {
    return this.getElement().querySelector(IssueHeader.TITLE_SELECTOR)
  }

  public getTitleInputElement() {
    return this.getElement().querySelector(IssueHeader.TITLE_INPUT_SELECTOR)
  }

  public getPoints() {
    return this.title.getPoints()
  }

  public setPoints(points = null) {
    const pointsInstance = this.isPR() ? Points.pr() : Points.issue()
    pointsInstance.setPoints(points || this.getPoints())

    if (this.isPointsHidden) {
      pointsInstance.hide()
    }

    this.title.setPoints(pointsInstance)
  }

  public showPoints() {
    this.isPointsHidden = false
    this.title.showPoints()
  }

  public hidePoints() {
    this.isPointsHidden = true
    this.title.hidePoints()
  }

  public isPR(): boolean {
    const $container = this.getElement()
    return $container.matches(IssueHeader.PR_CHECK_SELECTOR)
  }

  public isIssue(): boolean {
    return !this.isPR()
  }

  public openToolbar() {
    this.toolbar.open()
  }

  public closeToolbar() {
    this.toolbar.close()
  }

  public getToolbarPoints() {
    return this.toolbar.getSelectedPoints()
  }

  public setToolbarPoints(points) {
    return this.toolbar.setSelectedPoints(points)
  }

  public mountToolbar(selector = IssueHeader.EDIT_AREA_SELECTOR) {
    const $appendTarget = this.getElement().querySelector(selector)

    if ($appendTarget) {
      this.toolbar.appendTo($appendTarget)
    }

    this.toolbar.clearHandlers()
    this.toolbar.registerHandler(this.onToolbarClick)
  }

  public onToolbarClick = points => {
    this.input.setPoints(points)
  }

  private setupHandlers() {
    this.registerSubmitHandler()
    this.registerEditButtonHandler()
    this.registerCancelButtonHandler()
  }

  private registerSubmitHandler() {
    const $container = this.getElement()

    const $issueUpdateForm = $container.querySelector(
      IssueHeader.TITLE_UPDATE_FORM_SELECTOR
    )

    if (!$issueUpdateForm) return

    $issueUpdateForm.addEventListener('submit', () => {
      this.setPoints(this.getToolbarPoints())
      this.closeToolbar()
    })
  }

  private registerEditButtonHandler() {
    const $container = this.getElement()

    const $editButton = $container.querySelector(
      IssueHeader.EDIT_BUTTON_SELECTOR
    )

    if (!$editButton) return

    $editButton.addEventListener('click', () => {
      this.openToolbar()
    })
  }

  private registerCancelButtonHandler() {
    const $container = this.getElement()

    const $cancelButton = $container.querySelector(
      IssueHeader.CANCEL_BUTTON_SELECTOR
    )

    if (!$cancelButton) return

    $cancelButton.addEventListener('click', () => {
      const points = this.getPoints()
      this.setToolbarPoints(points)
      this.setPoints(points)
      this.input.setPoints(points)
      this.closeToolbar()
    })
  }
}
