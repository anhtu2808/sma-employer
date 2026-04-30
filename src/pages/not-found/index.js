import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faArrowLeft, faCompass, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import './styles.css';

const NotFound = () => {
    const navigate = useNavigate();
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        // Grid animation
        const GRID_SPACING = 50;
        let offset = 0;

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            offset = (offset + 0.3) % GRID_SPACING;

            // Vertical lines
            for (let x = -GRID_SPACING + offset; x < canvas.width + GRID_SPACING; x += GRID_SPACING) {
                const gradient = ctx.createLinearGradient(x, 0, x, canvas.height);
                gradient.addColorStop(0, 'rgba(255, 107, 53, 0)');
                gradient.addColorStop(0.5, 'rgba(255, 107, 53, 0.04)');
                gradient.addColorStop(1, 'rgba(255, 107, 53, 0)');
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, canvas.height);
                ctx.strokeStyle = gradient;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }

            // Horizontal lines
            for (let y = -GRID_SPACING + offset; y < canvas.height + GRID_SPACING; y += GRID_SPACING) {
                const gradient = ctx.createLinearGradient(0, y, canvas.width, y);
                gradient.addColorStop(0, 'rgba(255, 107, 53, 0)');
                gradient.addColorStop(0.5, 'rgba(255, 107, 53, 0.04)');
                gradient.addColorStop(1, 'rgba(255, 107, 53, 0)');
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width, y);
                ctx.strokeStyle = gradient;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }

            // Center scanning pulse
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const time = Date.now() * 0.001;
            const pulseRadius = ((time * 60) % 300);

            ctx.beginPath();
            ctx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(255, 107, 53, ${0.15 * (1 - pulseRadius / 300)})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Second pulse
            const pulseRadius2 = ((time * 60 + 150) % 300);
            ctx.beginPath();
            ctx.arc(centerX, centerY, pulseRadius2, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(249, 115, 22, ${0.1 * (1 - pulseRadius2 / 300)})`;
            ctx.lineWidth = 1;
            ctx.stroke();

            requestAnimationFrame(animate);
        };

        const animId = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animId);
        };
    }, []);

    return (
        <div className="emp-notfound-container">
            <canvas ref={canvasRef} className="emp-notfound-canvas" />

            {/* Gradient overlay */}
            <div className="emp-notfound-gradient-overlay" />

            <div className="emp-notfound-content">
                {/* Alert icon badge */}
                <div className="emp-notfound-alert-badge">
                    <div className="emp-notfound-alert-ring" />
                    <FontAwesomeIcon icon={faTriangleExclamation} className="emp-notfound-alert-icon" />
                </div>

                {/* Error code with glitch effect */}
                <div className="emp-notfound-code-wrapper">
                    <span className="emp-notfound-code" data-text="404">404</span>
                </div>

                {/* Compass decoration */}
                <div className="emp-notfound-compass-decoration">
                    <FontAwesomeIcon icon={faCompass} className="emp-notfound-compass-icon" />
                </div>

                {/* Text content */}
                <h1 className="emp-notfound-title">Page Not Found</h1>
                <p className="emp-notfound-description">
                    Sorry, the page you requested doesn't exist or has been moved.
                    Please check the URL or return to the dashboard.
                </p>

                {/* Action buttons */}
                <div className="emp-notfound-actions">
                    <button
                        className="emp-notfound-btn emp-notfound-btn-primary"
                        onClick={() => navigate('/dashboard')}
                    >
                        <FontAwesomeIcon icon={faHouse} />
                        <span>Dashboard</span>
                    </button>
                    <button
                        className="emp-notfound-btn emp-notfound-btn-outline"
                        onClick={() => navigate(-1)}
                    >
                        <FontAwesomeIcon icon={faArrowLeft} />
                        <span>Go Back</span>
                    </button>
                </div>

                {/* Status bar */}
                <div className="emp-notfound-status-bar">
                    <div className="emp-notfound-status-dot" />
                    <span className="emp-notfound-status-text">
                        Error 404 — Page Not Found
                    </span>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
