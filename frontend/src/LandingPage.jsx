import React, { useState, useEffect } from 'react';
import './LandingPage.css';

// --- Helper Components (for clean JSX) ---

// A generic placeholder for icons
const Icon = ({ name, className }) => (
  <svg className={`icon ${className}`} viewBox="0 0 24 24" width="32" height="32">
    <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm6 9.09c0 4.07-2.83 7.67-6.5 8.65A7.83 7.83 0 016 11.09V6.3l6-2.25 6 2.25v4.84z" fill="currentColor" />
    <title>{name} icon</title>
  </svg>
);


// --- Main Landing Page Component ---

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
      },
      { threshold: 0.1 }
    );

    const targets = document.querySelectorAll('.fade-in-section');
    targets.forEach((target) => observer.observe(target));

    return () => targets.forEach((target) => observer.unobserve(target));
  }, []);

  return (
    <div className="page-wrapper">
      {/* ===== HEADER NAVIGATION ===== */}
      <header className="navbar">
        <div className="container navbar__container">
          <a href="#home" className="navbar__logo">
            <Icon name="FraudVision Logo" className="navbar__logo-icon" />
            <span>FraudVision AI</span>
          </a>
          <nav className={`navbar__nav ${isMenuOpen ? 'is-open' : ''}`}>
            <a href="#features" className="navbar__link">Features</a>
            <a href="#use-cases" className="navbar__link">Use Cases</a>
            <a href="#developer" className="navbar__link">Developers</a>
            <a href="#company" className="navbar__link">Company</a>
          </nav>
          <div className="navbar__actions">
            <button className="button button--primary">Request a Demo</button>
            <button
              className="navbar__menu-toggle"
              aria-label="Toggle menu"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* ===== HERO SECTION ===== */}
        <section id="home" className="hero-section section">
          <div className="container hero-section__container">
            <div className="hero-section__content">
              <h1 className="hero-section__title">
                <span className="text-gradient">AI-Powered Fraud Detection</span> for Modern Finance
              </h1>
              <p className="hero-section__subtitle">
                FraudVision AI delivers explainable, real-time fraud analysis based on transaction patterns, behavior modeling, and anomaly detection.
              </p>
              <div className="hero-section__cta-group">
                <button className="button button--primary button--large">Request a Demo</button>
                <button className="button button--secondary button--large">Explore Use Cases</button>
              </div>
            </div>
            <div className="hero-section__image-wrapper">
              <img
                src="https://placehold.co/600x500/1a1a2e/46E8D8?text=Secure+Data+Network"
                alt="AI-based data network visual for cyber security"
                className="hero-section__image"
              />
            </div>
          </div>
        </section>

        {/* ===== TRUSTED BY SECTION ===== */}
        <section id="trusted-by" className="trusted-by-section section fade-in-section">
          <div className="container">
            <h2 className="section__subheading">Trusted by Financial Leaders Worldwide</h2>
            <div className="trusted-by-section__logos">
              <div className="logo-placeholder">FinTrust Bank</div>
              <div className="logo-placeholder">ZensurePay</div>
              <div className="logo-placeholder">NovaBank</div>
              <div className="logo-placeholder">Credly</div>
              <div className="logo-placeholder">Apex Finance</div>
            </div>
          </div>
        </section>

        {/* ===== PRODUCT CARDS SECTION ===== */}
        <section id="features" className="products-section section fade-in-section">
          <div className="container">
            <h2 className="section__heading">Monitor. Detect. Prevent — in Real Time.</h2>
            <div className="products-section__grid">
              {[
                { icon: 'Monitoring', title: 'Real-time Transaction Monitoring', description: 'Detect fraudulent transactions as they happen with sub-second latency.' },
                { icon: 'Anomaly', title: 'Behavioral Anomaly Detection', description: 'Flag outliers in spending behavior using sophisticated machine learning models.' },
                { icon: 'ExplainableAI', title: 'Explainable AI (XAI)', description: 'Transparent ML models provide clear reasoning for audit-ready results.' },
                { icon: 'API', title: 'Scalable APIs & SDKs', description: 'Seamlessly integrate our powerful fraud detection engine with your existing backend stack.' },
              ].map(product => (
                <article key={product.title} className="product-card">
                  <div className="product-card__icon">
                    <Icon name={product.icon} />
                  </div>
                  <h3 className="product-card__title">{product.title}</h3>
                  <p className="product-card__description">{product.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ===== STATS SECTION ===== */}
        <section id="stats" className="stats-section section fade-in-section">
          <div className="container stats-section__container">
            <div className="stat-item">
              <span className="stat-item__number">99.99%</span>
              <p className="stat-item__label">Accuracy in Detection</p>
            </div>
            <div className="stat-item">
              <span className="stat-item__number">100M+</span>
              <p className="stat-item__label">Transactions Processed Daily</p>
            </div>
            <div className="stat-item">
              <span className="stat-item__number">500+</span>
              <p className="stat-item__label">Banks & Fintechs Onboarded</p>
            </div>
          </div>
        </section>

        {/* ===== FEATURES WITH TEXT + IMAGE ===== */}
        <section className="features-section section">
            <div className="container feature-item fade-in-section">
                <div className="feature-item__text-content">
                    <h2 className="section__heading">Explainable Models for Compliance</h2>
                    <p>Our "white-box" AI approach demystifies fraud scoring. Get clear, human-readable explanations for every decision, ensuring you're always ready for regulatory audits.</p>
                </div>
                <div className="feature-item__image-wrapper">
                    <img src="https://placehold.co/500x400/1a1a2e/e0e0e0?text=AI+Decision+Tree" alt="Diagram of an explainable AI model" />
                </div>
            </div>
            <div className="container feature-item feature-item--reversed fade-in-section">
                <div className="feature-item__text-content">
                    <h2 className="section__heading">Powerful Custom Rule Engines</h2>
                    <p>Go beyond our AI models. Build, test, and deploy custom fraud rules in minutes using our intuitive interface to address your unique business logic and emerging threats.</p>
                </div>
                <div className="feature-item__image-wrapper">
                    <img src="https://placehold.co/500x400/1a1a2e/e0e0e0?text=Rules+Dashboard" alt="Screenshot of the custom rule engine dashboard" />
                </div>
            </div>
        </section>

        {/* ===== DEVELOPER-FIRST SECTION ===== */}
        <section id="developer" className="developer-section section fade-in-section">
          <div className="container">
            <h2 className="section__heading">Robust APIs for Real-Time Fraud Detection</h2>
            <div className="terminal">
              <div className="terminal__header">
                <div className="terminal__dots">
                  <span></span><span></span><span></span>
                </div>
                <span className="terminal__title">bash</span>
              </div>
              <pre className="terminal__body">
                <code>
                  <span className="code-gray"># Send a transaction to the detection endpoint</span>{'\n'}
                  <span className="code-green">curl</span> -X POST https://api.fraudvision.ai/detect \<br />
                  {'  '}-H <span className="code-orange">"Authorization: Bearer YOUR_API_KEY"</span> \<br />
                  {'  '}-d '{"{"}{'\n'}
                  {'    '}<span className="code-orange">"amount"</span>: <span className="code-lightblue">5000</span>,{'\n'}
                  {'    '}<span className="code-orange">"merchant_id"</span>: <span className="code-orange">"XYZ_STORE"</span>,{'\n'}
                  {'    '}<span className="code-orange">"user_location"</span>: <span className="code-orange">"Delhi"</span>{'\n'}
                  {'  '}{'}'}'
                </code>
              </pre>
            </div>
          </div>
        </section>
        
        {/* ===== USE CASES / BLOG SECTION ===== */}
        <section id="use-cases" className="products-section section fade-in-section" style={{backgroundColor: 'var(--color-background)'}}>
          <div className="container">
            <h2 className="section__heading">Insights from the Front Lines of Fraud</h2>
            <div className="products-section__grid">
              {[
                { title: "Preventing Credit Card Fraud at Scale", description: "Learn how top banks leverage our platform to block sophisticated CNP fraud schemes." },
                { title: "How AI Flags Insider Fraud in Corporate Spending", description: "A deep dive into the behavioral patterns that help detect internal threats before they escalate." },
                { title: "Case Study: Reducing False Positives by 40%", description: "Discover how FinTrust Bank improved customer experience by cutting down incorrect declines." },
              ].map(post => (
                <article key={post.title} className="product-card">
                  <h3 className="product-card__title">{post.title}</h3>
                  <p className="product-card__description">{post.description}</p>
                  <a href="#" className="read-more-link">Read More →</a>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ===== FINAL CTA BANNER ===== */}
        <section className="cta-banner-section section fade-in-section">
          <div className="container cta-banner-section__container">
            <h2 className="cta-banner-section__title">See FraudVision AI in Action</h2>
            <p className="cta-banner-section__subtitle">Secure your revenue and build customer trust with the industry's leading fraud detection platform.</p>
            <button className="button button--primary button--large">Get Started Today</button>
          </div>
        </section>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="footer">
        <div className="container footer__container">
          <div className="footer__grid">
            <div className="footer__column footer__column--about">
              <h4 className="footer__heading">FraudVision AI</h4>
              <p>AI-Powered Fraud Detection at Scale. Monitor. Detect. Prevent.</p>
            </div>
            <div className="footer__column">
              <h4 className="footer__heading">Product</h4>
              <ul className="footer__links">
                <li><a href="#">Overview</a></li>
                <li><a href="#">Features</a></li>
                <li><a href="#">APIs</a></li>
                <li><a href="#">Case Studies</a></li>
              </ul>
            </div>
            <div className="footer__column">
              <h4 className="footer__heading">Resources</h4>
              <ul className="footer__links">
                <li><a href="#">Blog</a></li>
                <li><a href="#">Help Center</a></li>
                <li><a href="#">Documentation</a></li>
                <li><a href="#">System Status</a></li>
              </ul>
            </div>
             <div className="footer__column">
              <h4 className="footer__heading">Company</h4>
              <ul className="footer__links">
                <li><a href="#">About Us</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Partners</a></li>
                <li><a href="#">Contact Us</a></li>
              </ul>
            </div>
          </div>
          <div className="footer__bottom">
            <p>© {new Date().getFullYear()} FraudVision AI. All rights reserved.</p>
            <div className="footer__socials">
              <a href="#" aria-label="Twitter"><Icon name="Twitter"/></a>
              <a href="#" aria-label="LinkedIn"><Icon name="LinkedIn"/></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;