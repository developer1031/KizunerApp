import React from 'react';
import {StyleSheet, View, Platform} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch} from 'react-redux';

import useTheme from 'theme';
import {getSize} from 'utils/responsive';
import {Text, Touchable} from 'components';
import {showModalize, hideModalize} from 'actions';

const Select = ({
  options = [],
  onSelect,
  value,
  label,
  placeholder,
  labelStyle,
  wrapperStyle,
  error,
  onPress,
}) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const styles = StyleSheet.create({
    wrapper: {},
    label: {
      flex: 1,
      flexGrow: 1,
    },
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.divider,
      zIndex: 1,
    },
    input: {
      fontSize: getSize.f(16),
      letterSpacing: 1,
      color: theme.colors.text,
      paddingVertical: getSize.h(Platform.OS === 'ios' ? 10 : 6),
      paddingHorizontal: 0,
      flex: 1,
      flexGrow: 1,
    },
    rightIconBtn: {
      position: 'absolute',
      right: 0,
      top: getSize.h(20),
      margin: 0,
    },
    helper: {
      marginBottom: getSize.h(5),
    },
  });

  const modalizeOptions = options.map((item) => ({
    label: item.label,
    icon: item.icon,
    onPress: () => {
      item.value && onSelect && onSelect(item.value);
      dispatch(hideModalize());
    },
  }));

  return (
    <>
      <View style={[styles.wrapper, wrapperStyle]}>
        {label && (
          <Text variant="inputLabel" style={[styles.label, labelStyle]}>
            {label}
          </Text>
        )}
        <Touchable
          onPress={() =>
            onPress ? onPress() : dispatch(showModalize(modalizeOptions))
          }
          style={[styles.container]}>
          <Text style={styles.input}>{value || placeholder}</Text>
          <MaterialCommunityIcons
            name="menu-down"
            size={getSize.f(24)}
            color={theme.colors.text}
          />
        </Touchable>
        <Text style={styles.helper} variant="errorHelper">
          {error?.message || error}
        </Text>
      </View>
    </>
  );
};

export default Select;
