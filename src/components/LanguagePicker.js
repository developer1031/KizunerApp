import React, {useState, useRef, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import {Modalize} from 'react-native-modalize';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {Text, Touchable} from 'components';
import {data as languagesDataJson} from 'assets/data';

import {getSize} from 'utils/responsive';
import orangeLight from '../theme/orangeLight';
import {Dimensions} from 'react-native';

const LanguagePicker = ({open, onSelect, onClose, value, isSearch = false}) => {
  const [languageSearch, setLanguageSearch] = useState('');
  const [selectedLanguage, setSelectedLange] = useState(value);
  const modalRef = useRef(null);

  useEffect(() => {
    if (open) {
      modalRef?.current?.open();
    } else {
      modalRef?.current?.close();
    }
  }, [open]);

  const countryList = Object.keys(languagesDataJson)
    .map((key) => ({
      id: key,
      name: languagesDataJson[key].name,
      nativeName: languagesDataJson[key].nativeName,
      //flag: languagesDataJson[key].flag,
      //callingCode: languagesDataJson[key].callingCode[0],
    }))
    .filter(
      (item) =>
        !languageSearch.length ||
        item.name.toLowerCase().includes(languageSearch.toLowerCase()),
    );

  const renderCountryItem = ({item}) => {
    let isSelected;
    if (isSearch) {
      isSelected = selectedLanguage === item.id;
    } else {
      isSelected = selectedLanguage.includes(item.id);
    }

    return (
      <Touchable
        onPress={() => {
          if (isSearch) {
            if (selectedLanguage == item.id) {
              setSelectedLange(null);
            } else {
              setSelectedLange(item.id);
            }
          } else {
            isSelected
              ? setSelectedLange(selectedLanguage.filter((i) => i !== item.id))
              : setSelectedLange([...selectedLanguage, item.id]);
          }
        }}>
        <View style={styles.countryItemWrap}>
          <View style={styles.countryItemMeta}>
            {item.flag && (
              <FastImage style={styles.countryFlag} source={{uri: item.flag}} />
            )}
            <Text variant={isSelected ? 'bold' : 'default'}>{item?.name}</Text>
          </View>
          {isSelected && (
            <MaterialCommunityIcons
              name="check"
              size={getSize.f(20)}
              color={orangeLight.colors.primary}
            />
          )}
        </View>
      </Touchable>
    );
  };

  // const renderCountryHeader = ({section}) => (
  //   <LinearGradient
  //     start={{x: 0, y: 0}}
  //     end={{x: 1, y: 0}}
  //     colors={orangeLight.color.gradient}
  //     style={styles.countrySectionHeader}>
  //     <Text color={orangeLight.colors.textContrast}>{section.title}</Text>
  //   </LinearGradient>
  // );

  const renderHeader = () => (
    <View style={styles.countryPickerHeader}>
      <Text variant="inputLabel">Select language:</Text>
      <Touchable
        onPress={() => {
          onSelect(selectedLanguage);
        }}>
        <Text style={styles.txtDone}>Done</Text>
      </Touchable>
    </View>
  );

  return (
    <Modalize
      ref={modalRef}
      onClose={() => {
        setSelectedLange(value);
        onClose();
      }}
      modalHeight={Dimensions.get('window').height / 1.5}
      HeaderComponent={renderHeader}
      flatListProps={{
        // section: countryList,
        data: countryList,
        renderItem: renderCountryItem,
        // renderSectionHeader: renderCountryHeader,
        keyExtractor: (item) => item.id,
        showsVerticalScrollIndicator: false,
        keyboardShouldPersistTaps: 'always',
      }}
    />
  );
};

const styles = StyleSheet.create({
  countryFlag: {
    width: getSize.w(28),
    height: getSize.h(20),
    borderRadius: getSize.h(2),
    resizeMode: 'contain',
    marginRight: getSize.w(5),
  },
  countryPickerHeader: {
    padding: getSize.h(15),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  countrySectionHeader: {
    paddingHorizontal: getSize.w(15),
    paddingVertical: getSize.h(5),
    backgroundColor: orangeLight.colors.primary,
  },
  countryItemWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: getSize.w(15),
    paddingVertical: getSize.h(10),
  },
  countryItemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  txtDone: {
    fontFamily: orangeLight.fonts.sfPro.bold,
    color: orangeLight.colors.primary,
    fontSize: getSize.f(14),
  },
});

export default LanguagePicker;
