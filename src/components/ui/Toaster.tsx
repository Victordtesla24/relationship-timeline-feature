'use client';

// Import React directly to avoid TypeScript errors
import React from 'react';

interface Toast {
  id: string;
  title: string;
  description?: string;
  type: 'default' | 'success' | 'error' | 'warning';
}

interface ToastState {
  toasts: Toast[];
}

// Create a simple event system
let listeners: ((state: ToastState) => void)[] = [];
let toastState: ToastState = { toasts: [] };

// Create toast service without exporting directly
const toastManager = {
  toast: (props: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const toast = { id, ...props };
    
    toastState = {
      toasts: [...toastState.toasts, toast]
    };
    
    listeners.forEach(listener => listener(toastState));
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      toastManager.dismiss(id);
    }, 5000);
    
    return id;
  },
  
  dismiss: (id: string) => {
    toastState = {
      toasts: toastState.toasts.filter(toast => toast.id !== id)
    };
    
    listeners.forEach(listener => listener(toastState));
  }
};

// Simple Toaster component
function Toaster() {
  const [state, setState] = React.useState<ToastState>({ toasts: [] });
  
  React.useEffect(() => {
    listeners.push(setState);
    
    return () => {
      listeners = listeners.filter(listener => listener !== setState);
    };
  }, []);
  
  if (!state.toasts.length) return null;
  
  return (
    <div className="fixed top-0 right-0 p-4 w-full md:max-w-sm z-50 flex flex-col gap-2">
      {state.toasts.map(toast => (
        <div 
          key={toast.id}
          className={`
            rounded-md shadow-md p-4 bg-white border text-sm
            ${toast.type === 'success' ? 'border-green-500' : ''}
            ${toast.type === 'error' ? 'border-red-500' : ''}
            ${toast.type === 'warning' ? 'border-yellow-500' : ''}
            ${toast.type === 'default' ? 'border-gray-200' : ''}
          `}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">{toast.title}</h3>
              {toast.description && (
                <p className="text-gray-500 mt-1">{toast.description}</p>
              )}
            </div>
            <button 
              onClick={() => toastManager.dismiss(toast.id)}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// Export with different names to avoid conflicts
export { toastManager, Toaster }; 