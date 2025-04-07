export function formatDate(date: Date | string, format = "MM/DD/YYYY"): string {
  const d = new Date(date)

  const day = d.getDate().toString().padStart(2, "0")
  const month = (d.getMonth() + 1).toString().padStart(2, "0")
  const year = d.getFullYear()

  switch (format) {
    case "MM/DD/YYYY":
      return `${month}/${day}/${year}`
    case "DD/MM/YYYY":
      return `${day}/${month}/${year}`
    case "YYYY-MM-DD":
      return `${year}-${month}-${day}`
    case "DD-MM-YYYY":
      return `${day}-${month}-${year}`
    case "YYYY/MM/DD":
      return `${year}/${month}/${day}`
    default:
      return `${month}/${day}/${year}`
  }
}

export function formatDateTime(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleString()
}

export function getRelativeTime(date: Date | string): string {
  const d = new Date(date)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffSec = Math.round(diffMs / 1000)
  const diffMin = Math.round(diffSec / 60)
  const diffHour = Math.round(diffMin / 60)
  const diffDay = Math.round(diffHour / 24)

  if (diffSec < 60) {
    return `${diffSec} second${diffSec !== 1 ? "s" : ""} ago`
  } else if (diffMin < 60) {
    return `${diffMin} minute${diffMin !== 1 ? "s" : ""} ago`
  } else if (diffHour < 24) {
    return `${diffHour} hour${diffHour !== 1 ? "s" : ""} ago`
  } else if (diffDay < 30) {
    return `${diffDay} day${diffDay !== 1 ? "s" : ""} ago`
  } else {
    return formatDate(d)
  }
}

