/**
 * Prints an object, traversing through its nodes
 * @param {Object} node traversible node
 */
const traversePrint = node => {
  console.group(' <' + node.type + '> ' + node.name)
  node.children.forEach(child => traversePrint(child))
  console.groupEnd()
}

export { traversePrint }
