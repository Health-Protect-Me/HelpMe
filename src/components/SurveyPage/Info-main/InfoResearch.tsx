'use client'

import React, { useState, useEffect } from 'react';
import { InformationInsertDataType, Step } from '@/types/infoReaserch';
import { createClient } from '@/supabase/client';
import { toast } from 'react-toastify';
import { useUserStore } from '@/store/userStore';
import { useRouter } from 'next/navigation';
import Loading from '@/components/LoadingPage/ResultLoading/Loading';
import { useMutation } from '@tanstack/react-query';
import ProgressBar from './ProgressBar';
import StepRenderer from './SetpRender';
import NavigationButtons from './NavButton';

const supabase = createClient();

const InfoResearch = (): JSX.Element => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [surveyData, setSurveyData] = useState<InformationInsertDataType>({
    year_of_birth: null,
    gender: '',
    height: null,
    weight: null,
    purpose: ''
  });

  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  const steps: Step[] = ['출생연도', '성별', '신장 및 체중', '식단 목적'];

  const handleClickAPICall = async () => {
    const response = await fetch('/api/gpt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(surveyData)
    });
    if (!response.ok) {
      throw new Error('API 요청에 실패하였습니다.');
    }
    const content = await response.json();
    return content.data;
  };

  const parseAiResults = (result: string) => {
    if (!result) return null;

    const days = result.split('@').slice(1);

    const dietPlans = days.map((day) => parseDiet(day));
    const exercises = days.map((day) => parseExercise(day.split('~추천운동')[1]));

    return {
      result_diet: JSON.stringify(dietPlans),
      result_exercise: JSON.stringify(exercises)
    };
  };

  const parseDiet = (dayString: string) => {
    const sections = dayString.split('\n');
    const diet = {
      day: '',
      breakfast: { menu: '', ratio: '', calories: '' },
      lunch: { menu: '', ratio: '', calories: '' },
      dinner: { menu: '', ratio: '', calories: '' },
      totalCalories: ''
    };

    let currentMeal = null;

    sections.forEach((line) => {
      if (line.startsWith('@')) diet.day = line.substring(1).trim();
      else if (line.startsWith('#')) {
        currentMeal = diet.breakfast;
        if (line.startsWith('#?메뉴:')) currentMeal.menu += line.substring(7).trim() + '\n';
        else if (line.startsWith('#-')) currentMeal.menu += line.substring(1).trim() + '\n';
        else if (line.startsWith('#$')) currentMeal.ratio = line.substring(1).trim();
        else if (line.startsWith('#&')) currentMeal.calories = line.substring(1).trim();
      } else if (line.startsWith('^')) {
        currentMeal = diet.lunch;
        if (line.startsWith('^?메뉴:')) currentMeal.menu += line.substring(7).trim() + '\n';
        else if (line.startsWith('^-')) currentMeal.menu += line.substring(1).trim() + '\n';
        else if (line.startsWith('^$')) currentMeal.ratio = line.substring(1).trim();
        else if (line.startsWith('^&')) currentMeal.calories = line.substring(1).trim();
      } else if (line.startsWith('!')) {
        currentMeal = diet.dinner;
        if (line.startsWith('!?메뉴:')) currentMeal.menu += line.substring(7).trim() + '\n';
        else if (line.startsWith('!-')) currentMeal.menu += line.substring(1).trim() + '\n';
        else if (line.startsWith('!$')) currentMeal.ratio = line.substring(1).trim();
        else if (line.startsWith('!&')) currentMeal.calories = line.substring(1).trim();
      } else if (line.startsWith('*')) diet.totalCalories = line.substring(1).trim();
    });

    return diet;
  };

  const parseExercise = (exerciseString: string) => {
    if (!exerciseString) return null;
    const lines = exerciseString.split('\n');
    const exercise = {
      type: '',
      method: '',
      tip: '',
      duration: '',
      effect: '',
      caution: ''
    };

    let currentKey: keyof typeof exercise | null = null;

    lines.forEach((line) => {
      if (line.startsWith('운동종류:')) {
        exercise.type = line.substring(5).trim();
        currentKey = 'type';
      } else if (line.startsWith('운동방법:')) {
        exercise.method = line.substring(5).trim();
        currentKey = 'method';
      } else if (line.startsWith('운동 팁:')) {
        exercise.tip = line.substring(5).trim();
        currentKey = 'tip';
      } else if (line.startsWith('운동 횟수 및 시간:')) {
        exercise.duration = line.substring(11).trim();
        currentKey = 'duration';
      } else if (line.startsWith('운동의 영향:')) {
        exercise.effect = line.substring(7).trim();
        currentKey = 'effect';
      } else if (line.startsWith('주의사항:')) {
        exercise.caution = line.substring(5).trim();
        currentKey = 'caution';
      } else if (currentKey === 'method' && line.trim() !== '') {
        exercise.method += '\n' + line.trim();
      }
    });

    if (exercise.method.startsWith('\n')) {
      exercise.method = exercise.method.substring(1).trim();
    }

    return exercise;
  };

  const { mutate: saveData, isPending } = useMutation({
    mutationFn: async () => {
      const aiResults = await handleClickAPICall();
      const parsedResults = parseAiResults(aiResults);

      if (!parsedResults) {
        throw new Error('AI 결과 파싱에 실패했습니다.');
      }

      const { data, error } = await supabase.from('information').insert({
        year_of_birth: surveyData.year_of_birth ? parseInt(surveyData.year_of_birth.toString(), 10) : null,
        weight: surveyData.weight,
        gender: surveyData.gender,
        height: surveyData.height,
        purpose: surveyData.purpose,
        result_diet: parsedResults.result_diet,
        result_exercise: parsedResults.result_exercise
      });

      if (error) throw error;

      const { data: userData, error: userError } = await supabase
        .from('users')
        .update({ is_survey_done: true })
        .eq('user_id', user!.userId)
        .select();

      if (userError) throw userError;

      return userData;
    },
    onSuccess: (userData) => {
      if (userData && userData.length > 0) {
        setUser({ is_survey_done: true });
      }
      toast.success('데이터가 성공적으로 저장되었습니다!');
      router.push('/info-detail');
    },
    onError: (error) => {
      console.error('데이터 저장 중 오류:', error);
      toast.error('데이터 저장 중 오류가 발생했습니다. 다시 시도해 주세요.');
    }
  });

  const isStepValid = (): boolean => {
    switch (steps[currentStepIndex]) {
      case '출생연도':
        return surveyData.year_of_birth !== null && /^(19|20)\d{2}$/.test(surveyData.year_of_birth.toString());
      case '성별':
        return !!surveyData.gender;
      case '신장 및 체중':
        return (
          surveyData.height !== null &&
          /^1\d{2}$/.test(surveyData.height.toString()) &&
          surveyData.weight !== null &&
          /^\d{2,3}$/.test(surveyData.weight.toString())
        );
      case '식단 목적':
        return !!surveyData.purpose;
      default:
        return false;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {isPending ? (
        <Loading />
      ) : (
        <div className="w-full s:w-[1360px] max-w-2xl flex flex-col items-center mx-auto px-4 s:px-0">
          <h1 className="text-3xl font-bold mb-8 text-center text-gray-800 sr-only">{steps[currentStepIndex]}</h1>
          
          <ProgressBar currentStep={currentStepIndex} totalSteps={steps.length} />
          
          <StepRenderer
            currentStep={steps[currentStepIndex]} 
            surveyData={surveyData} 
            setSurveyData={setSurveyData} 
          />
          
          <NavigationButtons
            currentStepIndex={currentStepIndex}
            setCurrentStepIndex={setCurrentStepIndex}
            totalSteps={steps.length}
            isStepValid={isStepValid}
            saveData={saveData}
          />
        </div>
      )}
    </div>
  );
};

export default InfoResearch;