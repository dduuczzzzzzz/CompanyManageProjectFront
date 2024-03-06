import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useState,
} from 'react'

interface CollapsedContextProps {
  collapsed: boolean,
  setCollapsed: Dispatch<SetStateAction<boolean>>,
}

const CollapsedContext = createContext<CollapsedContextProps | undefined>(undefined)

export const useCollapsedProvider = (): CollapsedContextProps => {
  const data = useContext<CollapsedContextProps | undefined>(CollapsedContext)
  if (data === undefined) {
    throw new Error(
      'useCollapsedProvider must be used within a CollapsedProvider tag',
    )
  }
  return data
}

export function CollapsedProvider({ children }: PropsWithChildren) {
  const [collapsed, setCollapsed] = useState<boolean>(false);

  const CollapsedContextValue = {
    collapsed,
    setCollapsed
  }

  return (
    <CollapsedContext.Provider value={CollapsedContextValue}>
      {children}
    </CollapsedContext.Provider>
  )
}