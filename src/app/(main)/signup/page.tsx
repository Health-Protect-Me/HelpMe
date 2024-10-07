import React from 'react';
import SignUpForm from '@/components/LoginPage/SignUpForm';

const LoginPage = () => {
  return (
    <div className="w-full flex flex-col justify-center">
      <div className="flex flex-col">
        <div className="flex flex-col items-center pt-[50px] s:pt:0 leading-8 s:pt-[1px] s:pb-[188px] ">
          <div className="mt-8 w-full max-w-sm mx-auto">
            <SignUpForm />
            <div className="text-center mt-4"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
