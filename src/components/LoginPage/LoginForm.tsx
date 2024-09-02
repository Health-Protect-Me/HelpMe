'use client';

import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createClient } from '@/supabase/client';

// Zod를 사용한 폼 검증 스키마
const schema = z.object({
  email: z.string().email('유효한 이메일을 입력하세요').min(1, '이메일은 필수입니다'),
  password: z.string().min(6, '비밀번호는 최소 6자 이상이어야 합니다').min(1, '비밀번호는 필수입니다')
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>이메일</label>
        <input {...register('email')} />
        <p>{errors.email?.message}</p>
      </div>
      <div>
        <label>비밀번호</label>
        <input type="password" {...register('password')} />
        <p>{errors.password?.message}</p>
      </div>
      <button type="submit">로그인</button>
    </form>
  );
}

export default LoginForm;
