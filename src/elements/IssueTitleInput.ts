import Points from '~/elements/Points'
import IElement from '~/types/IElement'

export default class IssueTitleInput implements IElement {
  private $el: HTMLInputElement

  public constructor($el) {
    this.$el = $el
  }

  public getElement() {
    return this.$el
  }

  public setPoints = points => {
    const $input = this.getElement()
    if (!$input) return

    const value = $input.value

    $input.value = $input.value.match(Points.NUM_REGEX)
      ? $input.value.replace(Points.NUM_REGEX, `[${points}]`)
      : `${$input.value} [${points}]`
  }
}
