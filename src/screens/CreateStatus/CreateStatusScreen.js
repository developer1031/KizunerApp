import React from 'react';
import {StyleSheet, View, ScrollView, Keyboard} from 'react-native';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {useSelector, useDispatch} from 'react-redux';
import {Formik} from 'formik';
import * as yup from 'yup';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {IconButton as PaperIconButton} from 'react-native-paper';
import ImageMultiple from 'components/ImageMultiple/ImageMultiple';

import {
  Wrapper,
  HeaderBg,
  Text,
  Touchable,
  Loading,
  Paper,
  FormikInput,
  InputPhoto,
  FriendList,
} from 'components';
import useTheme from 'theme';
import {getSize} from 'utils/responsive';
import {createStatus, showAlert} from 'actions';

const CreateHangoutScreen = ({navigation}) => {
  const STATUS_BAR = getStatusBarHeight();
  const creating = useSelector((state) => state.feed.beingCreateStatus);
  const HEADER_HEIGHT = 120;
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();

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
    statusInput: {
      textAlignVertical: 'top',
      height: getSize.h(70),
      paddingTop: getSize.h(10),
    },

    form2: {
      paddingTop: getSize.h(20),
      paddingBottom: getSize.h(30),
      marginHorizontal: getSize.w(24),
      marginBottom: getSize.h(24),
    },
    flexRow: {
      alignItems: 'center',
      marginHorizontal: getSize.w(24),
      flexDirection: 'row',
    },
    formHeaderText: {
      fontFamily: theme.fonts.sfPro.medium,
      fontSize: getSize.f(15),
      textTransform: 'uppercase',
    },
    helper: {
      marginHorizontal: getSize.w(24),
    },
  });

  const lang = {
    title: 'Create Status',
    cancel: 'Cancel',
    post: 'Post',
    statusLabel: 'Status',
    statusPlace: 'What’s on your mind?',
    photoLabel: 'Add status photo/video',
  };

  const initialValues = {
    status: '',
    cover: null,
    friends: [],
  };

  function handleSubmit(values, {resetForm}) {
    let friendsTmp = [];
    values.friends.map((item, i) => {
      friendsTmp.push(item['user']['id']);
    });
    dispatch(
      createStatus(Object.assign(values, {friends: friendsTmp}), {
        success: () => {
          resetForm(initialValues);
          dispatch(
            showAlert({
              title: 'Success',
              body: 'New status posted!',
              type: 'success',
            }),
          );
          navigation.navigate('AppTab', {
            screen: 'MyPage',
          });
        },
      }),
    );
  }

  return (
    <Formik
      validateOnChange={false}
      initialValues={initialValues}
      validationSchema={yup.object().shape({
        status: yup.string().max(1000).required(),
        cover: yup.string().nullable(),
        friends: yup.array(yup.object()).min(0),
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
            {creating ? (
              <Loading />
            ) : (
              <Touchable onPress={formikProps.handleSubmit} disabled={creating}>
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
                name="status"
                {...formikProps}
                inputProps={{
                  placeholder: lang.statusPlace,
                  label: lang.statusLabel,
                  numberOfLines: 3,
                  style: styles.statusInput,
                  multiline: true,
                }}
              />
              {/* <InputPhoto
                isSelectVideo={true}
                label={lang.photoLabel}
                onChange={data => formikProps.setFieldValue('cover', data.id)}
                onDelete={() => formikProps.setFieldValue('cover', null)}
                limitVideo={20}
                resizeMode='contain'
                cropping={false}
              /> */}

              <ImageMultiple
                type="user.hangout"
                maxFilesImage={3}
                maxFilesVideo={1}
                editable
                label={lang.photoLabel}
                onChange={(data) => {
                  const listIdString = data.map((item) => item.id).join(';');
                  formikProps.setFieldValue('cover', listIdString);
                }}
              />
            </Paper>
            {/* <Paper style={styles.form2}>
              <View style={styles.flexRow}>
                <Text style={styles.formHeaderText}>Add friends</Text>
                <PaperIconButton
                  icon="plus-circle"
                  color={theme.colors.primary}
                  size={getSize.h(24)}
                  onPress={() => {
                    Keyboard.dismiss();
                    navigation.navigate('AddFriendPostScreen', {
                      initials:
                        formikProps.values &&
                        formikProps.values.friends &&
                        formikProps.values.friends.length !== 0
                          ? [
                              ...formikProps.values.friends.map(item => {
                                return item.user.id;
                              }),
                            ]
                          : [],
                      onSelect: values => {
                        values?.length &&
                          formikProps.setFieldError('friends', null);
                        formikProps.setFieldValue('friends', values);
                      },
                    });
                    formikProps.setFieldTouched('friends', true, true);
                  }}
                />
              </View>
              {formikProps.touched.friends && formikProps.errors?.friends && (
                <Text style={styles.helper} variant="errorHelper">
                  {formikProps.errors?.friends?.message ||
                    formikProps.errors?.friends}
                </Text>
              )}
              <FriendList data={formikProps.values.friends} />
            </Paper> */}
          </ScrollView>
        </Wrapper>
      )}
    </Formik>
  );
};

export default CreateHangoutScreen;
