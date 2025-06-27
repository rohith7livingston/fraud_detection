import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import * as api from './services/api';
import TransactionList from './components/TransactionList';
import TransactionDetail from './components/TransactionDetail';
import TransactionForm from './components/TransactionForm';
import './Dashboard.css';

const Dashboard = () => {
    const [transactions, setTransactions] = useState([]);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [isLoadingList, setIsLoadingList] = useState(true);
    const [isDetailLoading, setIsDetailLoading] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');

    const fetchTransactions = useCallback(async () => {
        setIsLoadingList(true);
        try {
            setError('');
            const response = await api.getTransactions();
            setTransactions(response.data.transactions || []);
        } catch (err) {
            console.error("Error fetching transactions:", err);
            setError('Failed to load transactions. Is the backend server running?');
            setTransactions([]);
        } finally {
            setIsLoadingList(false);
        }
    }, []);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    const handleSelectTransaction = async (id) => {
        if (selectedTransaction?.selected_transaction?.id === id) return;

        setIsDetailLoading(true);
        setSelectedTransaction(null);

        try {
            const response = await api.getTransactionDetails(id);
            setSelectedTransaction(response.data);
            setError('');
        } catch (err) {
            console.error("Error fetching transaction details:", err);
            toast.error(`Failed to load details for transaction #${id}.`);
        } finally {
            setIsDetailLoading(false);
        }
    };

    const handleNewTransaction = async (transactionData) => {
        setIsProcessing(true);
        const toastId = toast.loading('Processing new transaction...');
        try {
            const response = await api.processNewTransaction(transactionData);
            toast.success(`Transaction processed! AI: ${response.data.fraud_flag === 1 ? 'Fraud Risk' : 'Clean'}`, { id: toastId });
            await fetchTransactions(); // Refresh the list
        } catch (err) {
            const errorMsg = err.response?.data?.error || 'Failed to process transaction.';
            console.error("Error processing transaction:", err);
            toast.error(errorMsg, { id: toastId });
        } finally {
            setIsProcessing(false);
        }
    };
    
    const handleUpdateStatus = async (id, status) => {
        const toastId = toast.loading(`Marking transaction as ${status}...`);
        try {
            await api.updateTransactionStatus(id, status);
            toast.success(`Transaction #${id} marked as ${status}.`, { id: toastId });
            
            await fetchTransactions();
            if (selectedTransaction?.selected_transaction?.id === id) {
                // Re-fetch details to show the updated status immediately
                await handleSelectTransaction(id);
            }
        } catch (err) {
             console.error("Error updating status:", err);
             toast.error(`Failed to update status for transaction #${id}.`, { id: toastId });
        }
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>AI Fraud Detection Dashboard</h1>
                <p>Real-time monitoring and analysis of financial transactions</p>
            </header>
            
            {error && <div className="error-banner">{error}</div>}

            <div className="dashboard-grid">
                <div className="grid-col-1">
                    <TransactionForm 
                        onSubmit={handleNewTransaction} 
                        isLoading={isProcessing} 
                    />
                    <TransactionList 
                        transactions={transactions} 
                        onSelectTransaction={handleSelectTransaction}
                        selectedId={selectedTransaction?.selected_transaction?.id}
                        isLoading={isLoadingList}
                    />
                </div>
                <div className="grid-col-2">
                    <TransactionDetail 
                        data={selectedTransaction} 
                        onUpdateStatus={handleUpdateStatus}
                        isLoading={isDetailLoading}
                    />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;