// jsdom lacks the observers Vuetify's overlays and inputs rely on.
class ObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

globalThis.ResizeObserver ??= ObserverStub
globalThis.IntersectionObserver ??= ObserverStub
