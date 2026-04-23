'use client';  // REQUIRED
import { Provider } from 'react-redux';
import { store, persistor } from '@/redux/store';
import { Toaster } from 'react-hot-toast';
import { PersistGate } from 'redux-persist/integration/react';
import { ReactNode } from 'react';
interface ReduxProviderProps {
  children: ReactNode;
}
export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        {children}
      </PersistGate>
      <Toaster 
        position="top-right" 
        toastOptions={{
          duration: 4000,
          style: {
            background: '#10B981',
            color: '#fff',
            fontSize: '16px',
          },
        }}
      />
    </Provider>
  );
}
