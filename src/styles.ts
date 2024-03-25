import { StyleSheet } from "react-native";

export const sizes = {
  icon: 40,
  timerViewWidth: 120,
  screenMaxWidth: 500,
};
export const spaces = {
  5: 5,
  15: 15,
  gridGap: 20,
};
export const borderWidths = {
  light: 1,
};

// https://www.radix-ui.com/colors
export const colors = {
  playing: "#FF92AD",
  brand: "#0090FF",
  danger: "#FFC53D",
  selected: "#3DD68C",
  /* background: "#fff", */
  background: "yellow",
};

export const styles = StyleSheet.create({
  baseText: {
    fontFamily: "Inter_400Regular",
    fontSize: 20,
  },
  timerView: {
    textAlign: "center",
    padding: 5,
    borderWidth: borderWidths.light,
    borderStyle: "solid",
    width: sizes.timerViewWidth,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  dangerButton: {
    color: colors.danger,
    borderColor: colors.danger,
    margin: 5,
    padding: 5,
    borderWidth: borderWidths.light,
    borderRadius: 3,
    textAlign: "center",
    textTransform: "uppercase",
  },
});
