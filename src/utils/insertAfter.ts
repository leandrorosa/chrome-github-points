export default function insertAfter($ref, $newNode) {
  $ref.parentNode.insertBefore($newNode, $ref.nextSibling)
}
