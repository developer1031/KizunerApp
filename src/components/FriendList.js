import React from 'react';

import {View, Text, StyleSheet} from 'react-native';

import {getSize} from 'utils/responsive';
import TagFriend from './TagFriend';
import {Platform} from 'react-native';
import {createUUID} from 'utils/util';

const FriendList = ({data = [], wrapperStyle}) => {
  const styles = StyleSheet.create({
    friendList: {
      marginTop: getSize.h(10),
      marginHorizontal: getSize.w(24),
      flexDirection: 'row',
      flexWrap: 'wrap',
      ...Platform.select({
        android: {
          justifyContent: 'flex-start',
          alignItems: 'flex-end',
        },
      }),
    },
    friendListContent: {
      paddingHorizontal: getSize.w(24),
    },
    friendTag: {},
  });

  if (!data || !data.length) {
    return null;
  }

  const renderFirstFriend = () => {
    if (data[0] && data[0]?.user && data[0]?.user?.name) {
      return (
        <TagFriend
          value={data[0]?.user?.name}
          key={createUUID()}
          wrapperStyle={styles.friendTag}
        />
      );
    }
  };

  const renderSecondFriend = () => {
    if (data[1] && data[1]?.user && data[1].user?.name) {
      return (
        <TagFriend
          value={data[1]?.user?.name}
          key={createUUID()}
          wrapperStyle={styles.friendTag}
        />
      );
    }
  };

  const length = data.length - 1;

  const renderOrder = () => {
    if (length === 0) return null;
    if (data[0] && data[0]?.user && data[0]?.user?.id) {
      return (
        <TagFriend
          value={`${length} others`}
          key={data[0]?.user?.id}
          wrapperStyle={styles.friendTag}
        />
      );
    }
  };

  const renderAnd = () => {
    if (length === 0) return null;
    return <Text>{' and '}</Text>;
  };

  if (!(data[0] && data[0]?.user && data[0]?.user?.name)) {
    return null;
  }

  return (
    <View style={[styles.friendList, wrapperStyle]}>
      <Text>{'- with '}</Text>
      {renderFirstFriend()}
      {renderAnd()}
      {length == 1 ? renderSecondFriend() : renderOrder()}
    </View>
  );
};

export default FriendList;
