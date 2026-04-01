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
    marginBottom: 12,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 6,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  inputRowMultiline: {
    alignItems: 'flex-start',
    paddingTop: 4,
  },
  icon: {
    marginLeft: 14,
  },
  iconMultiline: {
    marginTop: 12,
  },
  input: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    color: '#0F172A',
  },
  inputWithIcon: {
    paddingLeft: 10,
  },
});
