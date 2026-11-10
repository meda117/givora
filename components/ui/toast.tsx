'use client';
import { Toaster } from 'react-hot-toast';

export function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#1C1C1C',
          color: '#F5F0EB',
          borderRadius: '4px',
          fontSize: '14px',
          fontWeight: 500,
          padding: '12px 16px',
        },
        success: {
          iconTheme: { primary: '#C9A96E', secondary: '#1C1C1C' },
        },
        error: {
          iconTheme: { primary: '#ef4444', secondary: '#fff' },
        },
      }}
    />
  );
}
