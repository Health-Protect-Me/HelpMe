import React from 'react';
import { Button } from '@/components/ui/button';

type NavigationButtonsProps = {
  currentStepIndex: number;
  setCurrentStepIndex: React.Dispatch<React.SetStateAction<number>>;
  totalSteps: number;
  isStepValid: () => boolean;
  saveData: () => void;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  currentStepIndex,
  setCurrentStepIndex,
  totalSteps,
  isStepValid,
  saveData
}) => {
  const nextStep = (): void => {
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const preStep = (): void => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  return (
    <div className="mt-36 s:mt-20 flex items-center justify-center w-full gap-4 s:gap-10">
      {currentStepIndex > 0 && (
        <Button
          onClick={preStep}
          className="s:hidden flex w-56 s:w-56 s:mb-[332px] h-12 items-center justify-center py-3 text-base text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400 transition duration-200"
        >
          이전
        </Button>
      )}
      {currentStepIndex < totalSteps - 1 ? (
        <Button
          onClick={nextStep}
          disabled={!isStepValid()}
          className="flex w-56 s:w-56 h-12 s:mb-[332px] items-center justify-center text-base bg-[#FF7A85] text-white py-3 rounded-lg hover:bg-[#FF7A85] transition duration-300"
        >
          다음
        </Button>
      ) : (
        <Button
          onClick={saveData}
          disabled={!isStepValid()}
          className="flex w-56 s:w-56 h-12 s:mb-[332px] items-center justify-center text-base bg-[#FF7A85] text-white py-3 rounded-lg hover:bg-[#FF7A85] transition duration-300"
        >
          결과보기
        </Button>
      )}
    </div>
  );
};

export default NavigationButtons;