import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';

import Tag from './Tag';
import {getSize} from 'utils/responsive';

const SpecialtyList = ({data = [], wrapperStyle, labelStyle}) => {
  const styles = StyleSheet.create({
    categoryList: {
      marginTop: getSize.h(10),
    },
    categoryListContent: {
      paddingHorizontal: getSize.w(24),
    },
    categoryTag: {
      marginRight: getSize.w(10),
    },
  });

  if (!data || !data.length) {
    return null;
  }

  return (
    <ScrollView
      horizontal
      style={[styles.categoryList, wrapperStyle]}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      alwaysBounceVertical={false}
      contentContainerStyle={styles.categoryListContent}>
      {data.map((item) => (
        <Tag
          value={item.name}
          key={item.id}
          labelStyle={labelStyle}
          wrapperStyle={styles.categoryTag}
        />
      ))}
    </ScrollView>
  );
};

export default SpecialtyList;
