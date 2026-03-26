import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// main safe area view container'i
const SafeView = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) => {
  const { top } = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingTop: top }, style]}>
      {children}
    </View>
  );
};

export default SafeView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
});
