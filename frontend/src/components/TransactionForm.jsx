import React, { useState } from 'react';
import { FiSend } from 'react-icons/fi';

const TransactionForm = ({ onSubmit, isLoading }) => {
    const [formData, setFormData] = useState({
        customer_id: 'CUST404',
        amount: '1250.75',
        merchant: 'MERCH808',
        transaction_type: 'purchase',
        location_from: 'New York',
        location_to: 'London',
        previous_location: 'New York',
        customer_transaction_count: '3',
        payment_method: 'Credit Card',
        merchant_risk_score: '0.85',
        hour_of_day: '2',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const processedData = {
            ...formData,
            amount: parseFloat(formData.amount),
            customer_transaction_count: parseInt(formData.customer_transaction_count, 10),
            merchant_risk_score: parseFloat(formData.merchant_risk_score),
            hour_of_day: parseInt(formData.hour_of_day, 10),
        };
        onSubmit(processedData);
    };

    return (
        <div className="card">
            <h3 className="card-title"><FiSend /> Simulate New Transaction</h3>
            <form onSubmit={handleSubmit} className="transaction-form">
                <div className="form-group">
                    <label>Amount</label>
                    <input type="number" step="0.01" name="amount" value={formData.amount} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Merchant</label>
                    <input type="text" name="merchant" value={formData.merchant} onChange={handleChange} required />
                </div>
                 <div className="form-group">
                    <label>Location (From)</label>
                    <input type="text" name="location_from" value={formData.location_from} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Location (To)</label>
                    <input type="text" name="location_to" value={formData.location_to} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Hour of Day (0-23)</label>
                    <input type="number" name="hour_of_day" value={formData.hour_of_day} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Merchant Risk (0-1)</label>
                    <input type="number" step="0.01" name="merchant_risk_score" value={formData.merchant_risk_score} onChange={handleChange} required />
                </div>
                <button type="submit" className="button button--primary" disabled={isLoading}>
                    <FiSend /> 
                    {isLoading ? 'Processing...' : 'Process Transaction'}
                </button>
            </form>
        </div>
    );
};

export default TransactionForm; 