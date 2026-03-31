import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text } from "react-native";

interface CopyToastProps {
  visible: boolean;
  message?: string;
  onHide: () => void;
}

export const CopyToast: React.FC<CopyToastProps> = ({
  visible,
  message = "Telefon Numarası Kopyalandı",
  onHide,
}) => {
  const translateY = useRef(new Animated.Value(-80)).current;

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          speed: 14,
          bounciness: 4,
        }),
        Animated.delay(1800),
        Animated.timing(translateY, {
          toValue: -80,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(() => onHide());
    }
  }, [visible, translateY, onHide]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[styles.container, { transform: [{ translateY }] }]}
    >
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 60,
    left: 16,
    right: 16,
    backgroundColor: "#0f172a",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: "center",
    zIndex: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  text: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
});
