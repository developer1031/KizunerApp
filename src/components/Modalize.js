import React, {useRef, useEffect} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {Modalize as RNModalize} from 'react-native-modalize';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';

import useTheme from 'theme';
import {Text, Touchable} from 'components';
import {getSize} from 'utils/responsive';
import {hideModalize} from 'actions';

const width = Dimensions.get('window').width;
import orangeLight from '../theme/orangeLight';

const Modalize = ({...props}) => {
  const theme = useTheme();
  const rnModalize = useRef(null);
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const {open, options} = useSelector((state) => state.modalize);

  const styles = StyleSheet.create({
    wrapper: {
      paddingBottom: getSize.h(100) + insets.bottom,
    },
    modal: {},
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
      ref={rnModalize}
      // adjustToContentHeight
      //disableScrollIfPossible={Platform.OS === 'ios' ? true : false}
      modalHeight={Dimensions.get('screen').height / 2.2}
      onClose={() => dispatch(hideModalize())}
      modalStyle={{
        paddingTop: getSize.h(30),
      }}
      scrollViewProps={{showsVerticalScrollIndicator: false}}
      {...props}>
      <View style={styles.wrapper}>
        {options
          .filter((i) => !i.hide)
          .map((item) => (
            <Touchable
              key={item.label}
              disabled={item.disabled ? true : false}
              onPress={() => {
                if (item.onPress) {
                  item.onPress();
                } else {
                  dispatch(hideModalize());
                }
              }}
              style={stylesMain.itemWrap}>
              {item.icon && (
                <View style={stylesMain.iconWrap}>{item.icon}</View>
              )}
              <Text style={stylesMain.label}>{item.label}</Text>
            </Touchable>
          ))}
      </View>
    </RNModalize>
  );
};

const stylesMain = StyleSheet.create({
  itemWrap: {
    height: getSize.h(65),
    borderBottomColor: orangeLight.colors.divider,
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
    fontFamily: orangeLight.fonts.sfPro.medium,
    fontSize: getSize.f(15),
    color: orangeLight.colors.tagTxt,
    width: width - getSize.w(48 + 26 + 15),
  },
});

export default Modalize;
