'use client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/redux/store';

export default function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate 
        loading={
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
          </div>
        } 
        persistor={persistor}
      >
        {children}
      </PersistGate>
    </Provider>
  );
}