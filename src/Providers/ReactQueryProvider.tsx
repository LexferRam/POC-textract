'use client'
import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

interface IReactQueryProviders {
    children: React.ReactNode
}

const ReactQueryProvider = ({ children }: IReactQueryProviders) => {

    const queryClient = new QueryClient()

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}

export default ReactQueryProvider