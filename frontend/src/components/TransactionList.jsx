import React from 'react';
import { FiCheckCircle, FiXCircle, FiAlertTriangle, FiInbox, FiClock } from 'react-icons/fi';
import Spinner from './Spinner';

const TransactionList = ({ transactions, onSelectTransaction, selectedId, isLoading }) => {

    const formatDate = (dateString) => {
        const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true };
        return new Date(dateString).toLocaleTimeString('en-US', options);
    };
    
    const getStatusInfo = (status, fraudFlag) => {
        if (status === 'clean') return { icon: <FiCheckCircle />, className: 'clean', text: 'Clean' };
        if (status === 'fraud') return { icon: <FiXCircle />, className: 'fraud', text: 'Fraud' };
        if (fraudFlag === 1) return { icon: <FiAlertTriangle />, className: 'fraud', text: 'Pending' }; // Pending, but high risk
        return { icon: <FiClock />, className: 'pending', text: 'Pending' };
    };

    if (isLoading) {
        return <div className="card"><Spinner /></div>;
    }

    return (
        <div className="card">
            <h3 className="card-title"><FiInbox /> Transaction Queue</h3>
            <ul className="transaction-list">
                {transactions.length > 0 ? (
                    transactions.map(tx => {
                        const statusInfo = getStatusInfo(tx.status, tx.fraud_flag);
                        return (
                            <li 
                                key={tx.id} 
                                onClick={() => onSelectTransaction(tx.id)}
                                className={tx.id === selectedId ? 'selected' : ''}
                            >
                                <div className={`status-icon ${statusInfo.className}`}>{statusInfo.icon}</div>
                                <div className="tx-info">
                                    <strong>${parseFloat(tx.amount).toFixed(2)} <span className="light-text">to</span> {tx.merchant}</strong>
                                    <span className="tx-time">{formatDate(tx.timestamp)}</span>
                                </div>
                                <div className={`status-badge ${statusInfo.className}`}>
                                    {statusInfo.text}
                                </div>
                            </li>
                        )
                    })
                ) : (
                    <p className="empty-state">No transactions found.</p>
                )}
            </ul>
        </div>
    );
};

export default TransactionList; 