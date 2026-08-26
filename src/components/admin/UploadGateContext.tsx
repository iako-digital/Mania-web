"use client";

import { createContext, useCallback, useContext, useState } from "react";

interface UploadGateValue {
  uploading: boolean;
  begin: () => void;
  end: () => void;
}

const UploadGateContext = createContext<UploadGateValue | null>(null);

// Wraps a form that contains one or more MediaUploadField/GalleryUploadField
// instances, so the Save button can disable itself while any upload in the
// form is still in flight (prevents saving a broken/half-set media URL).
export function UploadGateProvider({ children }: { children: React.ReactNode }) {
  const [count, setCount] = useState(0);

  const begin = useCallback(() => setCount((c) => c + 1), []);
  const end = useCallback(() => setCount((c) => Math.max(0, c - 1)), []);

  return (
    <UploadGateContext.Provider value={{ uploading: count > 0, begin, end }}>
      {children}
    </UploadGateContext.Provider>
  );
}

export function useUploadGate() {
  return useContext(UploadGateContext);
}
