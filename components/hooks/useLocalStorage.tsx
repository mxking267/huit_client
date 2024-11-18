import { useState, useEffect } from 'react';

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
): [string, (value: string) => void] => {
  const [value, setValue] = useState<string>(() => {
    return getStorageValue(key, defaultValue);
  });
  useEffect(() => {
    if (!value) {
      localStorage.removeItem(key);
      return;
    }
    // storing input name
    localStorage.setItem(key, value);
  }, [key, value]);

  return [value, setValue];
};
