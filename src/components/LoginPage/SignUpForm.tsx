'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createClient } from '@/supabase/client';
import { useUserStore } from '@/store/userStore';

// Zod를 사용한 폼 검증 스키마
const schema = z
  .object({
    nickname: z.string().min(1, '닉네임은 필수입니다'),
    email: z.string().email('유효한 이메일을 입력하세요').min(1, '이메일은 필수입니다'),
    password: z.string().min(6, '비밀번호는 최소 6자 이상이어야 합니다').min(1, '비밀번호는 필수입니다'),
    confirmPassword: z.string().min(6, '비밀번호는 최소 6자 이상이어야 합니다').min(1, '비밀번호는 필수입니다')
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['confirmPassword']
  });

// Zod 스키마로부터 타입 추론
type Inputs = z.infer<typeof schema>;

const supabase = createClient(); // Supabase 클라이언트 초기화

const SignUpForm = () => {
  const { setUser } = useUserStore((state) => state);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<Inputs>({
    resolver: zodResolver(schema) // Zod 스키마를 resolver로 설정
  });

  const onSubmit = async (data: Inputs) => {
    try {
      const { data: signUpData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password
      });
      console.log(data.email);
      console.log(data.password);

      if (error) {
        console.error('회원가입 오류:', error.message);
        return;
      }

      const user = signUpData.user;

      if (user) {
        console.log('회원가입 성공, 사용자:', user);

        // 기본 프로필 URL 및 기타 데이터 추가
        const { error: profileError } = await supabase.from('users').insert({
          nickname: data.nickname,
          email: data.email
          // profile_url: '',
          // is_survey_done: false
        });

        if (profileError) {
          console.error('프로필 저장 중 오류가 발생했습니다:', profileError.message);
        } else {
          console.log('프로필이 성공적으로 저장되었습니다.');
          setUser(user);
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('회원가입 중 오류가 발생했습니다:', error.message);
      } else {
        console.error('회원가입 중 알 수 없는 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div>
      <div className="p-8">
        <div className="flex justify-center"></div>
        <h2 className="mb-6 text-3xl  font-bold text-center text-gray-800">회원가입</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-bold text-gray-700">Nickname</label>
            <input
              {...register('nickname')}
              placeholder="nickname"
              className="w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-[#FF7A85]"
            />
            {errors.nickname && <p className="mt-1 text-sm text-red-500">{errors.nickname.message}</p>}
          </div>
          <div>
            <label className="block mb-2 text-sm font-bold text-gray-700">ID</label>
            <input
              {...register('email')}
              placeholder="ID"
              className="w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-[#FF7A85]"
            />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block mb-2 text-sm font-bold text-gray-700">PW</label>
            <input
              type="password"
              placeholder="password"
              {...register('password')}
              className="w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-[#FF7A85]"
            />
            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
          </div>
          <div>
            <label className="block mb-2 text-sm font-bold text-gray-700">PW</label>
            <input
              type="password"
              placeholder="password"
              {...register('confirmPassword')}
              className="w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-[#FF7A85]"
            />
            {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>}
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 font-bold text-white bg-[#FF7A85] rounded-lg hover:bg-[#F5637C] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          >
            회원가입
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUpForm;
