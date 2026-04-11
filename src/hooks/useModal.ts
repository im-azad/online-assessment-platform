import { useState, useCallback } from "react";

interface UseModalOptions {
  onOpen?: () => void;
  onClose?: () => void;
}

export function useModal(options?: UseModalOptions) {
  const [isOpen, setIsOpen] = useState(false);

  const onOpen = useCallback(() => {
    setIsOpen(true);
    options?.onOpen?.();
  }, [options]);

  const onClose = useCallback(() => {
    setIsOpen(false);
    options?.onClose?.();
  }, [options]);

  const onToggle = useCallback(() => {
    if (isOpen) {
      onClose();
    } else {
      onOpen();
    }
  }, [isOpen, onOpen, onClose]);

  return {
    isOpen,
    onOpen,
    onClose,
    onToggle,
  };
}
