const SESSION_EXPIRED_EVENT = 'session-expired'

let modalShown = false

export function triggerSessionExpired() {
  if (typeof window === 'undefined') return
  if (modalShown) return
  modalShown = true
  window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT))
}

export function onSessionExpired(handler: () => void) {
  if (typeof window === 'undefined') return () => {}
  const listener = () => handler()
  window.addEventListener(SESSION_EXPIRED_EVENT, listener)
  return () => window.removeEventListener(SESSION_EXPIRED_EVENT, listener)
}

export function resetSessionExpiredFlag() {
  modalShown = false
}

export function decodeJWTExp(token: string): number | null {
  try {
    const payload = token.split('.')[1]
    const decoded = JSON.parse(atob(payload))
    return typeof decoded.exp === 'number' ? decoded.exp : null
  } catch {
    return null
  }
}
