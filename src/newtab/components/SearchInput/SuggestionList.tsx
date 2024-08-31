import React from "react"

type SuggestionListProps = {
  suggestions: string[]
  onSuggestionClick: (text: string) => void
  currentText: string
}

const SuggestionList: React.FC<SuggestionListProps> = ({ suggestions, onSuggestionClick, currentText }) => {
  return (
    <ul className="absolute w-full overflow-hidden rounded-md bg-white">
      {suggestions.map((suggestion, index) => (
        <li
          key={index}
          className={`box-border flex h-10 w-full cursor-pointer items-center px-4 text-base hover:bg-slate-300 ${currentText === suggestion ? "bg-slate-300" : "bg-transparent"}`}
          onClick={() => onSuggestionClick(suggestion)}>
          {suggestion}
        </li>
      ))}
    </ul>
  )
}

export default SuggestionList
