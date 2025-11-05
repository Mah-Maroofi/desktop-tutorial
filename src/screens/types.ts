import type { Dugnad } from '../types';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  AppTabs: undefined;
  EventDetail: { dugnad: Dugnad };
};

export type TabParamList = {
  Home: undefined;
  Create: undefined;
  Profile: undefined;
};
