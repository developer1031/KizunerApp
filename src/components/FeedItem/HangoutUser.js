import React from 'react';
import {StyleSheet, View} from 'react-native';
import moment from 'moment';
import {useNavigation} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import useTheme from 'theme';

import {showModalize, hideModalize} from 'actions';

import {getSize} from 'utils/responsive';
import {Touchable, Avatar, Text} from 'components';
const defaultFormat = 'LLL'; //'DD/MM/YYYY hh:mm A';

const HangoutUser = ({data, user, isFake}) => {
  const navigation = useNavigation();
  const theme = useTheme();
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.auth.userInfo);
  const styles = StyleSheet.create({
    headerUserWrap: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    headerUserInfo: {
      marginLeft: getSize.w(10),
    },
    headerUserName: {
      fontSize: getSize.f(16),
      fontFamily: theme.fonts.sfPro.medium,
    },
    withTitle: {
      fontSize: getSize.f(14),
      fontFamily: theme.fonts.sfPro.medium,
    },
    timeWrap: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  });

  function renderWithFriend() {
    if (data?.friends?.data?.length === 1) {
      return (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'flex-end',
          }}>
          <Text style={styles.withTitle}>{'with '}</Text>
          <Text style={styles.headerUserName}>
            {data?.friends?.data[0]?.name}
          </Text>
        </View>
      );
    }
    if (data?.friends?.data?.length > 1) {
      return (
        <Touchable
          onPress={onShowModalListFriend}
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'flex-end',
          }}>
          <Text style={styles.withTitle}>{'with '}</Text>
          <Text style={styles.headerUserName}>
            {data?.friends?.data?.length + ' others'}
          </Text>
        </Touchable>
      );
    }
  }

  function onShowModalListFriend() {
    dispatch(
      showModalize([
        ...data?.friends?.data?.map((item, i) => {
          return {
            label: item.name,
            onPress: () => {
              dispatch(hideModalize());
              navigation.push('UserProfile', {userId: item.id});
            },
          };
        }),
      ]),
    );
  }

  return (
    <Touchable
      disabled={
        userInfo?.id === data?.user?.data?.id || userInfo?.id === user?.id
          ? true
          : false
      }
      onPress={() => {
        if (isFake) {
          navigation.push('UserProfileBot', {
            userId: data?.user?.data?.id || user?.id,
          });
          return;
        }
        navigation.push('UserProfile', {
          userId: data?.user?.data?.id || user?.id,
        });
      }}
      style={styles.headerUserWrap}>
      <Avatar
        data={user ? undefined : data?.user?.data?.media?.avatar}
        size="header"
        source={!user ? undefined : {uri: user?.avatar}}
      />
      <View style={styles.headerUserInfo}>
        <Text style={styles.headerUserName}>
          {data?.user?.data?.name || user?.name}
        </Text>
        {renderWithFriend()}
        {data?.created_at && (
          <View style={styles.timeWrap}>
            <Text variant="caption">
              {moment(data.created_at).format(defaultFormat)}
            </Text>
            {data?.room_id && (
              <>
                <Text variant="caption"> · </Text>
                <MaterialCommunityIcons
                  name="lock"
                  color={theme.colors.text1}
                  size={getSize.f(16)}
                />
              </>
            )}
          </View>
        )}
      </View>
    </Touchable>
  );
};

export default HangoutUser;
