import { StyleSheet } from "react-native";

export const sizes = {
  icon: 40,
  timerViewMinWidth: 140,
  screenMaxWidth: 500,
};
export const spaces = {
  5: 5,
  15: 15,
  40: 40,
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
  background: "#fff",
};

export const styles = StyleSheet.create({
  clockText: {
    fontFamily: "Inter_600SemiBold",
    fontWeight: "600",
    fontSize: 24,
  },
  digitText: {
    fontFamily: "Inter_600SemiBold",
    fontWeight: "600",
    fontSize: 20,
    color: colors.brand,
  },
  iconPlace: {
    width: sizes.icon,
    height: sizes.icon,
  },
  timerViewBar: {
    padding: 5,
    paddingLeft: 21,
    borderWidth: borderWidths.light,
    borderStyle: "solid",
    width: sizes.timerViewMinWidth,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  timerViewList: {
    padding: 5,
    minWidth: sizes.timerViewMinWidth,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  confirmButton: {
    fontFamily: "Inter_600SemiBold",
    fontWeight: "600",
    color: colors.selected,
    borderColor: colors.selected,
    margin: 5,
    padding: 5,
    borderWidth: borderWidths.light,
    borderRadius: 3,
    textAlign: "center",
    textTransform: "uppercase",
  },
  dangerButton: {
    fontFamily: "Inter_600SemiBold",
    fontWeight: "600",
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
