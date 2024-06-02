import { ERole } from '@features/auth/data-access/models/roles.enum';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { TSessionUser } from './models/user.type';

interface SessionStore {
  isLoading: boolean;
  user: TSessionUser;
  token: string;
}

const initialState: SessionStore = {
  user: {
    fullName: '',
    role: ERole.Employee,
    email: '',
    id: ''
  },
  token: '',
  isLoading: false
};

export const STORAGE_TOKEN_KEY = 'token';

export const SessionStore = signalStore(
  withState<SessionStore>(initialState),
  withMethods((store) => ({
      setUser: (user: TSessionUser) => {
        patchState(store, { user });
      },
      setLoading: (isLoading: boolean) => {
        patchState(store, { isLoading });
      },
      setToken: (token: string) => {
        localStorage.setItem(STORAGE_TOKEN_KEY, token);
        patchState(store, { token });
      },
      reset: () => {
        patchState(store, initialState);
      }
    })
  ));
