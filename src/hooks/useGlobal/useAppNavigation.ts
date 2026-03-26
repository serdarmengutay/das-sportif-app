import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/navigation';

export const useAppNavigation = () => {
  return useNavigation<NativeStackNavigationProp<RootStackParamList>>();
};
