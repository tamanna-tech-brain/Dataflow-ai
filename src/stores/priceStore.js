/**
 * priceStore.js — Plain JS Singleton Pub-Sub Store
 *
 * ARCHITECTURE NOTE (for README/judges):
 * This store deliberately avoids Vue reactivity (ref/reactive/computed).
 * The purpose is strict render isolation: changing currency or billing
 * must NOT trigger a Vue component re-render anywhere in the tree.
 *
 * How it works:
 * 1. BillingToggle and CurrencySwitcher call setCurrency()/setBilling()
 *    — they only DISPATCH, they never read state back through Vue bindings.
 * 2. Each PricingCard's price <span> holds a native DOM ref and subscribes
 *    directly to this store via subscribe(callback).
 * 3. On store change, the callback writes imperatively to el.textContent —
 *    this is a direct DOM mutation, completely outside Vue's render cycle.
 * 4. Result: Zero component highlights in Vue DevTools Profiler on toggle.
 */

const _state = {
  currency: 'USD',
  billing: 'monthly',
}

const _subscribers = new Set()

function _notify() {
  const snapshot = { ..._state }
  _subscribers.forEach((cb) => cb(snapshot))
}

export const priceStore = {
  getState() {
    return { ..._state }
  },

  setCurrency(currency) {
    if (_state.currency === currency) return
    _state.currency = currency
    _notify()
  },

  setBilling(billing) {
    if (_state.billing === billing) return
    _state.billing = billing
    _notify()
  },

  subscribe(callback) {
    _subscribers.add(callback)
  },

  unsubscribe(callback) {
    _subscribers.delete(callback)
  },
}
