export function capitalizeStr(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function getInitials(name: string) {
  return name
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase()
}
