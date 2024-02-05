import React, {useEffect} from 'react';
import {StyleSheet, View, Keyboard} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {useDispatch, useSelector} from 'react-redux';
import {debounce} from 'throttle-debounce';

import useTheme from 'theme';
import {setFtsQuery, ftsAll, clearSearchResult} from 'actions';
import {getSize} from 'utils/responsive';
import {Wrapper, Touchable, Text, HeaderBg, SearchBar} from 'components';

import SearchList from './SearchList';
import SearchFilter from './SearchFilter';

const Tab = createMaterialTopTabNavigator();

const SearchScreen = ({navigation, route}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const {query, age, gender, skills, categories} = useSelector(
    (state) => state.search,
  );
  const insets = useSafeAreaInsets();

  const HEADER_HEIGHT = 68;

  function handleBack() {
    Keyboard.dismiss();
    navigation.goBack();
  }

  function searchFts(q) {
    dispatch(
      ftsAll({query: q || query, page: 1, age, gender, skills, categories}),
    );
  }

  const debouncedSearch = debounce(500, (value) => searchFts(value));

  function handleSearch(value) {
    const searchQuery = value && value.trim();
    dispatch(setFtsQuery(searchQuery));
    if (searchQuery?.length > 0) {
      debouncedSearch(searchQuery);
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
      paddingTop: insets.top + getSize.h(10),
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
        <SearchBar
          placeholder="Type name of cast, hangout..."
          wrapperStyle={styles.searchWrap}
          onFilter={() =>
            navigation.navigate(
              !route?.state?.index ? 'SearchFilter' : 'SearchList',
            )
          }
          filtering={!route?.state?.index}
          style={styles.searchInput}
          onChangeText={handleSearch}
        />
        <Touchable onPress={handleBack}>
          <Text style={styles.cancelTxt}>Cancel</Text>
        </Touchable>
      </View>
      <Tab.Navigator swipeEnabled={false} tabBar={() => null}>
        <Tab.Screen name="SearchList" component={SearchList} />
        <Tab.Screen name="SearchFilter" component={SearchFilter} />
      </Tab.Navigator>
    </Wrapper>
  );
};

export default SearchScreen;
