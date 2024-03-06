export function truncate(value: string, length: number) {
  if (value.length > 0) {
    if (value?.length <= length) return value

    const index = value.indexOf(' ', length)
    if (index === -1) {
      return `${value.substring(0, length)}...`
    } else {
      return `${value.substring(0, index)}...`
    }
  }
  return ''
}
