import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet} from 'react-native';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSafeArea} from 'react-native-safe-area-context';
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
import {supportByEmail} from 'actions';
import * as yup from 'yup';

const STATUS_BAR = getStatusBarHeight();

const SupportScreen = ({navigation, route}) => {
  const theme = useTheme();
  const insets = useSafeArea();
  const refForm = useRef(null);
  const {userInfo} = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const help_offer_id = route.params?.help_offer_id || '';
  const hangout_offer_id = route.params?.hangout_offer_id || '';

  useEffect(() => {
    refForm.current?.setFieldValue('name', userInfo.name);
    refForm.current?.setFieldValue('email', userInfo?.email);
  }, []);

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
  });

  const validationSchema = () => {
    return yup.object().shape({
      name: yup.string().required(),
      email: yup.string().email().required(),
      subject: yup.string().required(),
      message: yup.string().required(),
    });
  };
  const handleSubmit = (values) => {
    dispatch(supportByEmail({...values, help_offer_id, hangout_offer_id}));
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
            <Text style={styles.headerBtn}>Post</Text>
          </Touchable>
        )}
      </View>

      <View style={{height: HEADER_HEIGHT}} />
      <Formik
        innerRef={refForm}
        validateOnChange={false}
        validationSchema={validationSchema()}
        initialValues={{
          name: '',
          email: '',
          subject: '',
          message: '',
          media: '',
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
                    name="name"
                    {...formikProps}
                    inputProps={{
                      label: 'Name',
                      placeholder: 'enter name',
                    }}
                  />
                  <FormikInput
                    name="email"
                    {...formikProps}
                    inputProps={{
                      label: 'Email',
                      placeholder: 'enter email',
                    }}
                  />
                  <FormikInput
                    name="subject"
                    {...formikProps}
                    inputProps={{
                      label: 'Subject',
                      placeholder: 'enter subject',
                    }}
                  />
                  <FormikInput
                    name="message"
                    {...formikProps}
                    inputProps={{
                      placeholder: 'Message',
                      label: 'enter message',
                      numberOfLines: 4,
                      multiline: true,
                      style: styles.messageInput,
                    }}
                  />

                  <ImageMultiple
                    type="user.usersupport"
                    editable
                    label="Photo/video"
                    onChange={(data) => {
                      const mediaPaths = data
                        .map((media) => media.path)
                        .join(';');
                      const mediaIds = data.map((media) => media.id).join(';');
                      formikProps.setFieldValue('media', mediaPaths);
                      formikProps.setFieldValue('media_id', mediaIds);
                    }}
                  />
                </Paper>
              </ScrollView>
            </KeyboardAvoidingView>
          );
        }}
      </Formik>
    </Wrapper>
  );
};

export default SupportScreen;
