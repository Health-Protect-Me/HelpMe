import React, { useState, useEffect } from 'react';

type ProgressBarProps = {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  const [mobileBar, setMobileBar] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setMobileBar(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div
      className="w-full mb-10 mt-20 bg-gray-200 rounded-full h-2 
                s:mb-0 s:mt-10 s:w-80 s:h-3"
    >
      <div
        className="bg-red-400 h-full rounded-full transition-all duration-500 ease-in-out"
        style={{
          width: mobileBar
            ? `${((currentStep + 1) / totalSteps) * 80}%`
            : `${((currentStep + 1) / totalSteps) * 80}%`,
          maxWidth: '100%'
        }}
      ></div>
    </div>
  );
};

export default ProgressBar;