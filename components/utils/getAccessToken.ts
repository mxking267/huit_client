export const getAccessToken = () => {
  if (typeof window !== 'undefined') {
    console.log(window.localStorage.getItem('access_token'));
    return window.localStorage.getItem('access_token');
  }
  return null;
};
