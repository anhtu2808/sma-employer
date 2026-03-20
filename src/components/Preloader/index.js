import React from 'react';
import Loading from '@/components/Loading';
import smaLogo from '@/assets/svg/sma-logo.svg';
import './Preloader.css';

const Preloader = () => {
    return (
        <div className="preloader">
            <div className="preloader__content">
                <img src={smaLogo} alt="SmartRecruit" className="preloader__logo" />
                <div className="preloader__animation">
                    <Loading inline size={120} />
                </div>
            </div>
        </div>
    );
};

export default Preloader;
