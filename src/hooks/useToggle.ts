"use client";
import { useCallback, useState } from "react";

export default function useToggle(initial = false) {
  const [isOpen, isSetOpen] = useState<boolean>(initial);
  const toggle = useCallback(() => isSetOpen(val => !val), []);
  const open = useCallback(() => isSetOpen(true), []);
  const close = useCallback(() => isSetOpen(false), []);
  return { isOpen, toggle, open, close };
}
