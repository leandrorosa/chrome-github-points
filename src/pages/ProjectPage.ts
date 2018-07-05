import ProjectColumn from '~/elements/ProjectColumn'
import ProjectPaneHeader from '~/elements/ProjectPaneHeader'
import PjaxPage from '~/lib/PjaxPage'
import {
  addConfigChangeListener,
  getConfig,
  removeConfigChangeListener,
} from '~/utils/config'

export default class ProjectPage extends PjaxPage {
  public static SELECTOR = '.repository-content'
  public static PANE_HEADER_SELECTOR = '.project-comment-title-hover'
  public static COLUMN_SELECTOR = '.js-project-column'
  public static COLUMN_TITLE_SELECTOR = '.js-project-column-name'
  public static CARD_TITLE_SELECTOR = ''

  public paths = ['/:org/:repo/projects/:id<\\d+>']

  private paneHeader: ProjectPaneHeader
  private columns: ProjectColumn[] = []

  constructor() {
    super()

    this.mutationHandlers = {
      [ProjectColumn.CARD_SELECTOR]: this.handleBoardMutation,
      [ProjectPaneHeader.TITLE_SELECTOR]: this.handleDetailPaneMutation,
    }
  }

  public getElement() {
    return document.querySelector(ProjectPage.SELECTOR)
  }

  public getPaneHeaderElement() {
    return this.getElement().querySelector(ProjectPage.PANE_HEADER_SELECTOR)
  }

  public initialize() {
    this.columns = this.getColumns()

    this.columns.forEach(column => column.hide())

    this.handleBoardMutation()

    getConfig(({ hidePointSummary = false }) => {
      if (!hidePointSummary) {
        this.columns.forEach(column => column.show())
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
        if (this.paneHeader) this.paneHeader.hidePoints()
        this.columns.forEach(column => column.hidePoints())
      } else {
        if (this.paneHeader) this.paneHeader.showPoints()
        this.columns.forEach(column => column.showPoints())
      }
    }

    if (hidePointSummary) {
      if (hidePointSummary.newValue) {
        this.columns.forEach(column => column.hide())
      } else {
        this.columns.forEach(column => column.show())
      }
    }
  }

  public handleBoardMutation = () => {
    this.columns.forEach(column => {
      column.setPoints(column.getPoints())
      column.hidePoints()
    })

    getConfig(({ hidePointBadge = false }) => {
      if (!hidePointBadge) {
        this.columns.forEach(column => {
          column.showPoints()
        })
      }
    })
  }

  public handleDetailPaneMutation = () => {
    const $paneHeader = this.getPaneHeaderElement()
    if (!$paneHeader) return

    this.paneHeader = new ProjectPaneHeader($paneHeader)

    this.paneHeader.setup()
    this.paneHeader.registerEditButtonHandler(this.handleTitleEdit)
    this.paneHeader.registerSaveButtonHandler(this.handleTitleSave)
    this.paneHeader.registerCancelButtonHandler(this.handleTitleCancel)

    this.paneHeader.hidePoints()

    getConfig(({ hidePointBadge = false }) => {
      if (!hidePointBadge) {
        this.paneHeader.showPoints()
      }
    })
  }

  private handleTitleEdit = () => {
    this.paneHeader.setupToolbar()
    this.paneHeader.openToolbar()
  }

  private handleTitleSave = () => {
    this.paneHeader.setPoints(this.paneHeader.getToolbarPoints())
  }

  private handleTitleCancel = () => {
    // Set back the original points from title
    this.paneHeader.setToolbarPoints(this.paneHeader.getPoints())
    this.paneHeader.closeToolbar()
  }

  private getColumns() {
    const $container = this.getElement()
    if (!$container) return []

    return [].map.call(
      $container.querySelectorAll(ProjectPage.COLUMN_SELECTOR),
      $column => new ProjectColumn($column)
    )
  }
}
