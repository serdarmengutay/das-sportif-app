import { Dimensions, Platform } from "react-native";

export const screenWidth = Math.round(Dimensions.get("screen").width);
export const screenHeight = Math.round(Dimensions.get("screen").height);

export const isAndroid = Platform.OS === "android";
export const isIOS = Platform.OS === "ios";

/**
 * Safe area insets değerlerini temsil eden interface
 */
interface SafeAreaInsets {
  /** Üst kenar inset değeri */
  top: number;
  /** Alt kenar inset değeri */
  bottom: number;
  /** Sol kenar inset değeri */
  left: number;
  /** Sağ kenar inset değeri */
  right: number;
}

/**
 * Platform-specific insets hesaplama parametreleri
 */
interface PlatformInsetsConfig {
  /** Cihazın safe area insets değerleri */
  insets: SafeAreaInsets;
  /** Android için ek inset değeri (varsayılan: 0) */
  androidExtraInset?: number;
  /** iOS için ek inset değeri (varsayılan: 0) */
  iOSExtraInset?: number;
  /** Android'de cihazın bottom inset değerini kullan (varsayılan: true) */
  useAndroidDeviceInset?: boolean;
  /** iOS'ta cihazın bottom inset değerini kullan (varsayılan: true) */
  useIOSDeviceInset?: boolean;
}

export const calculateBottomInset = ({
  insets,
  androidExtraInset = 0,
  iOSExtraInset = 0,
  useAndroidDeviceInset = true,
  useIOSDeviceInset = true,
}: PlatformInsetsConfig): number => {
  // Android platformu için inset hesaplama
  if (isAndroid) {
    // Cihazın bottom inset değerini kullan + ek Android padding
    if (useAndroidDeviceInset) {
      return insets.bottom + androidExtraInset;
    }
    // Sadece ek Android padding kullan
    return androidExtraInset;
  } else {
    // iOS platformu için inset hesaplama
    // Cihazın bottom inset değerini kullan + ek iOS padding
    if (useIOSDeviceInset) {
      return insets.bottom + iOSExtraInset;
    }
    // Sadece ek iOS padding kullan
    return iOSExtraInset;
  }
};
