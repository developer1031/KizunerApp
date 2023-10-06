import React from 'react';
import {StyleSheet, View} from 'react-native';

import useTheme from 'theme';
import {Touchable, Text} from 'components';
import {getSize} from 'utils/responsive';

import orangeLight from '../../theme/orangeLight';

const HangoutCount = ({
  hangout = 0,
  like = 0,
  comment = 0,
  help = 0,
  showHangout,
  showHelp,
  hideGuest,
  onPressHangout,
  onPressHelp,
  disableGuest,
  onPressLike,
  onPressComment,
}) => {
  return (
    <View style={styles.countWrapper}>
      {onPressHangout && !hideGuest && (
        <>
          {showHangout ? (
            <Touchable style={styles.countText}>
              <Text variant="caption">
                {hangout} {hangout ? 'hangouts' : 'hangout'}
              </Text>
            </Touchable>
          ) : (
            <Touchable
              disabled={disableGuest}
              onPress={onPressHangout}
              style={styles.countText}>
              <Text variant="caption" style={!disableGuest && styles.primary}>
                {hangout} {hangout ? 'guests' : 'guest'}
              </Text>
            </Touchable>
          )}
        </>
      )}
      {onPressHelp && !hideGuest && (
        <>
          {showHelp ? (
            <Touchable style={styles.countText}>
              <Text variant="caption">
                {help} {help ? 'helps' : 'help'}
              </Text>
            </Touchable>
          ) : (
            <Touchable
              disabled={disableGuest}
              onPress={onPressHelp}
              style={styles.countText}>
              <Text variant="caption" style={!disableGuest && styles.primary}>
                {help} {help ? 'helps' : 'help'}
              </Text>
            </Touchable>
          )}
        </>
      )}

      <Touchable onPress={onPressLike} style={styles.countText}>
        <Text variant="caption">{like} likes</Text>
      </Touchable>
      <Touchable onPress={onPressComment} style={styles.countText}>
        <Text variant="caption">{comment} comments</Text>
      </Touchable>
    </View>
  );
};

const styles = StyleSheet.create({
  countWrapper: {
    height: getSize.h(42),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: getSize.w(24),
  },
  countText: {
    marginRight: getSize.w(20),
  },
  primary: {
    color: orangeLight.colors.primary,
  },
});

export default HangoutCount;
