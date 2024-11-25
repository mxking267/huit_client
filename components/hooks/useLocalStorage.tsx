function getStorageValue(key: string, defaultValue = ''): string {
  // getting stored value
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(key);
    return saved ?? defaultValue;
  }
  return defaultValue; // Trả về giá trị mặc định nếu window không tồn tại
}

export const useLocalStorage = (
  key: string,
  defaultValue = ''
): [string, (value: string) => void, () => void] => {
  const value = getStorageValue(key, defaultValue);
  const setValue = (value: string) => localStorage.setItem(key, value);
  const removeValue = () => localStorage.removeItem(key);

  return [value, setValue, removeValue];
};
