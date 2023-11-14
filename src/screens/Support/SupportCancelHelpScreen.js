import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, Platform} from 'react-native';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {CONTACT_US} from 'utils/constants';
import useTheme from 'theme';
import {getSize} from 'utils/responsive';
import {Wrapper, Text, Touchable, Paper, FormikInput, Button} from 'components';
import {WebView} from 'react-native-webview';
import LinearGradient from 'react-native-linear-gradient';
import {Formik} from 'formik';
import {KeyboardAvoidingView} from 'react-native';
import {ScrollView} from 'react-native';
import ImageMultiple from 'components/ImageMultiple/ImageMultiple';
import HeaderBg from 'components/HeaderBg';
import {View} from 'react-native';
import Loading from 'components/Loading';
import {useDispatch, useSelector} from 'react-redux';
import {updateOfferStatusHelp, postRating} from 'actions';
import * as yup from 'yup';
import CheckBox from '@react-native-community/checkbox';

const STATUS_BAR = getStatusBarHeight();

const SupportCancelHelpScreen = ({navigation, route}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const {userInfo} = useSelector((state) => state.auth);
  const {message, id, status, helpId, userId, callback} = route.params;

  const refForm = useRef(null);

  const HEADER_HEIGHT = 68 + insets.top;

  const styles = StyleSheet.create({
    headerBg: {zIndex: 1},
    wrapper: {flex: 1},
    backBtn: {
      position: 'absolute',
      top: getStatusBarHeight() + getSize.h(20),
      left: getSize.w(24),
      zIndex: 10,
    },
    headerTitle: {
      top: STATUS_BAR + getSize.h(26),
      textAlign: 'center',
      left: 0,
      right: 0,
      position: 'absolute',
      zIndex: 1,
    },
    form: {
      paddingVertical: getSize.h(30),
      paddingHorizontal: getSize.w(24),
      marginHorizontal: getSize.w(24),
      marginBottom: getSize.h(24),
    },
    messageInput: {
      textAlignVertical: 'top',
      height: getSize.h(100),
      paddingTop: getSize.h(10),
    },
    headerActions: {
      position: 'absolute',
      top: STATUS_BAR + getSize.h(26),
      left: getSize.w(24),
      right: getSize.w(24),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 1,
    },
    headerBtn: {
      fontSize: getSize.f(16),
      fontFamily: theme.fonts.sfPro.medium,
      color: theme.colors.textContrast,
    },
    rowBox: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 15,
    },
    formHeaderText: {
      fontFamily: theme.fonts.sfPro.medium,
      fontSize: getSize.f(14),
      flex: 1,
    },
  });

  const validationSchema = () => {
    return yup.object().shape({
      media_evidence: yup.string().when('is_able_contact', {
        is: (value) => value === true,
        then: yup.string().required('evidence is required'),
      }),
    });
  };
  const handleSubmit = (values) => {
    dispatch(
      updateOfferStatusHelp(
        {
          id,
          status,
          helpId,
          userId,
          ...values,
        },
        {
          success: () => callback?.(),
        },
      ),
    );

    !values.is_able_contact &&
      dispatch(
        postRating({
          offer_id: id,
          rate: 1,
          comment: 'cancel within 24h',
          user_id: userInfo.id,
        }),
      );

    navigation.goBack();
  };

  return (
    <Wrapper style={styles.wrapper}>
      <HeaderBg height={HEADER_HEIGHT} noBorder style={styles.headerBg} />
      <Text variant="header" style={styles.headerTitle}>
        Support
      </Text>
      <View style={styles.headerActions}>
        <Touchable
          onPress={() => {
            navigation.goBack();
          }}>
          <Text style={styles.headerBtn}>Cancel</Text>
        </Touchable>
        {false ? (
          <Loading />
        ) : (
          <Touchable
            onPress={() => {
              refForm.current?.handleSubmit();
            }}
            disabled={false}>
            <Text style={styles.headerBtn}>Submit</Text>
          </Touchable>
        )}
      </View>

      <View style={{height: HEADER_HEIGHT}} />

      <Formik
        innerRef={refForm}
        validateOnChange={false}
        validationSchema={validationSchema()}
        initialValues={{
          media_evidence: '',
          is_able_contact: false,
          is_within_time: true,
        }}
        onSubmit={handleSubmit}>
        {(formikProps) => {
          return (
            <KeyboardAvoidingView behavior="padding" style={{flex: 1}}>
              <ScrollView
                contentContainerStyle={{
                  paddingBottom: getSize.h(20) + insets.bottom,
                  paddingTop: getSize.h(20),
                }}
                showsVerticalScrollIndicator={false}>
                <Paper style={styles.form}>
                  <View style={styles.rowBox}>
                    <CheckBox
                      value={formikProps.getFieldProps('is_able_contact').value}
                      onValueChange={(value) => {
                        formikProps.setFieldValue('is_able_contact', value);
                      }}
                      style={{
                        left: -getSize.w(3),
                        transform: [
                          {
                            scale: Platform.OS === 'ios' ? 0.8 : 1,
                          },
                        ],
                      }}
                      boxType="square"
                      lineWidth={3}
                      onCheckColor={theme.colors.primary}
                      onTintColor={theme.colors.primary}
                    />
                    <Text style={styles.formHeaderText}>{message}</Text>
                  </View>

                  <ImageMultiple
                    type="help.offer"
                    editable
                    label="Evidence photo/video"
                    onChange={(data) => {
                      const urlListString = data
                        .map((media) => media.path)
                        .join(';');
                      const idListString = data
                        .map((media) => media.id)
                        .join(';');
                      formikProps.setFieldValue(
                        'media_evidence',
                        urlListString,
                      );
                      formikProps.setFieldValue('media_id', idListString);
                    }}
                  />
                  <Text variant="errorHelper" style={{marginBottom: 10}}>
                    {formikProps.errors.media_evidence}
                  </Text>
                </Paper>
              </ScrollView>
            </KeyboardAvoidingView>
          );
        }}
      </Formik>
    </Wrapper>
  );
};

export default SupportCancelHelpScreen;
