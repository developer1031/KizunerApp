import React from 'react';
import {StyleSheet, View, Platform} from 'react-native';

import useTheme from 'theme';
import {getSize} from 'utils/responsive';
import {Touchable, Text, Avatar} from 'components';

import orangeLight from '../theme/orangeLight';

const LeaderboardItem = ({data, index, onSelect}) => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    headerItem: {
      flex: 1,
      backgroundColor: 'white',
      height: getSize.h(120),
      borderTopLeftRadius: getSize.w(30),
      borderTopRightRadius: getSize.w(30),
      marginTop: -getSize.h(24),
    },
    headerItemChild: {
      flex: 1,
      height: getSize.h(95),
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      flexDirection: 'row',
      alignItems: 'center',
      paddingRight: getSize.w(16),
    },
    wrapperItem: {
      backgroundColor: 'white',
      height: getSize.h(95),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingRight: getSize.w(16),
    },
    wrapper: {
      height: getSize.h(95),
      flex: 1,
    },
    subWrapperItem: {
      flexDirection: 'row',
      flex: 1,
      height: '100%',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    wrapChild: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    avatarSilver: {
      justifyContent: 'center',
      alignItems: 'center',
      ...Platform.select({
        ios: {
          marginTop: getSize.w(50),
        },
        android: {
          marginTop: getSize.w(25),
        },
      }),
    },
    avatarGold: {
      justifyContent: 'center',
      alignItems: 'center',
      ...Platform.select({
        ios: {
          marginTop: getSize.w(30),
        },
        android: {},
      }),
    },
    avatarBrozen: {
      justifyContent: 'center',
      alignItems: 'center',
      ...Platform.select({
        ios: {
          marginTop: getSize.w(60),
        },
        android: {
          marginTop: getSize.w(35),
        },
      }),
    },
    name: {
      fontSize: getSize.f(13),
      fontFamily: theme.fonts.sfPro.bold,
      //textTransform: 'uppercase',
      color: theme.colors.grayDark,
      marginTop: getSize.h(4),
    },
    point: {
      fontSize: getSize.f(14),
      fontFamily: theme.fonts.sfPro.bold,
      color: '#FFAA64',
      textTransform: 'uppercase',
      marginTop: getSize.h(4),
    },
    order: {
      fontSize: getSize.f(14),
      color: theme.colors.text2,
      fontFamily: theme.fonts.sfPro.medium,
    },
    borderBottom: {
      borderBottomColor: orangeLight.colors.divider,
      borderBottomWidth: 1,
    },
    wrapOrder: {
      flexDirection: 'row',
      width: getSize.w(40),
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  if (index === 0) {
    return (
      <View style={[styles.headerItem]}>
        <Touchable
          onPress={onSelect}
          activeOpacity={1}
          style={styles.headerItemChild}>
          <View style={styles.wrapOrder}>
            <Text style={styles.order}>{index + 4}</Text>
          </View>
          <View style={[styles.subWrapperItem]}>
            <View style={styles.wrapChild}>
              <Avatar
                size="message"
                noShadow
                data={data?.user?.data?.media?.avatar}
                source={{uri: data?.user?.data?.avatar}}
              />
              <Text style={[styles.name, {marginLeft: getSize.w(10)}]}>
                {data?.user?.data?.name}
              </Text>
            </View>
            <Text style={styles.point}>{data.point || data.quantity}</Text>
          </View>
        </Touchable>
      </View>
    );
  }
  return (
    <Touchable onPress={onSelect} activeOpacity={1} style={[styles.wrapper]}>
      <View style={[styles.wrapperItem]}>
        <View style={styles.wrapOrder}>
          <Text style={styles.order}>{index + 4}</Text>
        </View>
        <View style={[styles.subWrapperItem]}>
          <View style={styles.wrapChild}>
            <Avatar
              size="message"
              noShadow
              data={data?.user?.data?.media?.avatar}
              source={{uri: data?.user?.data?.avatar}}
            />
            <Text style={[styles.name, {marginLeft: getSize.w(10)}]}>
              {data?.user?.data?.name}
            </Text>
          </View>
          <Text style={styles.point}>{data.point || data.quantity}</Text>
        </View>
      </View>
    </Touchable>
  );
};

export default LeaderboardItem;
