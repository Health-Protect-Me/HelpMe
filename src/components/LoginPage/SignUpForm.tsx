'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createClient } from '@/supabase/client';

// Zod를 사용한 폼 검증 스키마
const schema = z.object({
  nickname: z.string().min(1, '닉네임은 필수입니다'),
  email: z.string().email('유효한 이메일을 입력하세요').min(1, '이메일은 필수입니다'),
  password: z.string().min(6, '비밀번호는 최소 6자 이상이어야 합니다').min(1, '비밀번호는 필수입니다')
});

// Zod 스키마로부터 타입 추론
type Inputs = z.infer<typeof schema>;

// Supabase 클라이언트 초기화
const supabase = createClient();

function SignUpForm() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<Inputs>({
    resolver: zodResolver(schema) // Zod 스키마를 resolver로 설정
  });

  const onSubmit = async (data: Inputs) => {
    try {
      // Supabase Auth를 사용한 회원가입 시도
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password
      });

      if (error) {
        console.error('회원가입 오류:', error.message);
      } else {
        console.log('회원가입 성공, 사용자:');

        // 추가 사용자 데이터 저장 (닉네임 등)
        const { error: profileError } = await supabase
          .from('users') // 예시로 'profiles' 테이블에 추가 데이터를 저장하는 로직
          .insert({
            nickname: data.nickname,
            email: data.email
          });

        if (profileError) {
          console.error('프로필 저장 중 오류가 발생했습니다:', profileError.message);
        } else {
          console.log('프로필이 성공적으로 저장되었습니다.');
          // 회원가입 성공 후 처리 (예: 로그인 페이지로 리디렉션)
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>닉네임</label>
        <input {...register('nickname')} />
        <p>{errors.nickname?.message}</p>
      </div>
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
      <button type="submit">회원가입</button>
    </form>
  );
}

export default SignUpForm;
