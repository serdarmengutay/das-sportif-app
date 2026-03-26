import { createNavigationContainerRef, StackActions, CommonActions } from '@react-navigation/native';
import type { RootStackParamList } from '../types/navigation';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export function navigate<RouteName extends keyof RootStackParamList>(
  name: RouteName,
  params?: RootStackParamList[RouteName],
) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name as any, params as any);
  }
}

export function reset(name: keyof RootStackParamList, params?: object) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: name as string, params }],
      }),
    );
  }
}

export function push<RouteName extends keyof RootStackParamList>(
  name: RouteName,
  params?: RootStackParamList[RouteName],
) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(StackActions.push(name as string, params));
  }
}

export function goBack() {
  if (navigationRef.isReady() && navigationRef.canGoBack()) {
    navigationRef.goBack();
  }
}

const NavigationService = {
  navigationRef,
  navigate,
  reset,
  push,
  goBack,
};

export default NavigationService;
