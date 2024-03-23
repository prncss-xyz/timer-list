import { StyleSheet } from "react-native";

export const sizes = {
  icon: 30,
};

// https://www.radix-ui.com/colors
export const colors = {
  playing: "#FF92AD",
  brand: "#0090FF",
  danger: "#FFC53D",
  selected: "#3DD68C",
  background: "#fff",
};

export const styles = StyleSheet.create({
  baseText: {
    fontFamily: "Inter_400Regular",
    fontSize: 20,
  },
  timeInput: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    textAlign: "center",
    padding: 5,
  },
  app: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  dangerButton: {
    color: colors.danger,
    borderColor: colors.danger,
    padding: 5,
    borderWidth: 1,
    borderRadius: 3,
    textAlign: "center",
    textTransform: "uppercase",
  },
});
