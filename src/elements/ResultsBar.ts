import Points from '~/elements/Points'
import IElement from '~/types/IElement'
import insertAfter from '~/utils/insertAfter'

export interface IIssuePoints {
  open: number
  closed: number
}

export interface IPRPoints {
  open: number
  merged: number
  closed: number
}

export interface IResultPoints {
  pr: IPRPoints
  issue: IIssuePoints
}

export default class ResultsBar implements IElement {
  public static SELECTOR = '__GHP_RESULTS_BAR__'
  public static DETAILS_SELECTOR = '__GHP_RESULTS_BAR_DETAILS__'

  private $el: HTMLTableElement // HTMLDivElement

  private points: {
    issuePoints?: Points
    issueOpenPoints?: Points
    issueClosedPoints?: Points
    prPoints?: Points
    prOpenPoints?: Points
    prMergedPoints?: Points
    prClosedPoints?: Points
    totalPoints?: Points
  } = {}
  private isColumnMode: boolean = false

  public constructor() {
    // First row
    this.points.issuePoints = Points.total().noMargin()

    // Second row
    this.points.issueOpenPoints = Points.open().noMargin()
    this.points.issueClosedPoints = Points.closed()

    // First row
    this.points.prPoints = Points.total().noMargin()

    // Second row
    this.points.prOpenPoints = Points.open().noMargin()
    this.points.prMergedPoints = Points.merged()
    this.points.prClosedPoints = Points.closed()

    // First row
    this.points.totalPoints = Points.total().noMargin()

    this.$el = this.createDOM()

    // this.$el.addEventListener('click', this.toggleDetails)

    this.setStyles()
  }

  public getElement() {
    return this.$el
  }

  public show() {
    this.getElement().style.display = 'table'
  }

  public hide() {
    this.getElement().style.display = 'none'
  }

  public appendTo($target: Element) {
    if (
      $target.nextElementSibling &&
      $target.nextElementSibling.classList.contains(ResultsBar.SELECTOR)
    ) {
      $target.nextElementSibling.remove()
    }

    insertAfter($target, this.$el)
  }

  public setToChild($parent: Element) {
    const $header = $parent.querySelector(`.${ResultsBar.SELECTOR}`)
    if (!$header) {
      $parent.appendChild(this.$el)
    } else {
      $parent.replaceChild(this.$el, $header)
    }
  }

  public setPoints({ pr, issue }: IResultPoints) {
    const { open: openIssues, closed: closedIssues } = issue
    const { open: openPRs, closed: closedPRs, merged: mergedPRs } = pr

    const issueTotal = openIssues + closedIssues
    const prTotal = openPRs + closedPRs + mergedPRs

    this.points.issuePoints.setPoints(issueTotal)
    this.points.issueOpenPoints.setPoints(openIssues)
    this.points.issueClosedPoints.setPoints(closedIssues)
    this.points.prPoints.setPoints(prTotal)
    this.points.prOpenPoints.setPoints(openPRs)
    this.points.prMergedPoints.setPoints(mergedPRs)
    this.points.prClosedPoints.setPoints(closedPRs)
    this.points.totalPoints.setPoints(issueTotal + prTotal)
  }

  public columnMode() {
    const $detailDivs = this.getDetailsDivs()

    $detailDivs.forEach($detailDiv => {
      $detailDiv.style.display = 'flex'
      $detailDiv.style.flexDirection = 'column'
      $detailDiv.style.alignItems = 'center'
    })

    Object.keys(this.points).map(key => {
      const point = this.points[key]
      const $point = point.getElement()
      // point.hidePrefix()
      point.hideSuffix()
      point.noMargin()
      $point.style.marginBottom = '0.3em'
    })

    this.isColumnMode = true
  }

  public toggleDetails = () => {
    const $detailDivs = this.getDetailsDivs()
    $detailDivs.forEach($detailDiv => {
      const display = $detailDiv.style.display
      $detailDiv.style.display = this.isColumnMode
        ? display === 'flex'
          ? 'none'
          : 'flex'
        : display === 'block'
          ? 'none'
          : 'block'
    })
  }

  private setStyles() {
    const $el = this.getElement()
    const borderColor = '#dfe2e5'

    $el.style.border = `1px solid ${borderColor}`
    $el.style.borderRadius = '3px'
    $el.style.width = '100%'
    $el.style.textAlign = 'center'
    $el.style.marginTop = '20px'
    $el.style.marginBottom = '20px'

    const $ths = [].slice.call($el.querySelectorAll('th'))
    $ths.forEach($th => {
      $th.style.padding = '0.3em'
      $th.style.borderBottom = `1px solid ${borderColor}`
    })

    const $tds = [].slice.call($el.querySelectorAll('td'))
    $tds.forEach($td => {
      $td.style.padding = '0.3em'
    })
  }

  private createDetailsDiv() {
    const $detailsDiv = document.createElement('div')
    $detailsDiv.classList.add(ResultsBar.DETAILS_SELECTOR)
    return $detailsDiv
  }

  private getDetailsDivs() {
    return [].slice.call(
      this.getElement().querySelectorAll(`.${ResultsBar.DETAILS_SELECTOR}`)
    )
  }

  private createIssueCellDOM() {
    const $issueCell = document.createElement('td')
    const $detailsDiv = this.createDetailsDiv()
    const $totalDiv = document.createElement('div')

    $detailsDiv.appendChild(this.points.issueOpenPoints.getElement())
    $detailsDiv.appendChild(this.points.issueClosedPoints.getElement())
    $totalDiv.appendChild(this.points.issuePoints.getElement())

    $issueCell.appendChild($detailsDiv)
    $issueCell.appendChild($totalDiv)

    return $issueCell
  }

  private createPRCellDOM() {
    const $prCell = document.createElement('td')
    const $detailsDiv = this.createDetailsDiv()
    const $totalDiv = document.createElement('div')

    $detailsDiv.appendChild(this.points.prOpenPoints.getElement())
    $detailsDiv.appendChild(this.points.prMergedPoints.getElement())
    $detailsDiv.appendChild(this.points.prClosedPoints.getElement())
    $totalDiv.appendChild(this.points.prPoints.getElement())

    $prCell.appendChild($detailsDiv)
    $prCell.appendChild($totalDiv)

    return $prCell
  }

  private createTotalCellDOM() {
    const $totalCell = document.createElement('td')
    const $totalDiv = document.createElement('div')
    $totalDiv.appendChild(this.points.totalPoints.getElement())
    $totalCell.appendChild($totalDiv)
    return $totalCell
  }

  private createDOM() {
    const $table = document.createElement('table')
    $table.classList.add(ResultsBar.SELECTOR)

    const $tr = document.createElement('tr')
    const $th = document.createElement('th')

    const $issueHeader = $th.cloneNode()
    const $prHeader = $th.cloneNode()
    const $totalHeader = $th.cloneNode()

    $issueHeader.textContent = 'Issues'
    $prHeader.textContent = 'PR'
    $totalHeader.textContent = 'Total'

    const $headerRow = $tr.cloneNode()
    $headerRow.appendChild($issueHeader)
    $headerRow.appendChild($prHeader)
    $headerRow.appendChild($totalHeader)

    const $dataRow = $tr.cloneNode()
    $dataRow.appendChild(this.createIssueCellDOM())
    $dataRow.appendChild(this.createPRCellDOM())
    $dataRow.appendChild(this.createTotalCellDOM())

    $table.appendChild($headerRow)
    $table.appendChild($dataRow)

    return $table
  }
}
