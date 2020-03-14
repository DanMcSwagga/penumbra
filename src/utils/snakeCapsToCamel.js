const snakeCapsToCamel = s => {
  return s.toLowerCase().replace(/_([a-z])/g, g => g[1].toUpperCase())
}

export { snakeCapsToCamel }
