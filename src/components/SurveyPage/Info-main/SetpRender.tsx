import { InformationInsertDataType, Gender, DietGoal, AllergyType, Step } from '@/types/infoReaserch';

type StepRendererProps = {
  currentStep: string;
  surveyData: InformationInsertDataType;
  setSurveyData: React.Dispatch<React.SetStateAction<InformationInsertDataType>>;
  setCurrentStepIndex: React.Dispatch<React.SetStateAction<number>>;
};

const StepRenderer = ({ currentStep, surveyData, setSurveyData, setCurrentStepIndex }: StepRendererProps) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'weight' || name === 'height' || name === 'year_of_birth') {
      const allowNumValue = value.replace(/[^0-9]/g, '');
      setSurveyData((prevData) => ({
        ...prevData,
        [name]: allowNumValue === '' ? null : Number(allowNumValue)
      }));
    } else {
      setSurveyData((prevData) => ({
        ...prevData,
        [name]: value
      }));
    }
  };

  const handleGenderSelect = (gender: Gender): void => {
    if (!gender) return;
    setSurveyData((prevData) => ({ ...prevData, gender }));
  };

  const handleDietGoalSelect = (purpose: DietGoal): void => {
    if (!purpose) return;
    setSurveyData((prevData) => ({ ...prevData, purpose }));
  };

  const handleAllergyChoice = (hasAllergy: boolean) => {
    setSurveyData(prevData => ({ ...prevData, hasAllergy }));
  };

  const handleAllergySelect = (allergy: AllergyType): void => {
    setSurveyData((preData) => {
      const currentAllergies = preData.allergies || [];
      if (currentAllergies.includes(allergy)) {
        return { ...preData, allergies: currentAllergies.filter((a) => a !== allergy) };
      } else if (currentAllergies.length < 3) {
        return { ...preData, allergies: [...currentAllergies, allergy] };
      }
      return preData;
    });
  };

  switch (currentStep) {
    case '출생연도':
      return (
        <div>
          <h2 className="text-xl font-semibold mb-2 text-center text-gray-900 s:mt-20">출생연도를 입력해주세요</h2>
          <p className="text-sm text-gray-600 mb-4 s:mb-6 text-center">
            연령에 따라 일일 권장 칼로리 섭취량이 달라집니다
          </p>
          <br />
          <div className="mb-4">
            <label className="block s:mb-1 text-sm mb-2 font-medium text-gray-700">출생연도</label>
            <input
              type="text"
              name="year_of_birth"
              placeholder="예) 1990"
              value={surveyData.year_of_birth ?? ''}
              onChange={handleInputChange}
              className={`w-full p-3 text-sm border rounded-lg focus:outline-none focus:ring-1 ${
                surveyData.year_of_birth !== null && !/^(19|20)\d{2}$/.test(surveyData.year_of_birth.toString())
                  ? 'focus:ring-red-500 focus:border-red-500'
                  : 'focus:ring-[#49BA43] focus:border-[#49BA43]'
              }`}
            />
            {surveyData.year_of_birth !== null && !/^(19|20)\d{2}$/.test(surveyData.year_of_birth.toString()) && (
              <p className="text-red-500 text-sm mt-1">1900년대 또는 2000년대 4자리로 입력해주세요</p>
            )}
          </div>
        </div>
      );

    case '성별':
      return (
        <div className="flex flex-col mb-2">
          <h2 className="text-xl font-semibold mb-2 text-center text-gray-900 s:mt-20">성별을 선택해 주세요</h2>
          <p className="text-sm text-gray-600 mb-4 s:mb-6 text-center">
            성별에 따라 일일 권장 칼로리 섭취량이 달라집니다
          </p>
          <div className="flex space-x-2 gap-4 s:flex-row s:space-y-0">
            <button
              onClick={() => handleGenderSelect('남')}
              className={`w-full s:flex-1 s:w-36 h-12 py-3 s:py-3 s:text-center px-4 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-400 transition duration-200 ${
                surveyData.gender === '남' ? 'bg-[#FFF6F2] text-black' : 'bg-white text-gray-700'
              }`}
            >
              남자
            </button>
            <button
              onClick={() => handleGenderSelect('여')}
              className={`w-full s:w-36 h-12 s:ml-0 py-3 px-4 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-400 transition duration-200 ${
                surveyData.gender === '여' ? 'bg-[#FFF6F2] text-black' : 'bg-white text-gray-700'
              }`}
            >
              여자
            </button>
          </div>
        </div>
      );

    case '신장 및 체중':
      return (
        <div className="flex-col justify-center items-center text-center">
          <h2 className="text-xl font-semibold mb-2 text-center text-gray-900 s:mt-20">신장과 체중을 입력해주세요</h2>
          <p className="text-sm text-gray-600 mb-4 s:mb-6 text-center">
            신장과 체중에 따라 일일 권장 칼로리 섭취량이 달라집니다
          </p>
          <div className="mb-6">
            <label className="flex mb-1 text-sm font-normal text-gray-700">신장</label>
            <input
              type="text"
              name="height"
              placeholder="cm (예: 170)"
              value={surveyData.height ?? ''}
              onChange={handleInputChange}
              className={`w-full s:flex p-3 text-sm border rounded focus:outline-none focus:ring-1 ${
                surveyData.height !== null && !/^1\d{2}$/.test(surveyData.height.toString())
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                  : 'focus:ring-[#49BA43] focus:border-[#49BA43]'
              }`}
            />
            {surveyData.height !== null && !/^1\d{2}$/.test(surveyData.height.toString()) && (
              <p className="flex text-red-500 text-sm">100~199cm 사이로 입력해주세요</p>
            )}
          </div>
          <div>
            <label className="flex s:mt-6 mb-1 text-sm font-normal text-gray-700">체중</label>
            <input
              type="text"
              name="weight"
              placeholder="kg (예: 65)"
              value={surveyData.weight ?? ''}
              onChange={handleInputChange}
              className={`w-full p-3 s:flex text-sm border rounded focus:outline-none focus:ring-1 ${
                surveyData.weight !== null && !/^\d{2,3}$/.test(surveyData.weight.toString())
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                  : 'focus:ring-[#49BA43] focus:border-[#49BA43]'
              }`}
            />
            {surveyData.weight !== null && !/^\d{2,3}$/.test(surveyData.weight.toString()) && (
              <p className="flex text-red-500 text-sm">30kg~200kg 사이로 입력해주세요</p>
            )}
          </div>
        </div>
      );

    case '알러지 유무':
      return (
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2 text-center text-gray-900 s:mt-20">알러지가 있으신가요?</h2>
          <p className="text-sm text-gray-600 mb-4 s:mb-6 text-center">
            알러지 정보를 바탕으로 안전한 식단을 추천해 드립니다
          </p>
          <div className="flex flex-col justify-center items-center gap-4">
            <button
              onClick={() => handleAllergyChoice(true)}
              className={`w-full s:w-80 flex h-12 items-center text-center justify-center py-3 px-4 text-base border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-red-400 transition duration-200 ${
                surveyData.hasAllergy === true ? 'bg-[#FFF6F2] text-black' : 'bg-white text-gray-700'
              }`}
            >
              예
            </button>
            <button
              onClick={() => handleAllergyChoice(false)}
              className={`w-full s:w-80 flex h-12 items-center text-center justify-center py-3 px-4 text-base border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-red-400 transition duration-200 ${
                surveyData.hasAllergy === false ? 'bg-[#FFF6F2] text-black' : 'bg-white text-gray-700'
              }`}
            >
              아니오
            </button>
          </div>
        </div>
      );

    case '알러지 선택':
      const allergyOptions: AllergyType[] = ['유제품', '견과류', '갑각류', '밀가루', '계란', '대두', '생선'];
      return (
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2 text-center text-gray-900 s:mt-20">
            알러지 항목을 선택해주세요 (최대 3개)
          </h2>
          <p className="text-sm text-gray-600 mb-4 s:mb-6 text-center">해당되는 알러지를 모두 선택해주세요</p>
          <div className="flex flex-wrap justify-center items-center gap-2">
            {allergyOptions.map((allergy) => (
              <button
                key={allergy}
                onClick={() => handleAllergySelect(allergy)}
                className={`px-4 py-2 text-sm border rounded-full transition duration-200 ${
                  surveyData.allergies?.includes(allergy)
                    ? 'bg-[#FFF6F2] text-black border-red-400'
                    : 'bg-white text-gray-700 border-gray-300'
                }`}
              >
                {allergy}
              </button>
            ))}
          </div>
        </div>
      );

    case '식단 목적':
      return (
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2 text-center text-gray-900 s:mt-20">
            식단을 통해 이루고자 하는 목표를 알려주세요
          </h2>
          <p className="text-sm text-gray-600 mb-4 s:mb-6 text-center">
            선택한 목표에 가장 최적화된 식단과 운동을 추천해 드려요
          </p>
          <div className="flex flex-col justify-center items-center gap-4">
            {(['체중 감량', '체중 유지', '체중 증량'] as DietGoal[]).map((goal) => (
              <button
                key={goal}
                onClick={() => handleDietGoalSelect(goal)}
                className={`w-full s:w-80 flex h-12 items-center text-center justify-center py-3 px-4 text-base border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-red-400 transition duration-200 ${
                  surveyData.purpose === goal ? 'bg-[#FFF6F2] text-black' : 'bg-white text-gray-700'
                }`}
              >
                {goal}
              </button>
            ))}
          </div>
        </div>
      );

    default:
      return null;
  }
};

export default StepRenderer;