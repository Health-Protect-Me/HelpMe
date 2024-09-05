'use client';

import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createClient } from '@/supabase/client';
import Link from 'next/link';

// Zod를 사용한 폼 검증 스키마
const schema = z.object({
  email: z.string().email('유효한 이메일을 입력하세요').min(1, '이메일은 필수입니다'),
  password: z.string().min(4, '비밀번호는 최소 4자 이상이어야 합니다').min(1, '비밀번호는 필수입니다')
});

// Zod 스키마로부터 타입 추론
type Inputs = z.infer<typeof schema>;

// Supabase 클라이언트 초기화
const supabase = createClient();

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<Inputs>({
    resolver: zodResolver(schema) // Zod 스키마를 resolver로 설정
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log('로그인 시도:', data); // 로그인 시도 데이터 확인

    try {
      // Supabase Auth를 사용한 로그인 시도
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
      });

      if (error) {
        console.error('로그인 오류:', error.message);
      } else {
        console.log('로그인 성공');
        // 로그인 성공 후 처리 (예: 리디렉션 또는 세션 저장)
      }
    } catch (error) {
      console.error('로그인 중 오류가 발생했습니다:', error);
    }
  };

  return (
    <div>
      <div className="p-8">
        <div className="flex justify-center"></div>
        <h2 className="mb-6 text-3xl font-bold text-center text-gray-800">LOGIN</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-bold text-gray-700">ID</label>
            <input
              {...register('email')}
              className="w-full px-4 font-thin py-2 border rounded-lg focus:ring-1 focus:ring-[#FF7A85]"
            />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block mb-2 text-sm font-bold text-gray-700">PW</label>
            <input
              type="password"
              {...register('password')}
              className="w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-[#FF7A85]"
            />
            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 font-bold text-white bg-[#FF7A85] rounded-lg hover:bg-[#F5637C] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          >
            Login
          </button>
        </form>
        <div className="flex justify-center mt-4 ">
          <Link href="/signup" className="text-sm font-bold text-blue-500 hover:underline ">
            회원가입
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
