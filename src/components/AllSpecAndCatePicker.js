import React, {useState, useRef, useEffect} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import {Modalize} from 'react-native-modalize';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {Text, Touchable} from 'components';
import {countries as countriesData} from 'assets/data';
import {getSize} from 'utils/responsive';
import useTheme from 'theme';

const AllSpecAndCatePicker = ({open, onSelect, onClose, value}) => {
  const [countrySearch, setCountrySearch] = useState('');
  const theme = useTheme();
  const modalRef = useRef(null);

  useEffect(() => {
    if (open) {
      modalRef?.current?.open();
    } else {
      modalRef?.current?.close();
    }
  }, [open]);

  const styles = StyleSheet.create({
    countryFlag: {
      width: getSize.w(28),
      height: getSize.h(20),
      borderRadius: getSize.h(2),
      resizeMode: 'contain',
      marginRight: getSize.w(5),
    },
    countryPickerHeader: {
      paddingVertical: getSize.h(15),
      paddingHorizontal: getSize.w(15),
    },
    countrySectionHeader: {
      paddingHorizontal: getSize.w(15),
      paddingVertical: getSize.h(5),
      backgroundColor: theme.colors.primary,
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
  });

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const countryList = Object.keys(countriesData)
    .map((key) => ({
      id: key,
      name: countriesData[key].name.common,
      flag: countriesData[key].flag,
      callingCode: countriesData[key].callingCode[0],
    }))
    .filter(
      (item) =>
        !countrySearch.length ||
        item.name.toLowerCase().includes(countrySearch.toLowerCase()),
    );
  const countrySectionList = alphabet
    .filter((char) => countryList?.find((i) => i.name.charAt(0) === char))
    .map((char) => ({
      title: char,
      data: countryList?.filter((i) => i.name.charAt(0) === char),
    }));

  const renderCountryItem = ({item}) => (
    <Touchable
      onPress={() => {
        setCountrySearch('');
        onSelect(item.id);
      }}>
      <View style={styles.countryItemWrap}>
        <View style={styles.countryItemMeta}>
          {item.flag && (
            <FastImage style={styles.countryFlag} source={{uri: item.flag}} />
          )}
          <Text variant={value === item.id ? 'bold' : 'default'}>
            {item.name} (+{item.callingCode})
          </Text>
        </View>
        {value === item.id && (
          <MaterialCommunityIcons
            name="check"
            size={getSize.f(20)}
            color={theme.colors.primary}
          />
        )}
      </View>
    </Touchable>
  );

  const renderCountryHeader = ({section}) => (
    <LinearGradient
      start={{x: 0, y: 0}}
      end={{x: 1, y: 0}}
      colors={theme.colors.gradient}
      style={styles.countrySectionHeader}>
      <Text color={theme.colors.textContrast}>{section.title}</Text>
    </LinearGradient>
  );

  return (
    <Modalize
      ref={modalRef}
      onClose={onClose}
      modalHeight={Dimensions.get('window').height / 1.2}
      HeaderComponent={() => (
        <View style={styles.countryPickerHeader}>
          {/* <SearchBar
            value={countrySearch}
            onChangeText={value => setCountrySearch(value)}
            placeholder="Search country"
          /> */}
          <Text variant="inputLabel">Select country code:</Text>
        </View>
      )}
      sectionListProps={{
        sections: countrySectionList,
        renderItem: renderCountryItem,
        renderSectionHeader: renderCountryHeader,
        keyExtractor: (item) => item.id,
        showsVerticalScrollIndicator: false,
        keyboardShouldPersistTaps: 'always',
      }}
    />
  );
};

export default AllSpecAndCatePicker;
