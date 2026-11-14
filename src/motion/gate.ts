/**
 * Intro gate: page hero animations wait here until the (optional) loader has
 * handed over to the page. Opens immediately when no loader is shown.
 */
let open = false
const waiters = new Set<() => void>()

export const introGate = {
  get isOpen() {
    return open
  },
  open() {
    open = true
    waiters.forEach((cb) => cb())
    waiters.clear()
  },
  /** Run `cb` when the gate opens (immediately if already open). Returns a cancel function. */
  whenOpen(cb: () => void): () => void {
    if (open) {
      cb()
      return () => undefined
    }
    waiters.add(cb)
    return () => {
      waiters.delete(cb)
    }
  },
}
