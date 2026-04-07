import React from 'react';
import { StyleSheet, View, Text, TextInput, type TextInputProps } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type Props = TextInputProps & {
  label: string;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
};

export const InputField: React.FC<Props> = ({ label, icon, style, ...rest }) => (
  <View style={styles.container}>
    <Text style={styles.label}>{label}</Text>
    <View style={[styles.inputRow, rest.multiline && styles.inputRowMultiline]}>
      {icon && (
        <MaterialCommunityIcons
          name={icon}
          size={20}
          color="#94A3B8"
          style={[styles.icon, rest.multiline && styles.iconMultiline]}
        />
      )}
      <TextInput
        style={[styles.input, icon && styles.inputWithIcon, style]}
        placeholderTextColor="#94A3B8"
        {...rest}
      />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '800',
    color: '#334155',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    // Elevation for Android
    elevation: 2,
  },
  inputRowMultiline: {
    alignItems: 'flex-start',
    paddingTop: 4,
  },
  icon: {
    marginLeft: 14,
  },
  iconMultiline: {
    marginTop: 14,
  },
  input: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    color: '#0F172A',
  },
  inputWithIcon: {
    paddingLeft: 10,
  },
});
