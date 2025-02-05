import React from 'react';
import { useExchangeRate } from '../../context/ExchangeContext';

const ExchangeRate: React.FC = () => {
    const { message } = useExchangeRate();

    return (
        <li className="nav-item">{message}</li>
    );
};

export default ExchangeRate;
