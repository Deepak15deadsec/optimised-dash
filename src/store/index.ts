
import { createStore, persist } from 'easy-peasy';
import { StoreModel, authModel, themeModel } from './model';

// Create the store with the models
const store = createStore<StoreModel>(
  persist(
    {
      auth: authModel,
      theme: themeModel,
    },
    {
      storage: 'localStorage',
      allow: ['theme'], // Only persist theme in localStorage
    }
  )
);

export default store;

// Type-safe hooks
export type RootStore = typeof store;
export type AppDispatch = typeof store.dispatch;
