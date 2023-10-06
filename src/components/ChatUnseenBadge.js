import React, {memo, useEffect, useMemo} from 'react';
import {View, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import moment from 'moment';

import useTheme from 'theme';
import {getSize} from 'utils/responsive';

// type = 'both' | 'single' | 'group'
const ChatUnseenBadge = memo(({style, type = 'both', ...props}) => {
  const {hasUnseenSingle, hasUnseenGroup} = useSelector((state) => state.chat);

  const theme = useTheme();

  const styles = StyleSheet.create({
    badge: {
      width: getSize.h(12),
      height: getSize.h(12),
      borderRadius: getSize.h(12 / 2),
      backgroundColor: theme.colors.primary,
      borderWidth: getSize.h(2),
      borderColor: theme.colors.paper,
    },
  });

  const conditionShowBadge = useMemo(
    () =>
      type === 'both'
        ? hasUnseenSingle || hasUnseenGroup
        : type === 'single'
        ? hasUnseenSingle
        : type === 'group'
        ? hasUnseenGroup
        : false,
    [type, hasUnseenSingle, hasUnseenGroup],
  );

  return conditionShowBadge ? (
    <View style={[styles.badge, style]} {...props} />
  ) : null;
});

export default ChatUnseenBadge;
