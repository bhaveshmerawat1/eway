import { useState, useCallback } from "react";

function useDropdown<T extends string | null>(initial: T = null as T) {
  const [openDropdown, setOpenDropdown] = useState<T>(initial);

  const toggleDropdown = useCallback((key: T) => {
    setOpenDropdown((prev) => (prev === key ? null as T : key));
  }, []);

  const closeDropdown = useCallback(() => setOpenDropdown(null as T), []);
  const isOpen = useCallback((key: T) => openDropdown === key, [openDropdown]);

  return {
    openDropdown,
    toggleDropdown,
    closeDropdown,
    isOpen,
  };
}

export default useDropdown;
