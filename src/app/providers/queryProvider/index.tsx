import { queryClient } from '@/shared/config/react-query'
import { QueryClientProvider } from '@tanstack/react-query'
import { PropsWithChildren } from 'react'

export default function QueryProvider(props: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      {props.children}
    </QueryClientProvider>
  )
}
