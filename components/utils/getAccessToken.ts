export const getAccessToken = () => {
  if (typeof window !== 'undefined') {
    // Chỉ gọi localStorage khi code chạy trên trình duyệt (client-side)
    return localStorage.getItem('access_token');
  }
  return null; // Trả về null hoặc giá trị mặc định khi chạy trên server-side
};
