import React, {useRef, useEffect, useState} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {Modalize as RNModalize} from 'react-native-modalize';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';

import useTheme from 'theme';
import {Text, Touchable} from 'components';
import {getSize} from 'utils/responsive';
import {hideModalizeAll} from 'actions';
import {Button} from 'components';

const width = Dimensions.get('window').width;
import orangeLight from '../theme/orangeLight';

const ModalizeWithAll = ({...props}) => {
  const theme = useTheme();
  const rnModalize = useRef(null);
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const {open, options, selected, onApply, onClear} = useSelector(
    (state) => state.modalizeAll,
  );
  const [selecting, setSelecting] = useState(selected || []);

  useEffect(() => {
    if (selected?.toString?.() !== selecting?.toString?.()) {
      setSelecting(selected);
    }
  }, [selected]);

  const styles = StyleSheet.create({
    wrapper: {
      paddingBottom: getSize.h(100) + insets.bottom,
    },
    modal: {},
    buttons: {
      flexDirection: 'row',
      paddingHorizontal: getSize.w(12),
      flex: 1,
      flexGrow: 1,
      zIndex: 2,
    },
    button: {
      flex: 1,
      flexGrow: 1,
      marginHorizontal: getSize.w(12),
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
      ref={rnModalize}
      // adjustToContentHeight
      //disableScrollIfPossible={Platform.OS === 'ios' ? true : false}
      modalHeight={Dimensions.get('screen').height / 1.25}
      onClose={() => dispatch(hideModalizeAll())}
      modalStyle={{
        paddingTop: getSize.h(20),
      }}
      HeaderComponent={
        <View style={styles.buttons}>
          <Button
            title="Clear all"
            variant="ghost"
            containerStyle={styles.button}
            onPress={onClear}
          />
          <Button
            title={`Apply (${selecting?.length || 0})`}
            containerStyle={styles.button}
            onPress={() => onApply?.(selecting)}
          />
        </View>
      }
      scrollViewProps={{
        showsVerticalScrollIndicator: false,
        style: {marginTop: getSize.h(65)},
      }}
      {...props}>
      <View style={styles.wrapper}>
        {options
          .filter((i) => !i.hide)
          .map((item, index) => {
            const isSelected = selecting.find((i) => i.id === item.id);
            return (
              <Touchable
                key={item.id}
                disabled={item.disabled}
                onPress={() => {
                  setSelecting(
                    isSelected
                      ? selecting.filter((i) => i.id !== item.id)
                      : [...selecting, item],
                  );
                }}
                style={[
                  stylesMain.itemWrap,
                  isSelected && stylesMain.itemSelected,
                ]}>
                <Text
                  style={[
                    stylesMain.label,
                    isSelected && {color: theme.colors.primary},
                  ]}>
                  {item.label === 'Set none categories'
                    ? item.label
                    : '#' + item.label}
                </Text>
              </Touchable>
            );
          })}
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
    justifyContent: 'space-between',
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
  itemSelected: {backgroundColor: 'rgba(255,170,100,0.1)'},
});

export default ModalizeWithAll;
