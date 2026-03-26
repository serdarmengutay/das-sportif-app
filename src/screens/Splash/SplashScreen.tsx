import React, { useEffect } from "react";
import { StyleSheet, View, Text, Image, Dimensions } from "react-native";
import { APP_COLORS } from "../../styles/colors";
import SafeView from "../../components/SafeView";
import { useAppNavigation } from "../../hooks/useGlobal/useAppNavigation";
import { SCREENS } from "../../constants/screenConstants";

const { width } = Dimensions.get("window");

export const SplashScreen: React.FC = () => {
  const navigation = useAppNavigation();

  useEffect(() => {
    setTimeout(() => {
      navigation.navigate(SCREENS.MAIN_TABS);
    }, 2000);
  }, []);

  return (
    <SafeView style={styles.container}>
      <View style={styles.content}>
        {/* Logo Section */}
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/images/logo.png")}
            style={styles.logo}
            resizeMode="cover"
          />
        </View>

        {/* Title Section */}
        <View style={styles.titleContainer}>
          <Text style={styles.mainTitle}>DAS</Text>
          <Text style={styles.mainTitle}>SPORTIF</Text>
        </View>

        {/* Subtitle with Separator Lines */}
        <View style={styles.subtitleWrapper}>
          <View style={styles.separatorLine} />
          <Text style={styles.subtitleText}>TURNUVA ORGANİZASYON SİSTEMİ</Text>
          <View style={styles.separatorLine} />
        </View>

        {/* Loading Section */}
        <View style={styles.loadingContainer}>
          <View style={styles.progressBarBackground}>
            <View style={styles.progressBarFill} />
          </View>
          <Text style={styles.loadingText}>YÜKLENİYOR</Text>
        </View>
      </View>
    </SafeView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_COLORS.primary,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  logoContainer: {
    marginBottom: 40,
  },
  logo: {
    width: width * 0.4,
    height: width * 0.4,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  mainTitle: {
    color: "#FFFFFF",
    fontSize: 56,
    fontWeight: "900",
    letterSpacing: 2,
    lineHeight: 64,
    textAlign: "center",
  },
  subtitleWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    width: "100%",
    justifyContent: "center",
  },
  subtitleText: {
    color: APP_COLORS.secondary,
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 4,
    marginHorizontal: 15,
    textAlign: "center",
  },
  separatorLine: {
    height: 1.5,
    width: width * 0.15,
    backgroundColor: APP_COLORS.secondary,
    opacity: 0.6,
  },
  loadingContainer: {
    marginTop: 80,
    alignItems: "center",
  },
  progressBarBackground: {
    width: width * 0.2,
    height: 3,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: 20,
  },
  progressBarFill: {
    width: "40%",
    height: "100%",
    backgroundColor: APP_COLORS.secondary,
  },
  loadingText: {
    color: APP_COLORS.secondary,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 6,
    opacity: 0.8,
  },
  footerContainer: {
    paddingBottom: 40,
    alignItems: "center",
  },
  footerText: {
    color: "rgba(120, 144, 156, 0.6)",
    fontSize: 11,
    fontWeight: "500",
    letterSpacing: 1.5,
  },
});

export default SplashScreen;
