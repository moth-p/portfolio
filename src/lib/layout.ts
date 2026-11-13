// Position of an element inside an ancestor from layout offsets, so running entrance transforms don't skew it.
export function offsetWithin(element: HTMLElement, ancestor: HTMLElement) {
  let x = 0
  let y = 0
  let node: HTMLElement | null = element
  while (node && node !== ancestor) {
    x += node.offsetLeft
    y += node.offsetTop
    node = node.offsetParent as HTMLElement | null
  }
  return { x, y }
}
