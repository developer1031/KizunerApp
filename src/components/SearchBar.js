import React, {useEffect, useRef} from 'react';
import {View, StyleSheet, TextInput, Platform} from 'react-native';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';

import useTheme from 'theme';
import {getSize} from 'utils/responsive';
import Touchable from './Touchable';

const SearchBar = ({
  onPress,
  onClear,
  onFilter,
  style,
  wrapperStyle,
  filtering,
  autoFocus = true,
  placeholder,
  colorIconSearch,
  sizeIconSearch,
  ...props
}) => {
  const theme = useTheme();
  const inputRef = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener('appear', (e) => {
      autoFocus && !onPress && inputRef.current.focus();
    });

    return unsubscribe;
  }, [navigation]);

  const styles = StyleSheet.create({
    wrapper: {
      backgroundColor: theme.colors.paper,
      height: getSize.h(48),
      borderRadius: getSize.h(48 / 2),
      flexDirection: 'row',
      alignItems: 'center',
      paddingLeft: getSize.w(16),
      paddingRight: onFilter ? getSize.w(6) : getSize.w(16),
    },
    searchIcon: {
      marginRight: getSize.w(15),
    },
    input: {
      fontSize: getSize.f(15),
      color: theme.colors.text,
      paddingHorizontal: 0,
      fontFamily: theme.fonts.sfPro.regular,
      flexGrow: 1,
      flex: 1,
      paddingRight: getSize.w(10),
    },
    clearBtn: {
      width: getSize.h(20),
      marginRight: 0,
    },
    filterBtn: {
      width: getSize.h(36),
      height: getSize.h(36),
      borderRadius: getSize.h(36 / 2),
      backgroundColor: theme.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    filteringBtn: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: theme.colors.primary,
    },
  });

  const WrapperComponent =
    onPress && Platform.OS === 'android' ? Touchable : View;

  return (
    <WrapperComponent
      onPress={() => onPress && Platform.OS === 'android' && onPress()}
      scalable
      style={[
        styles.wrapper,
        theme.shadow.large.ios,
        theme.shadow.large.android,
        wrapperStyle,
      ]}>
      <SimpleLineIcons
        name="magnifier"
        color={colorIconSearch ?? theme.colors.text}
        size={sizeIconSearch ?? getSize.f(24)}
        style={styles.searchIcon}
      />
      <TextInput
        allowFontScaling={false}
        placeholderTextColor={theme.colors.grayLight}
        style={[styles.input, style]}
        ref={inputRef}
        onTouchStart={() => onPress && Platform.OS === 'ios' && onPress()}
        selectionColor={theme.colors.primary}
        editable={!onPress}
        autoFocus={autoFocus && !onPress}
        numberOfLines={1}
        placeholder={placeholder}
        {...props}
      />
      {onClear && (
        <Touchable style={styles.clearBtn} onPress={onClear}>
          <MaterialIcons
            name="clear"
            color={theme.colors.text}
            size={getSize.f(20)}
          />
        </Touchable>
      )}
      {onFilter && (
        <Touchable
          style={[styles.filterBtn, filtering && styles.filteringBtn]}
          onPress={onFilter}>
          <MaterialCommunityIcons
            name="filter-variant"
            color={filtering ? theme.colors.primary : theme.colors.textContrast}
            size={getSize.h(24)}
          />
        </Touchable>
      )}
    </WrapperComponent>
  );
};

export default SearchBar;
