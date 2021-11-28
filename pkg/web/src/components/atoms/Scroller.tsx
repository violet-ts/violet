export const Scroller = (id: string) =>
  document.querySelector(`[data-search-id="${id}"]`)?.scrollIntoView()
