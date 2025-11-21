import { useEffect, useCallback } from 'react';
import axios from 'axios';
import { useStockStore } from '../stores/stockStore';
import { calculateBubbleProperties } from '../utils/physics';
import type { StockData } from '../utils/physics';

const API_BASE_URL = 'http://localhost:3001/api';
const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

export function useStockData() {
    const {
        setStocks,
        setIsLoading,
        setError,
        filterMode,
    } = useStockStore();

    const fetchStocks = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            let endpoint = `${API_BASE_URL}/stocks`;

            // Apply filter
            if (filterMode === 'gainers') {
                endpoint = `${API_BASE_URL}/stocks/gainers`;
            } else if (filterMode === 'most-traded') {
                endpoint = `${API_BASE_URL}/stocks/most-traded`;
            } else if (filterMode === 'best-value') {
                endpoint = `${API_BASE_URL}/stocks/best-value`;
            }

            const response = await axios.get(endpoint);

            if (response.data.success) {
                const stockData: StockData[] = response.data.data;
                const bubblesWithProperties = calculateBubbleProperties(stockData);
                setStocks(bubblesWithProperties);
            } else {
                throw new Error('Failed to fetch stock data');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
            setError(errorMessage);
            console.error('Error fetching stock data:', err);
        } finally {
            setIsLoading(false);
        }
    }, [filterMode, setStocks, setIsLoading, setError]);

    // Initial fetch and auto-refresh
    useEffect(() => {
        fetchStocks();

        const interval = setInterval(fetchStocks, REFRESH_INTERVAL);

        return () => clearInterval(interval);
    }, [fetchStocks]);

    return { fetchStocks };
}
