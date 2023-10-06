import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import moment from 'moment';

import useTheme from 'theme';
import {createOfferHelp} from 'actions';
import {getSize} from 'utils/responsive';
import {Button, Text, Avatar, Touchable} from 'components';
import {hangoutRangeFormat} from 'utils/datetime';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const defaultFormat = 'LLL'; //'DD/MM/YYYY hh:mm A'

const HelpMessage = ({data}) => {
  const theme = useTheme();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const beingCreateOfferHelp = useSelector(
    (state) => state.feed.beingCreateOfferHelp,
  );
  const userInfo = useSelector((state) => state.auth.userInfo);

  const styles = StyleSheet.create({
    wrapper: {
      backgroundColor: theme.colors.paper,
      borderRadius: getSize.h(14),
      marginVertical: getSize.h(5),
      ...theme.shadow.large.ios,
      ...theme.shadow.large.android,
    },
    headerWrapper: {
      borderBottomWidth: getSize.h(1),
      borderBottomColor: theme.colors.divider,
      paddingHorizontal: getSize.w(16),
      paddingVertical: getSize.h(15),
    },
    userWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    bodyWrapper: {
      borderBottomWidth: getSize.h(1),
      borderBottomColor: theme.colors.divider,
      paddingHorizontal: getSize.w(16),
      paddingVertical: getSize.h(15),
    },
    userName: {
      fontFamily: theme.fonts.sfPro.medium,
      marginLeft: getSize.w(10),
      fontSize: getSize.f(15),
    },
    title: {
      fontFamily: theme.fonts.sfPro.medium,
      lineHeight: getSize.h(22),
      color: theme.colors.tagTxt,
      fontSize: getSize.f(16),
      marginBottom: getSize.h(5),
    },
    kizuna: {
      color: theme.colors.text2,
      fontSize: getSize.f(15),
      marginBottom: getSize.h(5),
    },
    date: {
      fontFamily: theme.fonts.sfPro.medium,
      fontSize: getSize.f(15),
      color: theme.colors.primary,
      marginBottom: getSize.h(5),
    },
    address: {
      lineHeight: getSize.h(22),
      color: theme.colors.tagTxt,
      fontSize: getSize.f(15),
    },
    actionsWrapper: {
      paddingHorizontal: getSize.w(16),
      paddingVertical: getSize.h(15),
      flexDirection: 'row',
    },
    btnTitle: {
      color: theme.colors.primary,
    },
    actionBtn: {
      borderColor: theme.colors.primary,
      paddingHorizontal: 0,
    },
    actionBtn2: {
      marginLeft: getSize.w(11),
      paddingHorizontal: 0,
    },
    btnContainer: {
      flexGrow: 1,
      flex: 1,
    },
  });

  if (!data) {
    return null;
  }

  function onShowDateEnd(end) {
    return ` - End: ${moment(end).format(defaultFormat)}`;
  }

  const shouldShowHangout =
    data?.can_help &&
    moment.utc(data.start).isAfter(moment()) &&
    data.user.id !== userInfo?.id;

  return (
    <View style={styles.wrapper}>
      <View style={styles.headerWrapper}>
        <Touchable
          onPress={() =>
            userInfo?.id !== data.user?.id &&
            navigation.push('UserProfile', {
              userId: data.user?.id,
            })
          }
          scalable
          style={styles.userWrapper}>
          <Avatar size="hangoutMessage" source={{uri: data.user.avatar}} />
          <Text numberOfLines={1} style={[styles.userName, {flex: 1}]}>
            {data.user.name}
          </Text>
          {/* <MaterialCommunityIcons
            name='lock'
            color={theme.colors.text1}
            size={getSize.f(16)}
          /> */}
        </Touchable>
      </View>
      <Touchable
        onPress={() =>
          navigation.push('HelpDetail', {
            helpId: data.id,
          })
        }
        style={styles.bodyWrapper}>
        <Text numberOfLines={2} style={styles.title}>
          {data.title}
          <Text style={{color: 'grey'}}> (Help)</Text>
        </Text>
        <Text style={styles.kizuna}>
          {data.is_range_price
            ? `${data.min_amount} - ${data.max_amount}`
            : data.amount}{' '}
          USD
        </Text>
        <Text style={styles.date}>
          {data.schedule
            ? data.schedule + onShowDateEnd(data.end || '')
            : hangoutRangeFormat(data.start, data.end)}
        </Text>
        <Text numberOfLines={2} style={styles.address}>
          {data.address}
        </Text>
      </Touchable>
      {data.type === 1 && (
        <View style={styles.actionsWrapper}>
          <Button
            onPress={() =>
              navigation.push('HelpDetail', {
                helpId: data.id,
              })
            }
            containerStyle={styles.btnContainer}
            variant="ghost"
            title="View"
            titleStyle={styles.btnTitle}
            style={styles.actionBtn}
          />
          {/* {shouldShowHangout && (
            <Button
              title='Help'
              loading={beingCreateOfferHelp.includes(data.id)}
              containerStyle={styles.btnContainer}
              style={styles.actionBtn2}
              onPress={() =>
                dispatch(
                  createOfferHelp({helpId: data.id, userId: data.user?.id}),
                )
              }
            />
          )} */}
        </View>
      )}
    </View>
  );
};

export default HelpMessage;
