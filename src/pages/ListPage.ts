import IssueRow from '~/elements/IssueRow'
import ResultsBar, { IResultPoints } from '~/elements/ResultsBar'
import PjaxPage from '~/lib/PjaxPage'
import {
  addConfigChangeListener,
  getConfig,
  removeConfigChangeListener,
} from '~/utils/config'

export default class ListPage extends PjaxPage {
  public static SELECTOR = '[data-pjax-container]'
  public static ISSUE_ROW_SELECTOR = '.js-issue-row'
  public static SUBNAV_SELECTOR = '.subnav'
  // Used in milestone page
  public static SUBNAV_ALT_SELECTOR = '.repository-content .three-fourths'
  public static GITHUB_TOOLBAR_SELECTOR = '#js-issues-toolbar'

  public paths = [
    '/:org/:repo/issues',
    '/:org/:repo/issues?q&utf8',
    '/:org/:repo/issues/created_by/*others',
    '/:org/:repo/pulls',
    '/:org/:repo/pulls?q&utf8',
    '/:org/:repo/pulls/:username',
    '/:org/:repo/milestone/:id<\\d+>',
    '/:org/:repo/milestone/:id<\\d+>?closed',
  ]

  private resultsBar: ResultsBar
  private rows: IssueRow[] = []

  constructor() {
    super()

    this.mutationHandlers = {
      [IssueRow.TITLE_SELECTOR]: this.handleTitleMutations,
    }
  }

  public getElement() {
    return document.querySelector(ListPage.SELECTOR)
  }

  public getSubnavElement(): HTMLDivElement {
    const $container = this.getElement()
    return (
      $container.querySelector(ListPage.SUBNAV_SELECTOR) ||
      $container.querySelector(ListPage.SUBNAV_ALT_SELECTOR)
    )
  }

  public initialize() {
    const $container = this.getElement()
    const $subnav: HTMLDivElement = this.getSubnavElement()
    const $rows = this.getRows()

    this.resultsBar = new ResultsBar()
    this.rows = $rows.map($row => {
      const row = new IssueRow($row)
      row.hidePoints()
      return row
    })

    this.resultsBar.hide()
    this.resultsBar.appendTo($subnav)
    this.handleTitleMutations()

    getConfig(({ hidePointBadge = false, hidePointSummary = false }) => {
      if (!hidePointBadge) {
        this.rows.forEach(row => row.showPoints())
      }

      if (!hidePointSummary) {
        this.resultsBar.show()
      }
    })

    addConfigChangeListener(this.handleConfigChange)
  }

  public destroy() {
    removeConfigChangeListener(this.handleConfigChange)
  }

  public handleConfigChange = ({ hidePointBadge, hidePointSummary }) => {
    if (hidePointBadge) {
      if (hidePointBadge.newValue) {
        this.rows.forEach(row => row.hidePoints())
      } else {
        this.rows.forEach(row => row.showPoints())
      }
    }

    if (hidePointSummary) {
      if (hidePointSummary.newValue) {
        this.resultsBar.hide()
      } else {
        this.resultsBar.show()
      }
    }
  }

  public handleTitleMutations = () => {
    const resultPoints = this.addPointsToTitles()
    this.resultsBar.setPoints(resultPoints)
  }

  public getRows() {
    const $container = this.getElement()

    return [].slice.call(
      $container.querySelectorAll(ListPage.ISSUE_ROW_SELECTOR)
    )
  }

  public addPointsToTitles(): IResultPoints {
    const initialIssuePoints = { open: 0, closed: 0 }
    const initialPRPoints = { open: 0, merged: 0, closed: 0 }
    const initialPoints: IResultPoints = {
      issue: initialIssuePoints,
      pr: initialPRPoints,
    }

    // Do nothing if there are no issue/PR titles
    if (this.rows.length === 0) return initialPoints

    const issue = this.rows.reduce(
      ({ open, closed }, next) =>
        next.isIssue()
          ? {
              closed: next.isClosed() ? closed + next.getPoints() : closed,
              open: next.isOpen() ? open + next.getPoints() : open,
            }
          : { open, closed },
      initialIssuePoints
    )

    const pr = this.rows.reduce(
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
}
