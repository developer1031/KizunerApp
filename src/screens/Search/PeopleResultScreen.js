import React, {useEffect} from 'react';
import {StyleSheet, View, Keyboard} from 'react-native';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {useDispatch, useSelector} from 'react-redux';
import {debounce} from 'throttle-debounce';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import useTheme from 'theme';
import {setFtsQuery, ftsAll, clearSearchResult} from 'actions';
import {getSize} from 'utils/responsive';
import {Wrapper, Touchable, Text, HeaderBg, SearchBar} from 'components';

const SearchScreen = ({navigation, route}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const {query, age, gender} = useSelector((state) => state.search);

  const HEADER_HEIGHT = 68;

  function handleBack() {
    Keyboard.dismiss();
    navigation.goBack();
  }

  function searchFts(q) {
    dispatch(ftsAll({query: q || query, page: 1, age, gender}));
  }

  const debouncedSearch = debounce(500, (value) => searchFts(value));

  function handleSearch(value) {
    dispatch(setFtsQuery(value));
    if (value.length > 0) {
      debouncedSearch(value);
    } else {
      dispatch(clearSearchResult());
    }
  }

  useEffect(() => {
    return () => {
      dispatch(setFtsQuery(''));
      dispatch(clearSearchResult());
    };
  }, []);

  const styles = StyleSheet.create({
    wrapper: {
      flex: 1,
    },
    headerWrap: {
      paddingTop: getStatusBarHeight() + getSize.h(10),
      paddingBottom: getSize.h(10),
      paddingHorizontal: getSize.w(24),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    cancelTxt: {
      color: theme.colors.textContrast,
      fontSize: getSize.f(17),
      marginLeft: getSize.w(14),
    },
    searchWrap: {
      flexGrow: 1,
      flex: 1,
    },
    searchInput: {
      flexGrow: 1,
    },
  });

  return (
    <Wrapper style={styles.wrapper}>
      <HeaderBg noBorder height={HEADER_HEIGHT} addSBHeight />
      <View style={styles.headerWrap}>
        <Touchable style={styles.backBtn} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons
            name="chevron-left"
            color={theme.colors.primary}
            size={getSize.f(34)}
          />
        </Touchable>
        <SearchBar
          placeholder="Type name of cast, hangout..."
          wrapperStyle={styles.searchWrap}
          style={styles.searchInput}
          onChangeText={handleSearch}
          value={query}
        />
      </View>
    </Wrapper>
  );
};

export default SearchScreen;
