import { useEffect } from 'react';
import { postFadeOutTime } from '../../../redux/api/userAPI';

const useSubscribeActivity = (userId: string) => {
  useEffect(() => {
    if (userId) {
      const logOutTime = (enableType: string) => {
        if (enableType === 'visibilitychange' && document.hidden) {
          postFadeOutTime(userId);
        }
      };

      window.addEventListener('visibilitychange', () =>
        logOutTime('visibilitychange')
      );

      return () => {
        window.removeEventListener('visibilitychange', () =>
          logOutTime('visibilitychange')
        );
      };
    }
  }, [userId]);
};

export default useSubscribeActivity;
