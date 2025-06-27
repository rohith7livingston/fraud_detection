import React, { useState, useEffect } from 'react';
import { FiShield, FiZap, FiCode, FiEye, FiArrowRight } from 'react-icons/fi';
import './LandingPage.css'; // Styles for this component

// A generic icon for the logo
const LogoIcon = ({ className }) => (
    <svg className={className} width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z"></path>
        <path d="M12 22V12"></path>
    </svg>
);

// --- Modal Component for Demo Request ---
const DemoRequestModal = ({ isOpen, onClose }) => {
    if (!isOpen) {
        return null;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = formData.get('email');
        alert(`Thank you! request for ${email} has been noted.`);
        onClose();
    };
    
    // Close modal on overlay click
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-button" onClick={onClose}>×</button>
                <h2 className="modal-title">Request a Demo</h2>
                <p className="modal-subtitle">Our team will get back to you to schedule a personalized demo.</p>
                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label htmlFor="email">Work Email</label>
                        <input type="email" id="email" name="email" placeholder="you@company.com" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Tell us about your needs</label>
                        <textarea id="description" name="description" placeholder="e.g., We need to reduce credit card fraud..." rows="4" required></textarea>
                    </div>
                    <button type="submit" className="button button--primary modal-submit-button">Submit Request</button>
                </form>
            </div>
        </div>
    );
};

// --- Main Landing Page Component ---
// ✨ FIX: The `onLaunch` prop has been removed as it's no longer needed.
const LandingPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Effect for scroll-based animations
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 }
        );

        const targets = document.querySelectorAll('.fade-in-up');
        targets.forEach((target) => observer.observe(target));

        // Cleanup function
        return () => targets.forEach((target) => {
            if (target) observer.unobserve(target);
        });
    }, []);

    return (
        <div className="page-wrapper">
            <header className="navbar">
                <div className="container navbar-container">
                    <a href="#home" className="navbar-logo">
                        <LogoIcon className="navbar-logo-icon" />
                        <span>FraudVision AI</span>
                    </a>
                    {/* ✨ FIX: Updated navbar actions */}
                    <div className="navbar-actions">
                         <button className="button button--primary" onClick={() => setIsModalOpen(true)}>Request a Demo</button>
                         <a href="https://github.com/rohith7livingston/fraud_detection.git" target="_blank" rel="noopener noreferrer" className="button button--secondary">
                            View on GitHub
                         </a>
                    </div>
                </div>
            </header>

            <main>
                <section id="home" className="hero-section section">
                    <div className="container">
                        <h1 className="hero-title fade-in-up">
                            <span className="text-gradient">AI-Powered Fraud Detection</span>.
                            <br/>
                            A Full-Stack Demonstration.
                        </h1>
                        <p className="hero-subtitle fade-in-up">
                            This project showcases a complete system that analyzes transactions, flags potential fraud, and provides clear, human-readable explanations for its decisions.
                        </p>
                        {/* ✨ FIX: Updated hero call-to-action buttons */}
                        <div className="hero-cta-group fade-in-up">
                            <button className="button button--primary button-large" onClick={() => setIsModalOpen(true)}>Request a Demo</button>
                            <a href="https://github.com/rohith-k02" target="_blank" rel="noopener noreferrer" className="button button--secondary button-large">
                                View on GitHub
                            </a>
                        </div>
                    </div>
                </section>

                <section id="features" className="section">
                    <div className="container">
                        <h2 className="section-heading fade-in-up">Core Capabilities</h2>
                        <div className="features-grid">
                            {[
                                { icon: <FiZap />, title: 'Real-Time Analysis', description: 'Detect fraudulent transactions as they happen with sub-second latency using a powerful ML model.' },
                                { icon: <FiEye />, title: 'Explainable AI (XAI)', description: 'Go beyond "fraud" or "not fraud". Understand why a decision was made with clear, feature-based reasoning.' },
                                { icon: <FiShield />, title: 'Manual Review System', description: 'Flagged transactions can be reviewed by human analysts to approve or deny, providing a human-in-the-loop.' },
                                { icon: <FiCode />, title: 'Developer-Friendly Stack', description: 'Built with a modern stack including React, Node.js, Python, and a RESTful API for seamless integration.' },
                            ].map((feature, index) => (
                                <article key={feature.title} className="feature-card fade-in-up" style={{transitionDelay: `${index * 100}ms`}}>
                                    <div className="feature-card-icon">{feature.icon}</div>
                                    <h3 className="feature-card-title">{feature.title}</h3>
                                    <p className="feature-card-description">{feature.description}</p>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="developer" className="developer-section section fade-in-up">
                    <div className="container">
                        <h2 className="section-heading">Robust APIs for Real-Time Fraud Detection</h2>
                        <p className="section-subheading">Integrate our powerful detection engine with just a few lines of code.</p>
                        <div className="terminal">
                            <div className="terminal-header">
                                <div className="terminal-dots"><span></span><span></span><span></span></div>
                                <span className="terminal-title">bash</span>
                            </div>
                            <pre className="terminal-body">
                                <code>
                                    <span className="code-gray"># Send a transaction to the detection endpoint</span>{'\n'}
                                    <span className="code-green">curl</span> -X POST http://localhost:3000/api/process-transaction \<br />
                                    {'  '}-H <span className="code-yellow">'Content-Type: application/json'</span> \<br />
                                    {'  '}-d '{"{"}{'\n'}
                                    {'    '}<span className="code-purple">"amount"</span>: <span className="code-cyan">1250.75</span>,{'\n'}
                                    {'    '}<span className="code-purple">"merchant"</span>: <span className="code-orange">"MERCH808"</span>,{'\n'}
                                    {'    '}<span className="code-purple">"location_from"</span>: <span className="code-orange">"New York"</span>, ...{'\n'}
                                    {'  '}{'}'}'
                                </code>
                            </pre>
                        </div>
                    </div>
                </section>

                <section id="use-cases" className="use-cases-section section fade-in-up">
                    <div className="container">
                        <h2 className="section-heading">Example Use Cases</h2>
                        <div className="use-cases-grid">
                            {[
                                { title: "Preventing Credit Card Fraud at Scale", description: "Learn how our platform can be used to block sophisticated Card-Not-Present (CNP) fraud schemes in e-commerce." },
                                { title: "Flagging Suspicious Peer-to-Peer Transfers", description: "A deep dive into the behavioral patterns that help detect account takeovers and other P2P payment scams." },
                                { title: "Case Study: Reducing False Positives", description: "Discover how better AI explanations can improve customer experience by cutting down on incorrect declines." },
                            ].map(post => (
                                <article key={post.title} className="use-case-card">
                                    <h3 className="use-case-title">{post.title}</h3>
                                    <p className="use-case-description">{post.description}</p>
                                    <a href="#" className="read-more-link">Read More <FiArrowRight /></a>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="cta-banner-section section fade-in-up">
                    <div className="container cta-banner-container">
                        <h2 className="cta-banner-title">Interested in the Technology?</h2>
                        <p className="cta-banner-subtitle">Explore the full source code on GitHub or get in touch for a personalized demo of the platform.</p>
                        {/* ✨ FIX: Updated final CTA button */}
                        <button className="button button-cta" onClick={() => setIsModalOpen(true)}>Request a Demo</button>
                    </div>
                </section>
            </main>

            <footer className="footer">
                <div className="container footer-container">
                    <p className="footer-text">
                        © {new Date().getFullYear()} FraudVision AI. Built by <a href="https://github.com/rohith7livingston/" target="_blank" rel="noopener noreferrer">Rohith Syam Livingston D</a>.
                    </p>
                </div>
            </footer>
            
            <DemoRequestModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};

export default LandingPage; 