import React from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useSelector, useDispatch} from 'react-redux';
import {Formik} from 'formik';
import * as yup from 'yup';

import {
  Wrapper,
  HeaderBg,
  Text,
  Touchable,
  Loading,
  Paper,
  FormikInput,
} from 'components';
import useTheme from 'theme';
import {getSize} from 'utils/responsive';
import {reportContent} from 'actions';

const ReportContentScreen = ({navigation, route}) => {
  const {type, id} = route.params;

  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const STATUS_BAR = insets.top;
  const HEADER_HEIGHT = 120;

  const dispatch = useDispatch();
  const reporting = useSelector((state) => state.app.reporting);

  const styles = StyleSheet.create({
    wrapper: {flex: 1},
    headerBg: {zIndex: 1},
    headerTitle: {
      top: STATUS_BAR + getSize.h(26),
      textAlign: 'center',
      left: 0,
      right: 0,
      position: 'absolute',
      zIndex: 1,
    },
    headerActions: {
      position: 'absolute',
      top: STATUS_BAR + getSize.h(25),
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
    scrollWrap: {flex: 1, zIndex: 2, marginTop: STATUS_BAR + getSize.h(65)},
    scrollCon: {
      paddingBottom: getSize.h(20) + insets.bottom,
      paddingTop: getSize.h(10),
    },
    form: {
      paddingVertical: getSize.h(30),
      paddingHorizontal: getSize.w(24),
      marginHorizontal: getSize.w(24),
      marginBottom: getSize.h(24),
    },
    reasonInput: {
      textAlignVertical: 'top',
      height: getSize.h(100),
      paddingTop: getSize.h(10),
    },
  });

  const lang = {
    title: `Report ${type}`,
    cancel: 'Cancel',
    post: 'Send',
    reasonLabel: 'Reason',
    reasonPlace: `Why are you reporting this ${type}?`,
  };

  const initialValues = {
    reason: '',
  };

  function handleSubmit(values, {resetForm}) {
    dispatch(
      reportContent(
        {
          reason: values.reason,
          type,
          id,
        },
        () => {
          resetForm(initialValues);
          navigation.goBack();
        },
      ),
    );
  }

  return (
    <Formik
      validateOnChange={false}
      initialValues={initialValues}
      validationSchema={yup.object().shape({
        reason: yup.string().max(1000).required(),
      })}
      onSubmit={handleSubmit}>
      {(formikProps) => (
        <Wrapper style={styles.wrapper}>
          <HeaderBg
            height={HEADER_HEIGHT}
            style={styles.headerBg}
            addSBHeight
          />
          <Text variant="header" style={styles.headerTitle}>
            {lang.title}
          </Text>
          <View style={styles.headerActions}>
            <Touchable onPress={navigation.goBack}>
              <Text style={styles.headerBtn}>{lang.cancel}</Text>
            </Touchable>
            {reporting ? (
              <Loading />
            ) : (
              <Touchable
                onPress={formikProps.handleSubmit}
                disabled={reporting ? true : false}>
                <Text style={styles.headerBtn}>{lang.post}</Text>
              </Touchable>
            )}
          </View>
          <ScrollView
            style={styles.scrollWrap}
            contentContainerStyle={styles.scrollCon}
            showsVerticalScrollIndicator={false}>
            <Paper style={styles.form}>
              <FormikInput
                name="reason"
                {...formikProps}
                inputProps={{
                  placeholder: lang.reasonPlace,
                  label: lang.reasonLabel,
                  numberOfLines: 4,
                  style: styles.reasonInput,
                  multiline: true,
                }}
              />
            </Paper>
          </ScrollView>
        </Wrapper>
      )}
    </Formik>
  );
};

export default ReportContentScreen;
