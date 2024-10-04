
export type Step = '출생연도' | '성별' | '신장 및 체중' | '알러지 유무' | '알러지 선택' | '식단 목적';
export type Gender = '남' | '여' | null;
export type DietGoal = '체중 감량' | '체중 유지' | '건강 식습관' | '체중 증량' | null;
export type AllergyType = '유제품' | '견과류' | '갑각류' | '밀가루' | '계란' | '대두' | '생선';

export type SurveyData = {
  year_of_birth: string;
  gender: Gender;
  height: string;
  weight: string;
  purpose: DietGoal;
};

export type FullSurveyData = Pick<SurveyData, 'year_of_birth' | 'gender' | 'height' | 'weight' | 'purpose'>;
export type InformationInsertDataType = {
  year_of_birth: number | null;
  gender: string;
  height: number | null;
  weight: number | null;
  purpose: string;
  hasAllergy: boolean;
  allergies:  AllergyType[];
};


export type UserType = {
  userId?: string;
  is_survey_done?: boolean;
}

export type UserStore = {
  user: UserType | null;
  setUser: (user: UserType | null) => void;
}