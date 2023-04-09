import { useCallback, useState } from 'react';

export default function useToggle(
  defaultValue: boolean,
): [boolean, () => void, (value: boolean) => void] {
  const [value, setValue] = useState(!!defaultValue);
  const toggle = useCallback(() => setValue((x) => !x), []);
  return [value, toggle, setValue];
}
