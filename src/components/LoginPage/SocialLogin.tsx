'use client';

import React from 'react';
import Image from 'next/image';
import googleLoginBtn from '@/assets/image/googleLogin.png';
import kakaoLoginBtn from '@/assets/image/kakaoLogin.png';
import { signInWithGoogle } from '../../../supabase/auth/googleAuth';
import { signInWithKakao } from '../../../supabase/auth/kakaoAuth';
import UserProfile from '../../components/UserProfile';

const LoginButton = () => {
  const handleGoogleLogin = async () => {
    try {
      const data = await signInWithGoogle();
      console.log('Signed in: ', data);
    } catch (error) {
      console.error('Error during sign-in: ', error);
    }
  };

  const handleKakaoLogin = async () => {
    try {
      const data = await signInWithKakao();
      console.log('Signed in: ', data);
    } catch (error) {
      console.error('Error during sign-in: ', error);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <UserProfile />
      <button onClick={handleGoogleLogin}>
        <Image src={googleLoginBtn} alt="Google Login" width={200} height={50} />
      </button>
      <button onClick={handleKakaoLogin}>
        <Image src={kakaoLoginBtn} alt="Kakao Login" width={200} height={50} />
      </button>
    </div>
  );
};

export default LoginButton;
