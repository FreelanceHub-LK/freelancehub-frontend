"use client";

import React, { useState, useEffect, useContext, createContext, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, AlertCircle, Info, XIcon } from "lucide-react";

// Toast type definitions
type ToastType = "success" | "error" | "warning" | "info";

interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

// Toast context interface
interface ToastContextType {
  addToast: (message: string, type?: ToastType) => void;
}

// Create context with a more explicit initial value
const ToastContext = createContext<ToastContextType>({
  addToast: () => {
    console.warn("Toast context not initialized");
  },
});

// Toast Provider Component
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const contextValue = React.useMemo(() => ({ addToast }), [addToast]);

  // Set the global instance for use outside components
  React.useEffect(() => {
    globalToastInstance = contextValue;
    return () => {
      globalToastInstance = null;
    };
  }, [contextValue]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

// Custom hook for using toast
export const useToast = () => {
  const context = useContext(ToastContext);

  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return {
    success: (message: string) => context.addToast(message, "success"),
    error: (message: string) => context.addToast(message, "error"),
    warning: (message: string) => context.addToast(message, "warning"),
    info: (message: string) => context.addToast(message, "info"),
  };
};

// Global toast instance - will be set by the provider
let globalToastInstance: ToastContextType | null = null;

// Utility toast methods (safe to use outside of React components)
export const toast = {
  success: (message: string) => {
    if (globalToastInstance) {
      globalToastInstance.addToast(message, "success");
    } else {
      console.warn("Toast not initialized. Make sure ToastProvider is rendered.");
    }
  },
  error: (message: string) => {
    if (globalToastInstance) {
      globalToastInstance.addToast(message, "error");
    } else {
      console.warn("Toast not initialized. Make sure ToastProvider is rendered.");
    }
  },
  warning: (message: string) => {
    if (globalToastInstance) {
      globalToastInstance.addToast(message, "warning");
    } else {
      console.warn("Toast not initialized. Make sure ToastProvider is rendered.");
    }
  },
  info: (message: string) => {
    if (globalToastInstance) {
      globalToastInstance.addToast(message, "info");
    } else {
      console.warn("Toast not initialized. Make sure ToastProvider is rendered.");
    }
  },
};

// Toast Container Component
const ToastContainer: React.FC<{
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}> = ({ toasts, onRemove }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onRemove={() => onRemove(toast.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

// Individual Toast Item Component
const ToastItem: React.FC<{
  toast: ToastMessage;
  onRemove: () => void;
}> = ({ toast, onRemove }) => {
  useEffect(() => {
    const timer = setTimeout(onRemove, 5000);
    return () => clearTimeout(timer);
  }, [onRemove]);

  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return <CheckCircle2 className="text-white" />;
      case "error":
        return <XCircle className="text-white" />;
      case "warning":
        return <AlertCircle className="text-white" />;
      case "info":
        return <Info className="text-white" />;
    }
  };

  const getClassName = () => {
    const baseClass =
      "flex items-center p-4 rounded-lg shadow-lg space-x-3 text-white";
    switch (toast.type) {
      case "success":
        return `${baseClass} bg-green-600`;
      case "error":
        return `${baseClass} bg-red-600`;
      case "warning":
        return `${baseClass} bg-yellow-600`;
      case "info":
        return `${baseClass} bg-blue-600`;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      className={getClassName()}
    >
      {getIcon()}
      <div className="flex-1">
        <p className="text-sm font-medium">{toast.message}</p>
      </div>
      <button
        onClick={onRemove}
        className="hover:bg-opacity-20 rounded-full p-1"
        title="Close"
      >
        <XIcon size={16} />
      </button>
    </motion.div>
  );
};

export default ToastContext;
