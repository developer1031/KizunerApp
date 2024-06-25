import React, {Fragment, useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment-timezone';
import {ShadowBox} from 'react-native-neomorph-shadows';
import {useNavigation} from '@react-navigation/native';
import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade,
} from 'rn-placeholder';
import FastImage from 'react-native-fast-image';
import AntDesign from 'react-native-vector-icons/AntDesign';

import useTheme from 'theme';
import {getSize} from 'utils/responsive';
import {Touchable, Text} from 'components';
import {Icons} from 'utils/icon';

export const CARD_WIDTH = getSize.w(150);
export const CARD_HEIGHT = getSize.h(230);
const IMAGE_HEIGHT = getSize.h(122);

export const PlaceholderItem = () => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    wrapper: {
      width: CARD_WIDTH,
      height: CARD_HEIGHT,
      borderRadius: getSize.h(10),
      backgroundColor: theme.colors.paper,
      ...theme.shadow.postItem,
    },
    thumbnail: {
      borderTopLeftRadius: getSize.h(10),
      borderTopRightRadius: getSize.h(10),
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      height: IMAGE_HEIGHT,
      width: CARD_WIDTH,
    },
    infoContainer: {
      paddingHorizontal: getSize.w(10),
      paddingVertical: getSize.h(12),
      justifyContent: 'space-between',
      height: CARD_HEIGHT - IMAGE_HEIGHT,
    },
    metaWrapper: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    avatar: {
      width: getSize.h(35),
      height: getSize.h(35),
      borderRadius: getSize.h(35 / 2),
      resizeMode: 'cover',
      backgroundColor: theme.colors.grayLight,
    },
    infoMeta: {
      flexGrow: 1,
      flex: 1,
    },
  });

  return (
    <ShadowBox style={styles.wrapper}>
      <Placeholder Animation={Fade}>
        <PlaceholderMedia style={styles.thumbnail} />
        <View style={styles.infoContainer}>
          <View style={styles.infoMeta}>
            <PlaceholderLine width={90} />
            <PlaceholderLine width={30} />
          </View>
          <View style={styles.metaWrapper}>
            <PlaceholderLine width={60} />
            <PlaceholderMedia style={styles.avatar} />
          </View>
        </View>
      </Placeholder>
    </ShadowBox>
  );
};

export const PlaceholderItems = ({style}) => {
  const styles = StyleSheet.create({
    wrapper: {
      flexDirection: 'row',
      flexGrow: 1,
    },
    item: {
      marginHorizontal: getSize.h(5),
      marginVertical: getSize.w(5),
      overflow: 'visible',
    },
    separator: {
      width: getSize.w(4),
    },
  });
  return (
    <View style={[styles.wrapper, style]}>
      {[1, 2, 3].map((i) => (
        <Fragment key={i.toString()}>
          <View style={styles.item}>
            <PlaceholderItem />
          </View>
          <View style={styles.separator} />
        </Fragment>
      ))}
    </View>
  );
};

const HangoutExploreItem = ({data, selected, wrapperStyle, onPress}) => {
  const theme = useTheme();
  const navigation = useNavigation();

  const styles = StyleSheet.create({
    shadowBox: {
      width: CARD_WIDTH,
      height: CARD_HEIGHT,
      borderRadius: getSize.h(10),
      backgroundColor: theme.colors.paper,
      ...theme.shadow.postItem,
    },
    borderGradient: {
      top: -getSize.h(2),
      width: selected ? CARD_WIDTH + getSize.w(4) : CARD_WIDTH,
      height: selected ? CARD_HEIGHT + getSize.h(4) : CARD_HEIGHT,
      borderRadius: getSize.h(11),
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.paper,
    },
    wrapper: {
      width: CARD_WIDTH,
      height: CARD_HEIGHT,
      borderRadius: getSize.h(10),
      backgroundColor: theme.colors.paper,
    },
    featuredImage: {
      borderTopLeftRadius: getSize.h(10),
      borderTopRightRadius: getSize.h(10),
      height: IMAGE_HEIGHT,
      width: CARD_WIDTH,
      backgroundColor: theme.colors.grayLight,
      resizeMode: 'cover',
      justifyContent: 'center',
      alignItems: 'center',
    },
    noImage: {
      width: getSize.h(50),
      height: getSize.h(50),
      resizeMode: 'contain',
    },
    infoContainer: {
      paddingHorizontal: getSize.w(10),
      paddingVertical: getSize.h(12),
      justifyContent: 'space-between',
      flex: 1,
    },
    ptWrapper: {
      position: 'absolute',
      left: 0,
      top: IMAGE_HEIGHT - getSize.h(30),
      height: getSize.h(20),
      borderTopRightRadius: getSize.h(20 / 2),
      borderBottomRightRadius: getSize.h(20 / 2),
      ...theme.shadow.small.android,
      ...theme.shadow.small.ios,
      backgroundColor: theme.colors.paper,
    },
    ptWrapperType: {
      position: 'absolute',
      right: 0,
      top: IMAGE_HEIGHT - getSize.h(30),
      height: getSize.h(20),
      borderTopLeftRadius: getSize.h(20 / 2),
      borderBottomLeftRadius: getSize.h(20 / 2),
      ...theme.shadow.small.android,
      ...theme.shadow.small.ios,
      backgroundColor: theme.colors.paper,
    },
    ptContainer: {
      height: getSize.h(20),
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: getSize.w(10),
      borderTopRightRadius: getSize.h(20 / 2),
      borderBottomRightRadius: getSize.h(20 / 2),
    },
    ptContainerType: {
      height: getSize.h(20),
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: getSize.w(10),
      borderTopLeftRadius: getSize.h(20 / 2),
      borderBottomLeftRadius: getSize.h(20 / 2),
    },
    title: {
      fontFamily: theme.fonts.sfPro.medium,
      lineHeight: getSize.f(18),
    },
    metaWrapper: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    castName: {
      fontSize: getSize.f(12),
      fontFamily: theme.fonts.sfPro.medium,
      maxWidth: CARD_WIDTH - getSize.w(20 + 35 + 5),
    },
    createdTime: {
      fontSize: getSize.f(10),
      color: theme.colors.text2,
      marginTop: getSize.h(3),
      maxWidth: CARD_WIDTH - getSize.w(20 + 35 + 5),
    },
    castAvatarOverlay: {
      width: getSize.h(35),
      height: getSize.h(35),
      borderRadius: getSize.h(35 / 2),
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
    },
    castAvatar: {
      width: getSize.h(35),
      height: getSize.h(35),
      borderRadius: getSize.h(35 / 2),
      resizeMode: 'cover',
    },
    castAvatarWrap: {
      width: getSize.h(35),
      height: getSize.h(35),
      borderRadius: getSize.h(35 / 2),
      justifyContent: 'center',
      alignItems: 'center',
      ...theme.shadow.small.android,
      ...theme.shadow.small.ios,
      backgroundColor: theme.colors.paper,
    },
  });

  const onNavigate = useCallback(() => {
    if (onPress) {
      onPress();
    }
    switch (data?.post_type) {
      case 'help':
        navigation.push('HelpDetail', {
          helpId: data.id,
        });
        break;
      case 'hangout':
        navigation.push('HangoutDetail', {
          hangoutId: data.id,
        });
        break;
      default:
        break;
    }
  }, [data, navigation]);

  if (!data) {
    return null;
  }

  const Wrapper = !selected ? ShadowBox : LinearGradient;

  const wrapperProps = !selected
    ? {
        style: styles.shadowBox,
      }
    : {
        colors: theme.colors.gradient,
        start: {x: 0, y: 0},
        end: {x: 1, y: 0},
        style: styles.borderGradient,
      };

  let timeString = moment.utc(data.created_at).fromNow();
  // if (data.schedule) {
  //   timeString = data.schedule
  // } else if (moment.utc(data.start).isValid()) {
  //   timeString = moment.utc(data.start).fromNow()
  // }

  function labelTitle() {
    switch (data?.post_type) {
      case 'help':
        return 'Help';
      case 'hangout':
        return 'Hangout';
      default:
        return '';
    }
  }

  return (
    <Touchable scalable onPress={onNavigate} style={wrapperStyle}>
      <Wrapper {...wrapperProps}>
        <View style={styles.wrapper}>
          {data?.cover?.thumb ? (
            <FastImage
              style={styles.featuredImage}
              source={data.cover.thumb && {uri: data.cover.thumb}}
            />
          ) : (
            <View style={styles.featuredImage}>
              <FastImage source={Icons.Logo} style={styles.noImage} />
            </View>
          )}
          <View style={styles.ptWrapper}>
            <LinearGradient
              colors={theme.colors.gradient}
              style={styles.ptContainer}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}>
              <Text variant="badge">
                {data.is_range_price
                  ? `${data.min_amount} - ${data.max_amount}`
                  : data.amount}{' '}
                USD
              </Text>
            </LinearGradient>
          </View>
          <View style={styles.ptWrapperType}>
            <LinearGradient
              colors={theme.colors.gradient}
              style={styles.ptContainerType}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}>
              <Text variant="badge">{labelTitle()}</Text>
            </LinearGradient>
          </View>
          <View style={styles.infoContainer}>
            <Text numberOfLines={2} style={styles.title}>
              {data.title}
            </Text>
            <View style={styles.metaWrapper}>
              <View style={styles.metaLeft}>
                <Text numberOfLines={1} style={styles.castName}>
                  {data.user?.name}
                </Text>
                <Text numberOfLines={1} style={styles.createdTime}>
                  {timeString}
                </Text>
              </View>
              <View style={styles.castAvatarWrap}>
                <LinearGradient
                  colors={theme.colors.gradient}
                  style={styles.castAvatarOverlay}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}>
                  <AntDesign
                    color={theme.colors.textContrast}
                    size={getSize.f(18)}
                    name="user"
                  />
                </LinearGradient>
                {data.user?.avatar && (
                  <FastImage
                    source={
                      data.user?.avatar?.thumb && {
                        uri: data.user?.avatar?.thumb,
                      }
                    }
                    style={styles.castAvatar}
                  />
                )}
              </View>
            </View>
          </View>
        </View>
      </Wrapper>
    </Touchable>
  );
};

export default HangoutExploreItem;
