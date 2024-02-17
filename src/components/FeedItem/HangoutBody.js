import React, {useEffect, useRef, useState, memo} from 'react';
import {StyleSheet, Dimensions, View, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import Hyperlink from 'react-native-hyperlink';

import useTheme from 'theme';
import {getSize} from 'utils/responsive';
import {Touchable, Text, SpecialtyList, VideoViewer} from 'components';

import HangoutCapacity from './HangoutCapacity';
import HangoutCalendar from './HangoutCalendar';
import {isVideoType} from 'utils/fileTypes';
import orangeLight from '../../theme/orangeLight';
import {images} from 'components/Video/images';
import {TouchableOpacity} from 'react-native';
import HangoutHelper from './HangoutHelper';
import ImageMultiple from '../../components/ImageMultiple/ImageMultiple';
import {Icons} from 'utils/icon';
const width = Dimensions.get('window').width;

const areEqualCalendarItem = (prevProps, nextProps) => {
  return (
    prevProps?.title === nextProps?.title &&
    prevProps?.start === nextProps?.start &&
    prevProps?.end === nextProps?.end &&
    prevProps?.isNoTime === nextProps?.isNoTime
  );
};
const MemoCalendarItem = memo(HangoutCalendar, areEqualCalendarItem);

const HangoutBody = ({
  onPress,
  title,
  description,
  thumbnail,
  amount,
  currencyMethod,
  location,
  start,
  end,
  capacity,
  categories = [],
  specialties = [],
  schedule,
  id,
  show_hangout,
  disableGuest,
  availableStatus,
  media,
  helper = 5,
  show_help,
  type,
  isMinCapacity,
}) => {
  const theme = useTheme();
  const isNoTime = false;
  const navigation = useNavigation();
  const [showVideoView, setShowVideoView] = useState(false);
  const styles = StyleSheet.create({
    title: {
      fontFamily: theme.fonts.sfPro.semiBold,
      fontSize: getSize.f(18),
      lineHeight: getSize.f(22),
      marginHorizontal: getSize.w(24),
      marginTop: getSize.h(20),
      color: isNoTime ? theme.colors.disabled : theme.colors.tagTx,
    },
    description: {
      lineHeight: getSize.f(22),
      color: isNoTime ? theme.colors.disabled : theme.colors.tagTx,
      letterSpacing: 0,
      marginHorizontal: getSize.w(24),
      marginTop: getSize.h(title ? 5 : 20),
      fontSize: getSize.f(15),
    },
    featuredVideo: {
      borderRadius: getSize.h(10),
      backgroundColor: theme.colors.tagBg,
    },
    currencyMethodWrapper: {
      position: 'absolute',
      left: 0,
      top: getSize.h(25),
      height: getSize.h(32),
      borderTopRightRadius: getSize.h(32 / 2),
      borderBottomRightRadius: getSize.h(32 / 2),
      ...theme.shadow.small.android,
      ...theme.shadow.small.ios,
      backgroundColor: theme.colors.paper,
    },
    ptWrapper: {
      position: 'absolute',
      left: 0,
      bottom: getSize.h(25),
      height: getSize.h(32),
      borderTopRightRadius: getSize.h(32 / 2),
      borderBottomRightRadius: getSize.h(32 / 2),
      ...theme.shadow.small.android,
      ...theme.shadow.small.ios,
      backgroundColor: theme.colors.paper,
    },
    typeWrapper: {
      position: 'absolute',
      right: 0,
      bottom: getSize.h(25),
      height: getSize.h(32),
      borderTopLeftRadius: getSize.h(32 / 2),
      borderBottomLeftRadius: getSize.h(32 / 2),
      ...theme.shadow.small.android,
      ...theme.shadow.small.ios,
      backgroundColor: theme.colors.paper,
    },
  });

  const isMounted = useRef(true); // Initial value isMounted = true

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  return (
    <Touchable disabled={onPress ? false : true} onPress={onPress}>
      {Boolean(title) && <Text style={styles.title}>{title}</Text>}
      {Boolean(description) && (
        <Hyperlink linkStyle={stylesMain.linkStyle} linkDefault>
          <Text style={styles.description}>{description}</Text>
        </Hyperlink>
      )}
      {Boolean(thumbnail.length || amount) && (
        <View style={stylesMain.imageWrapper}>
          {thumbnail.length ? (
            <ImageMultiple
              initialData={thumbnail}
              style={stylesMain.featuredImage}
            />
          ) : (
            <View style={stylesMain.featuredImage}>
              <FastImage source={Icons.Logo} style={stylesMain.noImage} />
            </View>
          )}
          {Boolean(amount) && (
            <View style={styles.currencyMethodWrapper}>
              <LinearGradient
                colors={theme.colors.gradient}
                style={stylesMain.ptContainer}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}>
                <Text style={stylesMain.ptText}>{currencyMethod}</Text>
              </LinearGradient>
            </View>
          )}

          {Boolean(amount) && (
            <View style={styles.ptWrapper}>
              <LinearGradient
                colors={theme.colors.gradient}
                style={stylesMain.ptContainer}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}>
                <Text style={stylesMain.ptText}>{amount} USD</Text>
              </LinearGradient>
            </View>
          )}

          {type !== 'status' && (
            <View style={styles.typeWrapper}>
              <LinearGradient
                colors={theme.colors.gradient}
                style={stylesMain.typeContainer}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}>
                <Text style={stylesMain.typeText}>{type}</Text>
              </LinearGradient>
            </View>
          )}
        </View>
      )}
      <MemoCalendarItem
        title={title}
        location={location?.data}
        schedule={schedule}
        start={start}
        end={end}
        isNoTime={isNoTime}
        availableStatus={availableStatus}
      />
      {type === 'help' && Boolean(capacity) && (
        <HangoutHelper
          isMinCapacity={isMinCapacity}
          capacity={capacity}
          disabled={disableGuest ? true : false}
          onPress={() =>
            !show_help &&
            navigation.navigate('GuestHelpList', {
              helpId: id,
              capacity: capacity,
              start,
              end,
            })
          }
        />
      )}
      {type === 'hangout' && Boolean(capacity) && (
        <HangoutCapacity
          isMinCapacity={isMinCapacity}
          capacity={capacity}
          disabled={disableGuest ? true : false}
          onPress={() =>
            !show_hangout &&
            navigation.navigate('GuestList', {
              hangoutId: id,
              capacity,
              start,
              end,
            })
          }
        />
      )}
      {categories?.length > 0 && (
        <SpecialtyList
          wrapperStyle={stylesMain.specialtiesWrap}
          data={categories}
          labelStyle={{
            color: orangeLight.colors.secondary,
          }}
        />
      )}
      {specialties?.length > 0 && (
        <SpecialtyList
          wrapperStyle={stylesMain.specialtiesWrap}
          data={specialties}
        />
      )}
      <VideoViewer
        open={showVideoView}
        onClose={() => setShowVideoView(false)}
        selected={media}
      />
    </Touchable>
  );
};

const stylesMain = StyleSheet.create({
  imageWrapper: {
    marginHorizontal: getSize.w(24),
    marginTop: getSize.h(20),
    height: getSize.h(183),
  },
  featuredImage: {
    borderRadius: getSize.h(10),
    height: getSize.h(183),
    width: width - getSize.h(24 * 2),
    backgroundColor: orangeLight.colors.tagBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuredVideo: {
    borderRadius: getSize.h(10),
    backgroundColor: orangeLight.colors.tagBg,
  },
  ptWrapper: {
    position: 'absolute',
    left: 0,
    bottom: getSize.h(25),
    height: getSize.h(32),
    borderTopRightRadius: getSize.h(32 / 2),
    borderBottomRightRadius: getSize.h(32 / 2),
    ...orangeLight.shadow.small.android,
    ...orangeLight.shadow.small.ios,
    backgroundColor: 'white',
  },
  ptContainer: {
    height: getSize.h(32),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: getSize.w(14),
    borderTopRightRadius: getSize.h(32 / 2),
    borderBottomRightRadius: getSize.h(32 / 2),
  },
  typeContainer: {
    height: getSize.h(32),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: getSize.w(14),
    borderTopLeftRadius: getSize.h(32 / 2),
    borderBottomLeftRadius: getSize.h(32 / 2),
  },
  ptText: {
    fontFamily: orangeLight.fonts.sfPro.medium,
    color: orangeLight.colors.textContrast,
  },
  typeText: {
    fontFamily: orangeLight.fonts.sfPro.medium,
    color: orangeLight.colors.textContrast,
    textTransform: 'capitalize',
  },
  noImage: {
    width: getSize.h(80),
    height: getSize.h(80),
    resizeMode: 'contain',
  },
  specialtiesWrap: {
    marginTop: getSize.h(20),
  },
  linkStyle: {
    color: orangeLight.colors.primary,
    textDecorationLine: 'underline',
  },
  absolute: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    position: 'absolute',
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default HangoutBody;
