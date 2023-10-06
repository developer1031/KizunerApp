import React, {useRef, useEffect, useState} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {Modalize as RNModalize} from 'react-native-modalize';
import {useSafeArea} from 'react-native-safe-area-context';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

import useTheme from 'theme';
import {Text, Touchable, Button} from 'components';
import {getSize} from 'utils/responsive';
import SelectRangeLabel from './SelectRangeLabel';
import {Platform} from 'react-native';

const width = Dimensions.get('window').width;

const ModalizeWithRange = ({
  open,
  options,
  onClose,
  showRange,
  selected,
  limit = {
    min: 0,
    max: 100,
  },
  onSelectRange,
  ...props
}) => {
  const theme = useTheme();
  const rnModalize = useRef(null);
  const insets = useSafeArea();
  const [value, setValue] = useState({min: limit.min, max: limit.max});

  const styles = StyleSheet.create({
    wrapper: {
      paddingTop: getSize.h(30),
      paddingBottom: getSize.h(100) + insets.bottom,
    },
    itemWrap: {
      height: getSize.h(65),
      borderBottomColor: theme.colors.divider,
      borderBottomWidth: getSize.h(1),
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: getSize.w(24),
    },
    iconWrap: {
      height: getSize.w(26),
      width: getSize.w(26),
      paddingTop: getSize.h(2),
      marginRight: getSize.w(15),
    },
    label: {
      fontFamily: theme.fonts.sfPro.medium,
      fontSize: getSize.f(15),
      color: theme.colors.tagTxt,
      width: width - getSize.w(48 + 26 + 15),
    },
    labelSelected: {
      fontFamily: theme.fonts.sfPro.bold,
      color: theme.colors.primary,
    },
    sliderWrap: {
      alignSelf: 'center',
      marginVertical: getSize.h(40),
    },
  });

  useEffect(() => {
    if (open) {
      rnModalize?.current?.open();
    } else {
      rnModalize?.current?.close();
    }
  }, [open]);

  return (
    <RNModalize
      withReactModal={Platform.OS === 'android' ? false : true}
      ref={rnModalize}
      adjustToContentHeight
      onClose={onClose}
      {...props}>
      <View style={styles.wrapper}>
        {options
          .filter((i) => !i.hide)
          .map((item) => (
            <Touchable
              key={item.label}
              disabled={item.disabled}
              onPress={() => {
                if (item.onPress) {
                  item.onPress(item.value);
                } else {
                  onClose();
                }
              }}
              style={styles.itemWrap}>
              {item.icon && <View style={styles.iconWrap}>{item.icon}</View>}
              <Text
                style={[
                  styles.label,
                  selected === item.value && styles.labelSelected,
                ]}>
                {item.label}
              </Text>
            </Touchable>
          ))}
        <View style={styles.sliderWrap}>
          {showRange && (
            <>
              <MultiSlider
                min={limit.min}
                max={limit.max}
                values={[value.min, value.max]}
                onValuesChange={(values) =>
                  setValue({min: values[0], max: values[1]})
                }
                markerStyle={{
                  backgroundColor: theme.colors.primary,
                }}
                trackStyle={{
                  backgroundColor: theme.colors.grayLight,
                }}
                selectedStyle={{
                  backgroundColor: theme.colors.primary,
                }}
                enableLabel
                customLabel={(labelProps) => (
                  <SelectRangeLabel {...labelProps} />
                )}
              />
              <Button
                title="Apply"
                onPress={() => {
                  showRange && onSelectRange && onSelectRange(value);
                  onClose();
                }}
              />
            </>
          )}
        </View>
      </View>
    </RNModalize>
  );
};

export default ModalizeWithRange;
