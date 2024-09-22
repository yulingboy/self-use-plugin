interface TimeCalendarType {
  show: boolean
}
interface SearchType {
  show: boolean
  showHistory: boolean
  autoFocus: boolean
  showTranslate: boolean
  currentEngine: string
  searchEngines: engineType[]
  openPageTarget: OpenPageTarget
  suggestion: SearchSuggestion
}
interface NavListType {
  show: boolean
}
interface DockType {
  show: boolean
}

interface engineType {
  id: number | string
  name: string
  description: string
  url: string
}
