export const scroller = (id: string) =>
  document.querySelector(`[data-search-id="${id}"]`)?.scrollIntoView()
