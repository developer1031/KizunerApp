import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
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
import {updateOfferStatus, postRating} from 'actions';
import * as yup from 'yup';
import CheckBox from '@react-native-community/checkbox';

const SupportRejectHangoutScreen = ({navigation, route}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const {userInfo} = useSelector((state) => state.auth);
  const {id, status, hangoutId, userId, callback} = route.params;

  const refForm = useRef(null);
  const STATUS_BAR = insets.top;

  const HEADER_HEIGHT = 68 + insets.top;

  const styles = StyleSheet.create({
    headerBg: {zIndex: 1},
    wrapper: {flex: 1},
    backBtn: {
      position: 'absolute',
      top: insets.top + getSize.h(20),
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
      subject_reject: yup.string().required('subject is required'),
      message_reject: yup.string().required('message is required'),
      media_evidence: yup.string().required('media is required'),
    });
  };
  const handleSubmit = (values) => {
    dispatch(
      updateOfferStatus(
        {
          id,
          status,
          hangoutId,
          userId,
          ...values,
        },
        {
          success: () => callback?.(),
        },
      ),
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
          subject_reject: '',
          message_reject: '',
          media_evidence: '',
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
                  <FormikInput
                    name="subject_reject"
                    {...formikProps}
                    inputProps={{
                      label: 'Subject',
                      placeholder: 'enter subject',
                    }}
                  />
                  <FormikInput
                    name="message_reject"
                    {...formikProps}
                    inputProps={{
                      label: 'Message',
                      placeholder: 'enter message',
                    }}
                  />

                  <ImageMultiple
                    type="hangout.offer"
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

export default SupportRejectHangoutScreen;
