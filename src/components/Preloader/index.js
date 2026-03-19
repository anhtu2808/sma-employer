import React from 'react';
import Lottie from 'lottie-react';
import loadingAnimation from '@/assets/lottie/loading.json';
import smaLogo from '@/assets/svg/sma-logo.svg';
import './Preloader.css';

const Preloader = () => {
    return (
        <div className="preloader">
            <div className="preloader__content">
                <img src={smaLogo} alt="SmartRecruit" className="preloader__logo" />
                <div className="preloader__animation">
                    <Lottie animationData={loadingAnimation} loop autoplay />
                </div>
            </div>
        </div>
    );
};

export default Preloader;
