import React from 'react';
import { 
    FiThumbsUp, FiThumbsDown, FiArrowRight, FiUser, FiMapPin, 
    FiCreditCard, FiBarChart2, FiCpu, FiMessageSquare, FiAlertTriangle, FiCheckCircle 
} from 'react-icons/fi';
import Spinner from './Spinner';

const TransactionDetail = ({ data, onUpdateStatus, isLoading }) => {
    if (isLoading) {
        return <div className="card detail-card"><Spinner /></div>
    }

    if (!data) {
        return (
            <div className="card detail-card">
                <div className="empty-state-detail">
                    <FiBarChart2 size={48} />
                    <h3>Awaiting Selection</h3>
                    <p>Select a transaction from the list to see its details and AI analysis.</p>
                </div>
            </div>
        );
    }
    
    const { selected_transaction: tx } = data;

    // ✨ FIX: Parse the explanation from the JSON string stored in the database.
    let aiExplanation = [];
    try {
        if (tx.explanation && typeof tx.explanation === 'string') {
            aiExplanation = JSON.parse(tx.explanation);
        }
    } catch (e) {
        console.error("Failed to parse AI explanation:", e);
        // Fallback to an empty array if parsing fails
        aiExplanation = [];
    }

    const StatCard = ({ label, value, icon, className = '' }) => (
        <div className={`stat-card ${className}`}>
            <div className="stat-icon">{icon}</div>
            <div className="stat-info">
                <span>{label}</span>
                <strong>{value}</strong>
            </div>
        </div>
    );

    return (
        <div className="card detail-card">
            <h3 className="card-title">Analysis for Transaction #{tx.id}</h3>
            
            <div className="stats-grid">
                <StatCard label="Amount" value={`$${parseFloat(tx.amount).toFixed(2)}`} icon={<FiBarChart2 />} />
                <StatCard 
                    label="AI Prediction" 
                    value={tx.fraud_flag === 1 ? 'Fraud Risk' : 'Clean'} 
                    icon={tx.fraud_flag === 1 ? <FiAlertTriangle /> : <FiCheckCircle />}
                    className={tx.fraud_flag === 1 ? 'fraud' : 'clean'}
                />
            </div>

            <div className="detail-section">
                <h4><FiMessageSquare /> Transaction Info</h4>
                <ul>
                    <li><FiUser /> <span><strong>Customer:</strong> {tx.customer_id}</span></li>
                    <li><FiMapPin /> <span><strong>Location:</strong> {tx.location_from} <FiArrowRight size={14} /> {tx.location_to}</span></li>
                    <li><FiCreditCard /> <span><strong>Payment:</strong> {tx.payment_method}</span></li>
                </ul>
            </div>

            {/* ✨ NEW: Richer AI explanation rendering */}
            <div className="detail-section ai-explanation">
                <h4><FiCpu /> AI Reasoning</h4>
                {aiExplanation.length > 0 ? (
                    <ul>
                        {aiExplanation.map((reason, i) => {
                           const isPositive = reason.weight > 0; // Positive weight contributes to fraud risk
                           return (
                               <li key={i} className={isPositive ? 'reason-fraud' : 'reason-clean'}>
                                   {reason.feature}
                               </li>
                           )
                        })}
                    </ul>
                ) : <p>No detailed explanation available.</p>}
            </div>
            
            <div className="detail-section">
                {tx.status === 'pending' ? (
                    <div className="review-actions">
                        <h4>Manual Review Required</h4>
                        <p>Is the AI prediction correct? Please verify this transaction.</p>
                        <div className="button-group">
                            <button className="button button-approve" onClick={() => onUpdateStatus(tx.id, 'clean')}>
                                <FiThumbsUp /> Approve (Clean)
                            </button>
                            <button className="button button-deny" onClick={() => onUpdateStatus(tx.id, 'fraud')}>
                                <FiThumbsDown /> Deny (Fraud)
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="review-complete">
                        <h4>Review Complete</h4>
                        <p>This transaction has been manually verified as <strong>{tx.status}</strong>.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TransactionDetail;