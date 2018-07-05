import IssueTitleInput from '~/elements/IssueTitleInput'
import Toolbar from '~/elements/Toolbar'
import PjaxPage from '~/lib/PjaxPage'

export default class CreatePage extends PjaxPage {
  public static SELECTOR = '.timeline-comment'
  public static TITLE_INPUT_SELECTOR = '.title'
  public paths = ['/:org/:repo/issues/new', '/:org/:repo/compare/:branches']

  private toolbar: Toolbar
  private input: IssueTitleInput

  public getElement() {
    return document.querySelector(CreatePage.SELECTOR)
  }

  public getTitleInputElement() {
    return this.getElement().querySelector(CreatePage.TITLE_INPUT_SELECTOR)
  }

  public initialize() {
    this.toolbar = new Toolbar()
    this.input = new IssueTitleInput(this.getTitleInputElement())
    this.mountToolbar()
  }

  private onToolbarClick = points => {
    this.input.setPoints(points)
  }

  private mountToolbar() {
    const $appendTarget = this.getTitleInputElement()
    if ($appendTarget) {
      this.toolbar.appendTo($appendTarget)
    }

    this.toolbar.clearHandlers()
    this.toolbar.registerHandler(this.onToolbarClick)
    this.toolbar.open()
  }
}
