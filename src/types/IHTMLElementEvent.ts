export default interface IHTMLElementEvent<T extends HTMLElement>
  extends Event {
  target: T
}
