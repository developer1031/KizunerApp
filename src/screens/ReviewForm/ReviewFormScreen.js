import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import * as yup from 'yup';
import {Formik} from 'formik';
import {useDispatch, useSelector} from 'react-redux';
import StarRating from 'react-native-star-rating';

import useTheme from 'theme';
import {getSize} from 'utils/responsive';
import {
  Wrapper,
  Paper,
  HeaderBg,
  Text,
  Touchable,
  FormikInput,
  Avatar,
  Loading,
} from 'components';
import {postRating, showAlert} from 'actions';

const ReviewFormScreen = ({navigation, route}) => {
  const theme = useTheme();
  const HEADER_HEIGHT = 120;
  const {offer} = route.params;
  const [rate, setRate] = useState(null);
  const dispatch = useDispatch();
  const {posting} = useSelector((state) => state.rating);

  const styles = StyleSheet.create({
    wrapper: {flex: 1},
    scrollWrap: {marginTop: -getSize.h(60), flex: 1},
    scrollCon: {
      paddingHorizontal: getSize.w(24),
      paddingTop: getSize.h(80),
      paddingBottom: getSize.h(20),
    },
    headerInfoWrap: {
      marginHorizontal: getSize.w(24),
      marginTop: getStatusBarHeight() + getSize.h(30),
    },
    headerInfo: {
      marginHorizontal: getSize.w(24),
      marginTop: getStatusBarHeight() + getSize.h(30),
      paddingVertical: getSize.h(22),
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: getSize.w(24),
      zIndex: 10,
    },
    backBtn: {
      position: 'absolute',
      top: getStatusBarHeight() + getSize.h(26),
      left: getSize.w(24),
      zIndex: 10,
    },
    sendBtn: {
      position: 'absolute',
      top: getStatusBarHeight() + getSize.h(26),
      right: getSize.w(24),
      zIndex: 10,
    },
    headerTitle: {
      top: getStatusBarHeight() + getSize.h(26),
      textAlign: 'center',
    },
    headerInfoItem: {
      flex: 1,
      paddingHorizontal: getSize.w(24),
      alignItems: 'flex-end',
    },
    balanceKizuna: {
      color: theme.colors.primary,
      fontSize: getSize.f(15),
    },
    incomeKizuna: {
      color: theme.colors.secondary,
      fontSize: getSize.f(15),
    },
    kizunaNumber: {
      fontSize: getSize.f(32),
      fontFamily: theme.fonts.sfPro.bold,
      letterSpacing: 0,
    },
    headerInfoLabel: {
      fontSize: getSize.f(15),
    },
    headerLogo: {
      width: getSize.w(43),
      height: getSize.w(43),
      resizeMode: 'contain',
      marginLeft: getSize.w(24),
    },
    sendBtnTxt: {
      fontSize: getSize.f(17),
      fontFamily: theme.fonts.sfPro.medium,
      color: theme.colors.textContrast,
    },
    formWrap: {
      marginHorizontal: getSize.w(24),
      marginVertical: getSize.h(20),
      paddingHorizontal: getSize.w(24),
      paddingVertical: getSize.h(45),
    },
    userWrap: {
      top: getSize.h(21),
      marginHorizontal: getSize.w(24),
    },
    userCont: {
      height: getSize.h(109),
      paddingHorizontal: getSize.w(24),
      alignItems: 'center',
      flexDirection: 'row',
    },
    userMeta: {
      marginLeft: getSize.w(16),
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
    },
    userName: {
      fontSize: getSize.f(18),
      fontFamily: theme.fonts.sfPro.semiBold,
      marginBottom: getSize.h(5),
    },
    ratingWrap: {
      marginTop: getSize.h(4),
    },
    star: {
      marginHorizontal: getSize.w(3),
    },
    reviewInput: {
      textAlignVertical: 'top',
      height: getSize.h(100),
      paddingTop: getSize.h(10),
    },
    disabled: {
      opacity: 0.3,
    },
  });

  return (
    <Formik
      validateOnChange={false}
      initialValues={{
        comment: '',
      }}
      validationSchema={yup.object().shape({
        comment: yup.string().max(1000).required(),
      })}
      onSubmit={(values) => {
        dispatch(
          postRating(
            {
              offer_id: offer?.id,
              rate,
              comment: values.comment,
              user_id: offer?.user?.data?.id,
            },
            () => {
              dispatch(
                showAlert({
                  type: 'success',
                  title: 'Success',
                  body: 'Rating posted!',
                }),
              );
              navigation.goBack();
            },
          ),
        );
      }}>
      {(formikProps) => (
        <Wrapper dismissKeyboard style={styles.wrapper}>
          <HeaderBg height={HEADER_HEIGHT} addSBHeight />
          <Touchable onPress={navigation.goBack} style={styles.backBtn}>
            <Text style={styles.sendBtnTxt}>Back</Text>
          </Touchable>
          <Text variant="header" style={styles.headerTitle}>
            Rating
          </Text>
          {posting ? (
            <Loading style={styles.sendBtn} />
          ) : (
            <Touchable
              onPress={formikProps.handleSubmit}
              style={[styles.sendBtn, rate === null && styles.disabled]}
              disabled={rate === null}>
              <Text style={styles.sendBtnTxt}>Submit</Text>
            </Touchable>
          )}
          <Paper style={styles.headerInfo}>
            <Avatar source={{uri: offer?.user?.data?.media?.avatar?.thumb}} />
            <View style={styles.userMeta}>
              <Text numberOfLines={1} style={styles.userName}>
                {offer?.user?.data?.name}
              </Text>
              <StarRating
                starSize={getSize.f(22)}
                maxStars={5}
                starStyle={styles.star}
                emptyStarColor={theme.colors.grayLight}
                fullStarColor={theme.colors.primary}
                selectedStar={(rating) => setRate(rating)}
                rating={rate}
              />
            </View>
          </Paper>
          {/* </Touchable> */}
          <Paper style={styles.formWrap}>
            <FormikInput
              name="comment"
              {...formikProps}
              inputProps={{
                placeholder: '*What do you think about your hangout friend?',
                label: 'Leave your review',
                numberOfLines: 4,
                style: styles.reviewInput,
                multiline: true,
              }}
            />
          </Paper>
        </Wrapper>
      )}
    </Formik>
  );
};

export default ReviewFormScreen;
