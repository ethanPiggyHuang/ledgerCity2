import { useEffect } from 'react';
import { postFadeOutTime } from '../../../redux/api/userAPI';

const useSubscribeActivity = (userId: string) => {
  // 監聽使用者（關閉/離開）網頁動態 -> 送到 db
  useEffect(() => {
    if (userId) {
      const logOutTime = (enableType: string) => {
        // const logoutTime = new Date().getTime();
        if (
          enableType === 'visibilitychange' &&
          document.hidden
          // || enableType === 'offline'
        ) {
          postFadeOutTime(userId);
          // postFadeOutTimeRT(userId, enableType);
        }
      };

      // 網頁被切換掉、縮小、關閉時，document.hidden 變成 true
      window.addEventListener('visibilitychange', () =>
        logOutTime('visibilitychange')
      );
      // window.addEventListener('offline', () => logOutTime('offline'));
      // window.addEventListener('pagehide', logOutTime); // 離開此頁導向其他網站，不太實用
      // window.addEventListener('beforeunload', logOutTime); //關閉頁面
      // window.addEventListener('unload', logOutTime); //關閉頁面

      return () => {
        window.removeEventListener(
          'visibilitychange',
          () => logOutTime('visibilitychange')
          //   window.removeEventListener('offline', () => logOutTime('offline'));
        );
      };
    }
  }, [userId]);
};

export default useSubscribeActivity;
