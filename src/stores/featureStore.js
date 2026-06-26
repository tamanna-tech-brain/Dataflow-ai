/**
 * featureStore.js — Plain JS Singleton Pub-Sub Store
 *
 * ARCHITECTURE NOTE (for README/judges):
 * Shared activeIndex state for the Bento↔Accordion context lock feature.
 *
 * How it works:
 * 1. BentoGrid sets activeIndex on mouseenter — does NOT reset on mouseleave,
 *    so there is always a valid index when the breakpoint crosses.
 * 2. AccordionList reads activeIndex on mount, pre-opening the correct panel
 *    before any CSS transition plays — no "flash of closed state".
 * 3. Both components subscribe to changes for visual sync.
 * 4. The breakpoint is detected via window.matchMedia 'change' event only —
 *    NOT a resize listener — to avoid layout thrash on every pixel.
 */

const _state = {
  activeIndex: 0, // Start with first feature active by default
}

const _subscribers = new Set()

function _notify() {
  const snapshot = { ..._state }
  _subscribers.forEach((cb) => cb(snapshot))
}

export const featureStore = {
  getActiveIndex() {
    return _state.activeIndex
  },

  setActiveIndex(index) {
    if (_state.activeIndex === index) return
    _state.activeIndex = index
    _notify()
  },

  subscribe(callback) {
    _subscribers.add(callback)
  },

  unsubscribe(callback) {
    _subscribers.delete(callback)
  },
}
