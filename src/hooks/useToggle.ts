"use client";
import { useCallback, useState } from "react";

export default function useToggle(initial = false) {
  const [open, setOpen] = useState<boolean>(initial);
  const toggle = useCallback(() => setOpen(v => !v), []);
  const setTrue = useCallback(() => setOpen(true), []);
  const setFalse = useCallback(() => setOpen(false), []);
  return { open, toggle, setTrue, setFalse };
}
