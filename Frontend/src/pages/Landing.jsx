import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FaExclamationTriangle,
  FaTools,
  FaCheckCircle,
  FaChartLine,
  FaBell,
  FaUserCheck,
  FaArrowRight,
  FaCheck
} from "react-icons/fa";
import ScrollToBottom from "../components/ScrollToBottom";

const Landing = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // read auth state once at top-level (hooks must be called unconditionally)
  const { token, user } = useSelector((state) => state.auth);

  const features = [
    {
      icon: <FaExclamationTriangle className="feature-icon" />,
      title: "Quick Complaint Submission",
      description: "Raise complaints instantly with a few clicks. Upload images and provide detailed descriptions."
    },
    {
      icon: <FaTools className="feature-icon" />,
      title: "Efficient Management",
      description: "Authorities can track, manage, and resolve complaints efficiently from a centralized dashboard."
    },
    {
      icon: <FaCheckCircle className="feature-icon" />,
      title: "Real-time Status Updates",
      description: "Get instant notifications when your complaint status changes. Track progress in real-time."
    },
    {
      icon: <FaChartLine className="feature-icon" />,
      title: "Analytics & Reports",
      description: "Comprehensive analytics help authorities identify recurring issues and improve services."
    }
  ];

  const benefits = [
    "Easy to use interface",
    "Fast complaint resolution",
    "Transparent tracking system",
    "Mobile-friendly design",
    "Secure and reliable",
    "24/7 availability"
  ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center min-h-screen">
            <div className={`lg:w-1/2 hero-content ${isVisible ? 'fade-in-up' : ''}`}>
              <div className="hero-badge mb-4">
                <FaExclamationTriangle className="me-2" />
                <span>Hostel Complaint Management System</span>
              </div>
              <h1 className="hero-title">
                Duvidha Ki <span className="gradient-text">Suvidha</span>
              </h1>
              <p className="hero-subtitle">
                Streamline your hostel complaint management. Students can raise complaints seamlessly,
                and authorities can resolve them efficiently.
              </p>
              <div className="hero-buttons mt-8 flex flex-wrap gap-4">
                {!token ? (
                  <>
                    <Link to="/signup" className="hero-btn-primary">
                      Get Started
                      <FaArrowRight className="ml-2 inline" />
                    </Link>
                    <Link to="/login" className="hero-btn-outline">
                      Sign In
                    </Link>
                  </>
                ) : (
                  <Link to={user?.role === 'maintainer' ? '/admin' : '/dashboard'} className="hero-btn-primary">
                    {user?.role === 'maintainer' ? 'Go to Admin Panel' : 'Go to Dashboard'}
                    <FaArrowRight className="ml-2 inline" />
                  </Link>
                )}
              </div>
            </div>
            <div className={`lg:w-1/2 hero-visual ${isVisible ? 'fade-in' : ''}`}>
              <div className="hero-card">
                <div className="card-animation">
                  <FaExclamationTriangle className="main-icon" />
                  <div className="floating-elements">
                    <div className="floating-circle circle-1"></div>
                    <div className="floating-circle circle-2"></div>
                    <div className="floating-circle circle-3"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-title">Why Choose Us?</h2>
            <p className="section-subtitle">Everything you need to manage hostel complaints effectively</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index}>
                <div className={`feature-card ${isVisible ? 'fade-in-up' : ''}`} style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="feature-icon-wrapper">
                    {feature.icon}
                  </div>
                  <h4 className="feature-title">{feature.title}</h4>
                  <p className="feature-description">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <h2 className="section-title mb-4">All the features you need</h2>
              <div className="benefits-list">
                {benefits.map((benefit, index) => (
                  <div key={index} className={`benefit-item ${isVisible ? 'fade-in-left' : ''}`} style={{ animationDelay: `${index * 0.1}s` }}>
                    <FaCheck className="benefit-check" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                {!token ? (
                  <Link to="/signup" className="github-btn-primary inline-flex items-center">
                    Start Managing Complaints
                    <FaArrowRight className="ml-2" />
                  </Link>
                ) : (
                  <Link to={user?.role === 'maintainer' ? '/admin' : '/dashboard'} className="github-btn-primary inline-flex items-center">
                    {user?.role === 'maintainer' ? 'Go to Admin Panel' : 'Open Dashboard'}
                    <FaArrowRight className="ml-2" />
                  </Link>
                )}
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="benefits-visual">
                <div className="stats-card">
                  <div className="stat-item">
                    <FaBell className="stat-icon" />
                    <div>
                      <div className="stat-number">Real-time</div>
                      <div className="stat-label">Notifications</div>
                    </div>
                  </div>
                  <div className="stat-item">
                    <FaUserCheck className="stat-icon" />
                    <div>
                      <div className="stat-number">Role-based</div>
                      <div className="stat-label">Access Control</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section py-20">
        <div className="container mx-auto px-4">
          <div className="cta-card text-center max-w-3xl mx-auto">
            <h2 className="cta-title mb-4">Ready to get started?</h2>
            <p className="cta-subtitle mb-8">
              Join hundreds of students and authorities using Duvidha Ki Suvidha to manage complaints efficiently.
            </p>
            {!token ? (
              <Link to="/signup" className="cta-button inline-flex items-center">
                Create Your Account
                <FaArrowRight className="ml-2" />
              </Link>
            ) : (
              <Link to={user?.role === 'maintainer' ? '/admin' : '/dashboard'} className="cta-button inline-flex items-center">
                {user?.role === 'maintainer' ? 'Go to Admin Panel' : 'Open Dashboard'}
                <FaArrowRight className="ml-2" />
              </Link>
            )}
          </div>
        </div>
      </section>

      <ScrollToBottom />

      <style>{`
        .landing-page {
          overflow-x: hidden;
          background: #0d1117;
          color: #c9d1d9;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
        }

        /* Hero Section */
        .hero-section {
          background: #0d1117;
          color: #c9d1d9;
          position: relative;
          overflow: hidden;
          border-bottom: 1px solid #30363d;
        }

        .hero-section::before {
          content: '';
          position: absolute;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(88, 166, 255, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
          animation: float 20s infinite linear;
          opacity: 0.2;
        }

        @keyframes float {
          0% { transform: translate(0, 0); }
          100% { transform: translate(-50px, -50px); }
        }

        .hero-content {
          position: relative;
          z-index: 1;
          padding: 2rem 0;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          background: #161b22;
          border: 1px solid #30363d;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-size: 0.875rem;
          color: #8b949e;
          animation: fadeIn 0.6s ease-out;
        }

        .hero-title {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
          font-weight: 600;
          font-size: 4rem;
          line-height: 1.2;
          margin: 1.5rem 0;
          letter-spacing: -0.02em;
          color: #f0f6fc;
        }

        .gradient-text {
          color: #58a6ff;
        }

        .hero-subtitle {
          font-size: 1.25rem;
          line-height: 1.6;
          color: #8b949e;
          max-width: 600px;
          font-weight: 400;
        }

        .hero-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .hero-btn-primary {
          padding: 0.75rem 2rem;
          font-weight: 500;
          border-radius: 6px;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          background: #238636;
          border: 1px solid #238636;
          color: #ffffff;
          text-decoration: none;
        }

        .hero-btn-primary:hover {
          background: #2ea043;
          border-color: #2ea043;
          transform: translateY(-1px);
        }

        .hero-btn-outline {
          padding: 0.75rem 2rem;
          font-weight: 500;
          border-radius: 6px;
          border: 1px solid #30363d;
          background: transparent;
          color: #c9d1d9;
          transition: all 0.2s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
        }

        .hero-btn-outline:hover {
          background: #21262d;
          border-color: #30363d;
          color: #f0f6fc;
        }

        .hero-visual {
          position: relative;
          z-index: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 500px;
        }

        .hero-card {
          position: relative;
          width: 100%;
          max-width: 500px;
        }

        .card-animation {
          position: relative;
          width: 100%;
          height: 400px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .main-icon {
          font-size: 12rem;
          color: #58a6ff;
          animation: pulse 3s ease-in-out infinite;
          z-index: 2;
          position: relative;
          opacity: 0.8;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.1); opacity: 1; }
        }

        .floating-elements {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
        }

        .floating-circle {
          position: absolute;
          border-radius: 50%;
          background: rgba(88, 166, 255, 0.1);
          border: 1px solid rgba(88, 166, 255, 0.2);
        }

        .circle-1 {
          width: 200px;
          height: 200px;
          top: 10%;
          left: 10%;
          animation: float-circle 6s ease-in-out infinite;
        }

        .circle-2 {
          width: 150px;
          height: 150px;
          top: 60%;
          right: 10%;
          animation: float-circle 8s ease-in-out infinite reverse;
        }

        .circle-3 {
          width: 100px;
          height: 100px;
          bottom: 10%;
          left: 30%;
          animation: float-circle 7s ease-in-out infinite;
        }

        @keyframes float-circle {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(20px, -20px) rotate(180deg); }
        }

        /* Features Section */
        .features-section {
          background: #0d1117;
          padding: 5rem 0;
          border-bottom: 1px solid #30363d;
        }

        .section-title {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
          font-weight: 600;
          font-size: 2.5rem;
          color: #f0f6fc;
          margin-bottom: 1rem;
        }

        .section-subtitle {
          font-size: 1.1rem;
          color: #8b949e;
          max-width: 600px;
          margin: 0 auto;
        }

        .feature-card {
          background: #161b22;
          border-radius: 6px;
          padding: 2rem;
          height: 100%;
          transition: all 0.2s ease;
          border: 1px solid #30363d;
        }

        .feature-card:hover {
          border-color: #58a6ff;
          transform: translateY(-4px);
        }

        .feature-icon-wrapper {
          width: 64px;
          height: 64px;
          border-radius: 6px;
          background: #21262d;
          border: 1px solid #30363d;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
        }

        .feature-icon {
          font-size: 2rem;
          color: #58a6ff;
        }

        .feature-title {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
          font-weight: 600;
          font-size: 1.25rem;
          color: #f0f6fc;
          margin-bottom: 1rem;
        }

        .feature-description {
          color: #8b949e;
          line-height: 1.6;
          font-size: 0.95rem;
        }

        /* Benefits Section */
        .benefits-section {
          background: #0d1117;
          padding: 5rem 0;
          border-bottom: 1px solid #30363d;
        }

        .benefits-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .benefit-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-size: 1.1rem;
          color: #c9d1d9;
          font-weight: 400;
        }

        .benefit-check {
          color: #238636;
          font-size: 1.5rem;
          flex-shrink: 0;
        }

        .github-btn-primary {
          background: #238636;
          border: 1px solid #238636;
          color: #ffffff;
          border-radius: 6px;
          font-weight: 500;
          padding: 0.75rem 2rem;
          transition: all 0.2s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
        }

        .github-btn-primary:hover {
          background: #2ea043;
          border-color: #2ea043;
          transform: translateY(-1px);
        }

        .benefits-visual {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .stats-card {
          background: #161b22;
          border: 1px solid #30363d;
          border-radius: 6px;
          padding: 3rem;
          color: #c9d1d9;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-item:last-child {
          margin-bottom: 0;
        }

        .stat-icon {
          font-size: 3rem;
          color: #58a6ff;
        }

        .stat-number {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
          font-size: 1.5rem;
          font-weight: 600;
          color: #f0f6fc;
        }

        .stat-label {
          font-size: 1rem;
          color: #8b949e;
        }

        /* CTA Section */
        .cta-section {
          background: #0d1117;
          color: #c9d1d9;
          padding: 5rem 0;
          border-top: 1px solid #30363d;
        }

        .cta-card {
          max-width: 800px;
          margin: 0 auto;
        }

        .cta-title {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
          font-weight: 600;
          font-size: 2.5rem;
          color: #f0f6fc;
          margin-bottom: 1rem;
        }

        .cta-subtitle {
          font-size: 1.2rem;
          color: #8b949e;
          margin-bottom: 2rem;
        }

        .cta-button {
          padding: 1rem 2.5rem;
          font-weight: 500;
          border-radius: 6px;
          font-size: 1.1rem;
          display: inline-flex;
          align-items: center;
          background: #238636;
          border: 1px solid #238636;
          color: #ffffff;
          transition: all 0.2s ease;
          text-decoration: none;
        }

        .cta-button:hover {
          background: #2ea043;
          border-color: #2ea043;
          transform: translateY(-1px);
        }

        /* Animations */
        .fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .fade-in {
          animation: fadeIn 1s ease-out forwards;
        }

        .fade-in-left {
          animation: fadeInLeft 0.6s ease-out forwards;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        /* Responsive */
        @media (max-width: 992px) {
          .hero-title {
            font-size: 3rem;
          }

          .hero-visual {
            min-height: 300px;
            margin-top: 3rem;
          }

          .main-icon {
            font-size: 8rem;
          }
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.5rem;
          }

          .section-title {
            font-size: 2rem;
          }

          .hero-subtitle {
            font-size: 1.1rem;
          }

          .hero-buttons {
            flex-direction: column;
          }

          .hero-btn-primary,
          .hero-btn-outline {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default Landing;

