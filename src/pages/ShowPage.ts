import IssueHeader from '~/elements/IssueHeader'
import PjaxPage from '~/lib/PjaxPage'
import {
  addConfigChangeListener,
  getConfig,
  removeConfigChangeListener,
} from '~/utils/config'

export default class ShowPage extends PjaxPage {
  public static SELECTOR = '[data-pjax-container]'
  public static ISSUE_HEADER_SELECTOR = '#partial-discussion-header'

  public paths = ['/:org/:repo/issues/:id<\\d+>', '/:org/:repo/pull/:id<\\d+>']
  public mutationHandlers = {}

  private header: IssueHeader

  constructor() {
    super()

    this.mutationHandlers = {
      [ShowPage.ISSUE_HEADER_SELECTOR]: this.handleHeaderMutation,
      [IssueHeader.TITLE_SELECTOR]: this.handleTitleMutation,
    }
  }

  public getElement() {
    return document.querySelector(ShowPage.SELECTOR)
  }

  public getHeaderElement() {
    return this.getElement().querySelector(ShowPage.ISSUE_HEADER_SELECTOR)
  }

  public initialize() {
    this.handleHeaderMutation()
    this.handleTitleMutation()

    addConfigChangeListener(this.handleConfigChange)
  }

  public destroy() {
    removeConfigChangeListener(this.handleConfigChange)
  }

  public handleConfigChange = ({ hidePointBadge, hidePointSummary }) => {
    if (hidePointBadge) {
      if (hidePointBadge.newValue) {
        this.header.hidePoints()
      } else {
        this.header.showPoints()
      }
    }
  }

  public handleTitleMutation = () => {
    const points = this.header.getPoints()
    this.header.setPoints(points)
    this.header.setToolbarPoints(points)
  }

  public handleHeaderMutation = () => {
    this.createHeader()
    this.header.mountToolbar()
  }

  private createHeader() {
    this.header = new IssueHeader(this.getHeaderElement())
    this.header.hidePoints()

    getConfig(({ hidePointBadge = false }) => {
      if (!hidePointBadge) {
        this.header.showPoints()
      }
    })
  }
}
