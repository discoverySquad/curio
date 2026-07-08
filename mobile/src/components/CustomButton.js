import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

import colors from "../constants/colors";
import { fonts } from "../constants/fonts.js";

const CustomButton = ({ label, onPress }) => {
  return(
    <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: 32,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    width: "100%",
    height:67
  },
  label: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 0.3,
    fontFamily: fonts.heading,
  },
});

export default CustomButton;
