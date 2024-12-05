export const getAccessToken = () => {
  if (typeof window !== 'undefined') {
    return window.localStorage.getItem('access_token');
  }
  return null;
};
