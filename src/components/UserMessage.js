import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import useTheme from 'theme';
import {Text, Touchable} from 'components';
import {getSize} from 'utils/responsive';
import {createChatRelatedUser} from 'actions';

const UserMessage = ({data}) => {
  const theme = useTheme();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  if (!data) {
    return null;
  }

  const styles = StyleSheet.create({
    wrapper: {
      fontSize: getSize.w(16),
      lineHeight: getSize.w(20),
      marginTop: 5,
      marginBottom: 5,
      marginLeft: 10,
      marginRight: 10,
      paddingLeft: 10,
    },
    userName: {
      lineHeight: 20,
    },
    name: {
      color: theme.colors.primary,
    },
  });

  return (
    <View style={styles.wrapper}>
      <View style={styles.headerWrapper}>
        <Touchable
          onPress={() => {
            // navigation.push('UserProfile', {
            //   userId: data?.id,
            // });
            navigation.goBack();
            dispatch(createChatRelatedUser({members: [data?.id]}));
          }}
          scalable
          style={styles.userWrapper}>
          <Text style={styles.userName}>
            I am busy now, I would like to introduce another one person who can
            help you.
            <Text style={styles.name}> [{data.name}]</Text>
          </Text>
        </Touchable>
      </View>
    </View>
  );
};

export default UserMessage;
