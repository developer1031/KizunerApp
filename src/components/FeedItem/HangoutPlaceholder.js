import React, {memo} from 'react';
import {StyleSheet, View, Dimensions} from 'react-native';
import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade,
} from 'rn-placeholder';

import useTheme from 'theme';
import {getSize} from 'utils/responsive';
import {Paper} from 'components';

const width = Dimensions.get('window').width;

const HangoutPlaceholder = memo(() => {
  const theme = useTheme();
  const styles = StyleSheet.create({
    hangoutHead: {
      paddingHorizontal: getSize.w(24),
      borderBottomColor: theme.colors.divider,
      borderBottomWidth: getSize.h(1),
      paddingVertical: getSize.h(15),
      flexDirection: 'row',
      alignItems: 'center',
    },
    wrapper: {},
    avatar: {
      width: getSize.h(40),
      height: getSize.h(40),
      borderRadius: getSize.h(20),
      marginRight: getSize.w(10),
    },
    topMeta: {flex: 1},
    hangoutContent: {
      paddingVertical: getSize.h(20),
      paddingHorizontal: getSize.w(24),
    },
    cover: {
      borderRadius: getSize.h(10),
      height: getSize.h(183),
      width: width - getSize.h(24 * 2),
      marginVertical: getSize.h(10),
    },
  });

  return (
    <Paper noBorder style={styles.wrapper}>
      <Placeholder Animation={Fade}>
        <View style={styles.hangoutHead}>
          <PlaceholderMedia style={styles.avatar} />
          <View style={styles.topMeta}>
            <PlaceholderLine width={40} />
          </View>
        </View>
        <View style={styles.hangoutContent}>
          <PlaceholderLine width={50} />
          <PlaceholderLine />
          <PlaceholderLine width={30} />
          <PlaceholderMedia style={styles.cover} />
        </View>
      </Placeholder>
    </Paper>
  );
});

export default HangoutPlaceholder;
