import { useState } from 'react'

export function useSelection(init: React.Key | null) {
  const [selectionKey, setSelectionKey] = useState<React.Key | null>(init)

  const onSelectChange = (newSelection: React.Key | null) => {
    setSelectionKey(newSelection)
  }

  return { selectionKey, onChange: onSelectChange }
}
