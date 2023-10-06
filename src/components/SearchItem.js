import React from 'react';
import {StyleSheet, View, Dimensions} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';

import useTheme from 'theme';
import {getSize} from 'utils/responsive';
import {Touchable, Text, Avatar} from 'components';
import {HangoutBody, HangoutUser} from 'components/FeedItem';
import {getPaymentString} from 'utils/mixed';

const width = Dimensions.get('window').width;

const SearchItem = ({data, type}) => {
  const theme = useTheme();
  const navigation = useNavigation();
  const userInfo = useSelector((state) => state.auth.userInfo);

  const styles = StyleSheet.create({
    wrapper: {
      paddingHorizontal: getSize.w(24),
      backgroundColor: theme.colors.paper,
      marginBottom: getSize.h(15),
    },
    statusWrapper: {
      paddingBottom: getSize.h(15),
      marginBottom: getSize.h(15),
      backgroundColor: theme.colors.paper,
      ...theme.shadow.small.ios,
      ...theme.shadow.small.android,
    },
    hangoutHead: {
      paddingHorizontal: getSize.w(24),
      borderBottomColor: theme.colors.divider,
      borderBottomWidth: getSize.h(1),
      paddingVertical: getSize.h(15),
    },
    container: {
      paddingVertical: getSize.h(10),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    infoWrap: {
      width: width - getSize.w(48 + 58 + 10),
    },
    infoMeta: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: getSize.h(5),
    },
    infoName: {
      fontFamily: theme.fonts.sfPro.medium,
      fontSize: getSize.f(17),
      width: width - getSize.w(48 + 58 + 10 + 70),
    },
    infoTime: {
      fontSize: getSize.f(12),
      color: theme.colors.text2,
    },
    infoDescription: {
      fontSize: getSize.f(15),
      color: theme.colors.text2,
    },
  });

  // console.log('data ne =======')
  // console.log(data)

  const thumbnail = data.cover?.path ? [data.cover] : [];

  if (type === 'status') {
    return (
      <View style={styles.statusWrapper}>
        <View style={styles.hangoutHead}>
          <HangoutUser data={data} user={data?.user} />
        </View>
        <HangoutBody
          isMinCapacity={data?.isMinCapacity}
          description={data?.status}
          thumbnail={thumbnail}
          id={data?.id}
          onPress={() =>
            navigation.push('StatusDetail', {
              statusId: data.id,
            })
          }
        />
      </View>
    );
  }

  if (type === 'hangout') {
    return (
      <View style={styles.statusWrapper}>
        <View style={styles.hangoutHead}>
          <HangoutUser data={data} user={data?.user} />
        </View>
        <HangoutBody
          type="hangout"
          isMinCapacity={data?.isMinCapacity}
          title={data.title}
          description={data.description}
          thumbnail={thumbnail}
          amount={
            !!data.is_range_price
              ? `${data.min_amount} - ${data.max_amount}`
              : data.amount
          }
          currencyMethod={getPaymentString(data.payment_method)}
          date={data.date}
          location={data.location}
          start={data.start}
          end={data.end}
          capacity={data.capacity}
          specialties={data.skills?.data}
          schedule={data.schedule}
          id={data.id}
          disableGuest={
            data?.user?.data?.id === userInfo?.id ||
            data?.user?.id === userInfo?.id
          }
          onPress={() =>
            navigation.push('HangoutDetail', {
              hangoutId: data.id,
            })
          }
        />
      </View>
    );
  }

  if (type === 'help') {
    return (
      <View style={styles.statusWrapper}>
        <View style={styles.hangoutHead}>
          <HangoutUser data={data} user={data?.user} />
        </View>
        <HangoutBody
          type="help"
          isMinCapacity={data?.isMinCapacity}
          title={data.title}
          description={data.description}
          thumbnail={thumbnail}
          amount={
            !!data.is_range_price
              ? `${data.min_amount} - ${data.max_amount}`
              : data.amount
          }
          currencyMethod={getPaymentString(data.payment_method)}
          date={data.date}
          location={data.location}
          start={data.start}
          end={data.end}
          capacity={data.capacity}
          specialties={data.skills?.data}
          schedule={data.schedule}
          id={data.id}
          disableGuest={
            data?.user?.data?.id === userInfo?.id ||
            data?.user?.id === userInfo?.id
          }
          onPress={() =>
            navigation.push('HelpDetail', {
              helpId: data.id,
            })
          }
        />
      </View>
    );
  }

  return (
    <Touchable
      disabled={userInfo?.id === data.id}
      onPress={() =>
        userInfo?.id !== data.id &&
        navigation.push('UserProfile', {userId: data.id})
      }
      style={styles.wrapper}>
      <View style={styles.container}>
        <Avatar noShadow data={data.original} size="message" />
        <View style={styles.infoWrap}>
          <View style={styles.infoMeta}>
            <Text style={styles.infoName} numberOfLines={1}>
              {data.name}
            </Text>
            {/* <Text style={styles.infoTime}>08:50</Text> */}
          </View>
          {/* <Text style={styles.infoDescription} numberOfLines={2}>
            Hello, It's nice to meet you!
          </Text> */}
        </View>
      </View>
    </Touchable>
  );
};

export default SearchItem;
