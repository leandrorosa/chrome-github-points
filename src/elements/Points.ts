import IElement from '~/types/IElement'
import insertAfter from '~/utils/insertAfter'

enum PointsType {
  TOTAL = 'TOTAL',
  ISSUE = 'ISSUE',
  PR = 'PR',
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  MERGED = 'MERGED',
}

export default class Points implements IElement {
  public static SELECTOR = '__GHP_POINTS__'
  public static STR_REGEX = /(?:Total: |Issue: |PR: |Open: |Closed: |Merged: )?(\d*) Points?/
  public static NUM_REGEX = /\[(\d*)\]/

  public static prefixes = {
    [PointsType.TOTAL]: 'Total:',
    [PointsType.ISSUE]: 'Issue:',
    [PointsType.PR]: 'PR:',
    [PointsType.OPEN]: 'Open:',
    [PointsType.CLOSED]: 'Closed:',
    [PointsType.MERGED]: 'Merged:',
  }

  public static colors = {
    [PointsType.TOTAL]: '#24292e',
    [PointsType.ISSUE]: '#24292e',
    [PointsType.PR]: '#24292e',
    [PointsType.OPEN]: '#fff',
    [PointsType.CLOSED]: '#fff',
    [PointsType.MERGED]: '#fff',
  }

  public static backgroundColors = {
    [PointsType.TOTAL]: '#ddd',
    [PointsType.ISSUE]: '#ddd',
    [PointsType.PR]: '#ddd',
    [PointsType.OPEN]: '#28a745',
    [PointsType.CLOSED]: '#cb2431',
    [PointsType.MERGED]: '#6f42c1',
  }

  public static total($el = null) {
    return new this($el, PointsType.TOTAL)
  }

  public static issue($el = null) {
    return new this($el, PointsType.ISSUE)
  }

  public static pr($el = null) {
    return new this($el, PointsType.PR)
  }

  public static open($el = null) {
    return new this($el, PointsType.OPEN)
  }

  public static closed($el = null) {
    return new this($el, PointsType.CLOSED)
  }

  public static merged($el = null) {
    return new this($el, PointsType.MERGED)
  }

  public static parseTitle(title: string): number {
    const match = title.match(Points.NUM_REGEX) || title.match(Points.STR_REGEX)
    return match && match[1] ? parseInt(match[1], 10) : 0
  }

  private $el: HTMLSpanElement
  private type: PointsType
  private points: number = 0
  private noPrefix: boolean = false

  // IMPORTANT: Setting this to `true` will break the Points.STR_REGEX RegExp.
  private noSuffix: boolean = false

  public constructor($el = null, type: PointsType = PointsType.ISSUE) {
    this.$el = $el || this.createDOM()
    this.type = type

    this.setStyles()
    this.setTextContent(this.points)
  }

  public getElement() {
    return this.$el
  }

  public isIssue() {
    return this.type === PointsType.ISSUE
  }

  public isPR() {
    return this.type === PointsType.PR
  }

  public hidePrefix() {
    this.noPrefix = true
    this.setPoints(this.getPoints())
    return this
  }

  public showPrefix() {
    this.noPrefix = false
    this.setPoints(this.getPoints())
    return this
  }

  public hideSuffix() {
    this.noSuffix = true
    this.setPoints(this.getPoints())
    return this
  }

  public showSuffix() {
    this.noSuffix = false
    this.setPoints(this.getPoints())
    return this
  }

  public appendTo($target: Element) {
    if ($target.nextElementSibling.classList.contains(Points.SELECTOR)) {
      $target.nextElementSibling.remove()
    }

    insertAfter($target, this.$el)
  }

  public setToChild($parent: Element) {
    const $points = $parent.querySelector(`.${Points.SELECTOR}`)
    if (!$points) {
      $parent.appendChild(this.$el)
    } else {
      $parent.replaceChild(this.$el, $points)
    }
  }

  public setPoints(points: number) {
    this.points = points
    this.setTextContent(this.points)
  }

  public getPoints() {
    return this.points
  }

  public hide() {
    const $el = this.getElement()
    $el.style.display = 'none'
  }

  public show() {
    const $el = this.getElement()
    $el.style.display = 'inline-block'
  }

  public noMargin() {
    const $el = this.getElement()
    $el.style.margin = '0'
    return this
  }

  private setTextContent(points) {
    const $el = this.getElement()
    const prefix = this.noPrefix ? '' : `${Points.prefixes[this.type]} `
    const suffix = this.noSuffix ? '' : points === 1 ? 'Point' : 'Points'
    $el.textContent = `${prefix}${points} ${suffix}`
  }

  private setStyles() {
    const $el = this.getElement()

    $el.style.backgroundColor = Points.backgroundColors[this.type]
    $el.style.display = 'inline-block'
    $el.style.fontWeight = '600'
    $el.style.lineHeight = '1'
    $el.style.fontSize = '12px'
    $el.style.padding = '0.2em 0.5em'
    $el.style.borderRadius = '1em'
    $el.style.color = Points.colors[this.type]
    $el.style.marginLeft = '0.5em'
  }

  private createDOM() {
    const $span = document.createElement('span')
    $span.classList.add(Points.SELECTOR)
    return $span
  }
}
