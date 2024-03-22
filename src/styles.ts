import { StyleSheet } from "react-native";

export const sizes = {
  icon: 30,
};

export const colors = {
  playing: "pink",
  brand: "blue",
  danger: "red",
  selected: "green",
  background: "#fff",
};

export const styles = StyleSheet.create({
  baseText: {
    fontFamily: "Inter_400Regular",
    fontSize: 20,
  },
  base: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    paddingTop: 60,
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
