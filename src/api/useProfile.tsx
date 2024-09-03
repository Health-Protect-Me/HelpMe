'use client';

import { useEffect } from 'react';
import { useUserStore } from '../store/userStore';
import { createClient } from '@/supabase/client';
import defaultImage from '@/assets/image/defaultimg.png';

const useProfile = () => {
  const { user, setUser } = useUserStore();
  const supabase = createClient();

  useEffect(() => {
    async function getUser() {
      const { data } = await supabase.auth.getUser();

      if (data && data.user) {
        const defaultProfileUrl = defaultImage;
        setUser({
          userId: data.user.id,
          email: data.user.email,
          profile_url: data.user?.user_metadata?.profile_url || defaultProfileUrl,
          nickname: data.user?.user_metadata?.nickname
        });
      }
    }
    getUser();
  }, []);

  return { user };
};

export default useProfile;
