import React, {
  createContext,
  PropsWithChildren,
  ReactElement,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'

interface ExampleContextProps {
  showModal: (modal: ReactElement) => void
  hideModal: () => void
}

const ExampleContext = createContext<ExampleContextProps | undefined>(undefined)

export const useExampleProvider = (): ExampleContextProps => {
  const data = useContext<ExampleContextProps | undefined>(ExampleContext)
  if (data === undefined) {
    throw new Error(
      'useExampleProvider must be used within a ExampleProvider tag',
    )
  }
  return data
}

export function ExampleProvider({ children }: PropsWithChildren) {
  const [modal, showModal] = useState<ReactElement | undefined>()

  const hideModal = useCallback(() => {
    showModal(undefined)
  }, [showModal])

  const ExampleProviderValue = useMemo(
    () => ({
      showModal,
      hideModal,
    }),
    [showModal, hideModal],
  )

  return (
    <ExampleContext.Provider value={ExampleProviderValue}>
      {children}
      {modal}
    </ExampleContext.Provider>
  )
}
