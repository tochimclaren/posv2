import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// Define types for the context state, including both message and rate
interface ExchangeRateContextType {
    message: string;
    rate: number;
}

// Define the props type for the provider, including the `children` prop
interface ExchangeRateProviderProps {
    children: ReactNode;
}

// Create the context with default value
const ExchangeRateContext = createContext<ExchangeRateContextType | undefined>(undefined);

// Create a provider component
export const ExchangeRateProvider: React.FC<ExchangeRateProviderProps> = ({ children }) => {
    const [message, setMessage] = useState<string>('Loading...');
    const [rate, setRate] = useState<number>(1489.89);

    useEffect(() => {
        const eventSource = new EventSource('http://localhost:4000/api/exchange');
        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setMessage(data.message);
            setRate(Number(data.rate));
        };
        eventSource.onerror = (error) => {
            console.error('Error receiving SSE:', error);
            eventSource.close();
        };
        return () => {
            eventSource.close();
        };
    }, []);

    return (
        <ExchangeRateContext.Provider value={{ message, rate }}>
            {children}
        </ExchangeRateContext.Provider>
    );
};

// Custom hook to use the exchange rate context
export const useExchangeRate = (): ExchangeRateContextType => {
    const context = useContext(ExchangeRateContext);
    if (!context) {
        throw new Error('useExchangeRate must be used within an ExchangeRateProvider');
    }
    return context;
};
