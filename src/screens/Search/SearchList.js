import React, {useEffect, useState} from 'react';
import {SectionList, StyleSheet, View} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {Text, EmptyState, SearchItem, VideoItem} from 'components';
import {getSize} from 'utils/responsive';
import useTheme from 'theme';
import {ftsAll} from 'actions';

import {Icons} from 'utils/icon';

const SearchList = () => {
  const insets = useSafeAreaInsets();

  const theme = useTheme();
  const dispatch = useDispatch();
  const {
    users,
    usersPage,
    hangouts,
    statuses,
    loading,
    query,
    helps,
    videos,
    age,
    gender,
    skills,
    categories,
  } = useSelector((state) => state.search);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [age, gender, skills, categories, query]);

  const styles = StyleSheet.create({
    wrapper: {
      flex: 1,
      flexGrow: 1,
      backgroundColor: theme.colors.background,
    },
    defaultImage: {
      height: getSize.h(105),
      width: getSize.w(163),
      resizeMode: 'contain',
    },
    emptyStateWrap: {
      marginVertical: getSize.h(100),
    },
    sectionHeader: {
      paddingVertical: getSize.h(15),
      paddingHorizontal: getSize.w(24),
      backgroundColor: theme.colors.paper,
      marginBottom: getSize.h(15),
      ...theme.shadow.small.ios,
      ...theme.shadow.small.android,
    },
    sectionHeaderText: {
      fontSize: getSize.f(15),
      textTransform: 'uppercase',
      fontFamily: theme.fonts.sfPro.medium,
    },
    footerBtn: {
      marginBottom: getSize.h(15),
      marginHorizontal: getSize.w(24),
    },
    itemWrapper: {
      marginHorizontal: getSize.h(24),
      marginVertical: getSize.w(5),
    },
    subWrapper: {
      width: '100%',
    },
  });

  const key =
    users.length +
    'users' +
    hangouts.length +
    'hangouts' +
    helps.length +
    'helps' +
    statuses.length +
    'statues' +
    videos.length;

  let DATA = [];
  if (users?.length > 0) {
    DATA = [
      ...DATA,
      {
        title: 'People',
        data: users,
      },
    ];
  }
  if (hangouts?.length > 0) {
    DATA = [
      ...DATA,
      {
        title: 'Hangouts',
        data: hangouts,
      },
    ];
  }
  if (helps?.length > 0) {
    DATA = [
      ...DATA,
      {
        title: 'Helps',
        data: helps,
      },
    ];
  }
  if (statuses?.length > 0) {
    DATA = [
      ...DATA,
      {
        title: 'Statuses',
        data: statuses,
      },
    ];
  }

  if (videos?.length > 0) {
    DATA = [
      ...DATA,
      {
        title: 'Video',
        data: videos,
      },
    ];
  }

  function renderSearchItem({item, section: {title}}) {
    if (title === 'People') {
      return <SearchItem type="user" data={item} />;
    } else if (title === 'Hangouts') {
      return <SearchItem type="hangout" data={item} />;
    } else if (title === 'Helps') {
      return <SearchItem type="help" data={item} />;
    } else if (title === 'Statuses') {
      return <SearchItem type="status" data={item} />;
    } else if (title === 'Video') {
      return (
        <VideoItem
          data={item}
          subWrapper={styles.subWrapper}
          wrapperStyle={styles.itemWrapper}
        />
      );
    }

    return null;
  }

  const handleLoadMore = () => {
    if ((age !== null || gender !== null) && page < usersPage) {
      dispatch(ftsAll({query, page, age, gender, skills, categories}));
      setPage(page + 1);
    }
  };

  return (
    <SectionList
      key={key}
      showsVerticalScrollIndicator={false}
      style={styles.wrapper}
      contentContainerStyle={{paddingBottom: insets.bottom}}
      sections={loading ? [] : DATA || []}
      extraData={DATA || []}
      renderItem={renderSearchItem}
      stickySectionHeadersEnabled
      renderSectionHeader={({section: {title}}) => (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderText}>
            Search result for {title}:
          </Text>
        </View>
      )}
      onEndReached={handleLoadMore}
      ListEmptyComponent={() => (
        <EmptyState
          imageSource={Icons.searchPending}
          imageStyle={styles.defaultImage}
          label={
            query.length > 0
              ? loading
                ? 'Searching...'
                : 'No result'
              : 'Enter a few words\nto search on Kizuner'
          }
          wrapperStyle={styles.emptyStateWrap}
        />
      )}
      renderSectionFooter={({section: {title, data}}) =>
        data.length === 0 && (
          // <EmptyState
          //   imageSource={defaultImage}
          //   imageStyle={styles.defaultImage}
          //   label={
          //     DATA.length > 0
          //       ? 'No result'
          //       : 'Enter a few words\nto search on Kizuner'
          //   }
          //   wrapperStyle={styles.emptyStateWrap}
          // />
          <EmptyState
            imageSource={Icons.searchPending}
            imageStyle={styles.defaultImage}
            label={
              query.length > 0
                ? 'No result'
                : 'Enter a few words\nto search on Kizuner'
            }
            wrapperStyle={styles.emptyStateWrap}
          />
        )
      }
    />
  );
};

export default SearchList;
