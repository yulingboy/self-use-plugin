export interface SearchEngineItem {
  id: string
  name: string
  url: string
  description: string
}

export enum SearchSuggestion {
  none,
  baidu,
  bing,
  google
}
