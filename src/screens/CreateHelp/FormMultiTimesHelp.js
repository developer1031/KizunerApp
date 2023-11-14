import React, {useState} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import {IconButton as PaperIconButton} from 'react-native-paper';
import {Formik} from 'formik';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import * as yup from 'yup';
import {useSelector, useDispatch} from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment-timezone';
import CheckBox from '@react-native-community/checkbox';

import useTheme from 'theme';
import {
  Text,
  Input,
  Paper,
  SpecialtyList,
  InputPhoto,
  FormikInput,
  FriendList,
  FriendLishUpdateOrEdit,
  DateTimePicker,
  CheckBoxTitle,
} from 'components';
import {getSize} from 'utils/responsive';
import {hangoutFormat} from 'utils/datetime';

import {showAlert, createHelp, updateHelp, getSelfFeed} from 'actions';
import {EnumHangoutStatus} from 'utils/constants';
import ImageMultiple from 'components/ImageMultiple/ImageMultiple';

const FormMultiTimesHelp = ({navigation, route}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.auth.userInfo);
  const {formRef, initialValues, formType, callback} = route.params;
  const coords = useSelector((state) => state.location.coords);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [availableStatus, setAvailableStatus] = useState(
    initialValues?.available_status === EnumHangoutStatus.ONLINE
      ? EnumHangoutStatus.ONLINE
      : initialValues?.available_status === EnumHangoutStatus.NO_TIME
      ? EnumHangoutStatus.NO_TIME
      : initialValues?.available_status === EnumHangoutStatus.COMBINE
      ? EnumHangoutStatus.COMBINE
      : EnumHangoutStatus.NO_TIME,
  );
  const isOnline = initialValues.available_status === 'combine';
  // const [minCapacity, setMinCapacity] = useState(
  //   (initialValues?.isMinCapacity === 1 ? true : false) || false,
  // );

  const minimumFixedPrice = 10;

  const styles = StyleSheet.create({
    wrapper: {justifyContent: 'center', alignItems: 'center'},
    scrollWrap: {flex: 1},
    scrollCon: {
      paddingBottom: getSize.h(20) + insets.bottom,
      paddingTop: getSize.h(20),
    },
    form: {
      paddingVertical: getSize.h(30),
      paddingHorizontal: getSize.w(24),
      marginHorizontal: getSize.w(24),
      marginBottom: getSize.h(24),
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
    aboutInput: {
      textAlignVertical: 'top',
      height: getSize.h(100),
      paddingTop: getSize.h(10),
    },
    formHeaderText: {
      fontFamily: theme.fonts.sfPro.medium,
      fontSize: getSize.f(14),
    },
    timeWrap: {
      flexDirection: 'row',
    },
    timeStart: {
      flex: 1,
      marginRight: getSize.w(10),
    },
    timeEnd: {
      flex: 1,
      marginLeft: getSize.w(10),
    },
    infoWrap: {
      flexDirection: 'row',
      marginBottom: getSize.h(20),
    },
    infoText: {
      color: theme.colors.tagTxt,
      marginLeft: getSize.w(12),
    },
    keyAvoidView: {
      flex: 1,
    },
    helper: {
      marginHorizontal: getSize.w(24),
    },
    rowBox: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: getSize.w(12),
    },
    agreeBox: {
      left: -getSize.w(3),
      transform: [
        {
          scale: Platform.OS === 'ios' ? 0.8 : 1,
        },
      ],
    },
    contextBox: {
      paddingHorizontal: getSize.w(12),
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
  });

  const lang = {
    titleLabel: 'Title',
    titlePlace: 'enter help title',
    moreLabel: 'More info',
    morePlace: 'enter help information',
    photoLabel: 'Help Photo/Video',
    kizunaLabel: 'Kizuna (min 10 USD)',
    kizunaPlace: 'enter amounts of Kizuna',
    dateLabel: 'Date available',
    datePlace: 'ex. everyday, every weekend, etc.',
    startLabel: 'Start time',
    startPlace: '00:00',
    endLabel: 'End time',
    endPlace: '00:00',
    locationLabel: 'Location',
    capacityMinLabel: 'Help Minimum Capacity (optional)',
    capacityMinPlace: 'enter minimum number of helper',
    capacityLabel: 'Help Capacity',
    capacityPlace: 'enter number of helper',
  };

  const INITIAL_VALUES = {
    type: 2,
    title: initialValues?.title || '',
    description: initialValues?.description || '',
    cover: initialValues?.media?.data?.id,
    amount: initialValues?.amount ? initialValues?.amount?.toString() : '',
    schedule: initialValues?.schedule || '',
    address: initialValues?.location?.data?.address,
    short_address: initialValues?.location?.data?.short_address,
    lat: initialValues?.location?.data?.lat,
    lng: initialValues?.location?.data?.lng,
    categories: initialValues?.categories?.data || [],
    skills: initialValues?.skills?.data || [],
    friends: initialValues?.friends?.data || [],
    end: initialValues?.end ? moment.utc(initialValues?.end).toDate() : '',
    // isMinCapacity: (initialValues?.isMinCapacity === 1 ? true : false) || false,
  };

  const handleSubmit = (values, {resetForm}) => {
    let friendsTmp = [];
    if (formType === 'edit') {
      values.friends.map((item, i) => {
        friendsTmp.push(item.id);
      });
    } else {
      values.friends.map((item, i) => {
        friendsTmp.push(item.user.id);
      });
    }
    Keyboard.dismiss();
    let formData = {};
    if (availableStatus === null) {
      formData = {
        ...values,
        lat: values.lat.toString(),
        lng: values.lng.toString(),
        categories: values.categories.map((i) => i.id),
        skills: values.skills.map((i) => i.id),
        end: values.end,
        available_status: availableStatus,
        payment_method: 'credit',
      };
    } else if (availableStatus === EnumHangoutStatus.ONLINE) {
      formData = {
        ...values,
        lat: null,
        lng: null,
        address: null,
        short_address: null,
        categories: values.categories.map((i) => i.id),
        skills: values.skills.map((i) => i.id),
        end: values.end,
        available_status: availableStatus,
      };
    } else if (availableStatus === EnumHangoutStatus.NO_TIME) {
      formData = {
        ...values,
        lat: values.lat.toString(),
        lng: values.lng.toString(),
        categories: values.categories.map((i) => i.id),
        skills: values.skills.map((i) => i.id),
        end: null,
        available_status: availableStatus,
      };
    } else if (availableStatus === EnumHangoutStatus.COMBINE) {
      formData = {
        ...values,
        lat: null,
        lng: null,
        categories: values.categories.map((i) => i.id),
        skills: values.skills.map((i) => i.id),
        end: null,
        available_status: availableStatus,
        address: null,
        short_address: null,
      };
    }

    const data = {
      ...formData,
      payment_method: 'credit',
    };

    if (formType === 'edit') {
      dispatch(
        updateHelp(
          initialValues.id,
          Object.assign(data, {
            friends: friendsTmp,
            capacity: 1,
          }),
          () => {
            resetForm(INITIAL_VALUES);
            dispatch(getSelfFeed({page: 1}));
            navigation.navigate('AppTab', {
              screen: 'MyPage',
            });
          },
        ),
      );
    } else {
      dispatch(
        createHelp(
          Object.assign(formData, {
            friends: friendsTmp,
            current_location_lat: coords?.latitude,
            current_location_long: coords?.longitude,
          }),
          {
            success: (result) => {
              resetForm(INITIAL_VALUES);
              dispatch(
                showAlert({
                  title: 'Success',
                  body: 'New help added!',
                  type: 'success',
                }),
              );
              callback
                ? callback(result)
                : navigation.navigate('AppTab', {
                    screen: 'MyPage',
                  });
            },
          },
        ),
      );
    }
  };

  function onRenderCondition() {
    if (availableStatus === null) {
      return yup.object().shape({
        type: yup.number().required(),
        title: yup.string().max(125).required(),
        description: yup.string().max(1000).required(),
        schedule: yup.string().max(125).required(),
        cover: yup.string().nullable(),
        amount: yup
          .number()
          .min(minimumFixedPrice, `Minimum price is ${minimumFixedPrice}$`)
          .max(10000)
          .nullable()
          .integer()
          .typeError('Please enter number value only')
          .required(),
        address: yup.string().required(),
        short_address: yup.string().required(),
        lat: yup.string(),
        lng: yup.string(),
        categories: yup.array(yup.object()).min(1).required(),
        skills: yup.array(yup.object()).min(0),
        friends: yup.array(yup.object()).min(0),
        end: yup.string().nullable().required(),
      });
    } else if (availableStatus === EnumHangoutStatus.ONLINE) {
      return yup.object().shape({
        type: yup.number().required(),
        title: yup.string().max(125).required(),
        description: yup.string().max(1000).required(),
        schedule: yup.string().max(125).required(),
        cover: yup.string().nullable(),
        amount: yup
          .number()
          .min(0)
          .max(10000)
          .nullable()
          .integer()
          .typeError('Please enter number value only')
          .required(),
        categories: yup.array(yup.object()).min(1).required(),
        skills: yup.array(yup.object()).min(0),
        friends: yup.array(yup.object()).min(0),
        end: yup.string().nullable().required(),
      });
    } else if (availableStatus === EnumHangoutStatus.NO_TIME) {
      return yup.object().shape({
        type: yup.number().required(),
        title: yup.string().max(125).required(),
        description: yup.string().max(1000).required(),
        schedule: yup.string().max(125).required(),
        cover: yup.string().nullable(),
        amount: yup
          .number()
          .min(0)
          .max(10000)
          .nullable()
          .integer()
          .typeError('Please enter number value only')
          .required(),
        address: yup.string().required(),
        short_address: yup.string().required(),
        lat: yup.string(),
        lng: yup.string(),
        categories: yup.array(yup.object()).min(1).required(),
        skills: yup.array(yup.object()).min(0),
        friends: yup.array(yup.object()).min(0),
      });
    } else if (availableStatus === EnumHangoutStatus.COMBINE) {
      return yup.object().shape({
        type: yup.number().required(),
        title: yup.string().max(125).required(),
        description: yup.string().max(1000).required(),
        cover: yup.string().nullable(),
        amount: yup
          .number()
          .min(0)
          .max(10000)
          .nullable()
          .integer()
          .typeError('Please enter number value only')
          .required(),
        categories: yup.array(yup.object()).min(1).required(),
        skills: yup.array(yup.object()).min(0),
        friends: yup.array(yup.object()).min(0),
        schedule: yup.string().max(125).required(),
      });
    }
  }

  return (
    <Formik
      innerRef={formRef}
      validateOnChange={false}
      initialValues={INITIAL_VALUES}
      validationSchema={onRenderCondition()}
      onSubmit={handleSubmit}>
      {(formikProps) => (
        <View style={styles.scrollWrap}>
          <KeyboardAvoidingView
            behavior="padding"
            style={styles.keyAvoidView}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 135 : -200}>
            <ScrollView
              style={styles.scrollWrap}
              contentContainerStyle={styles.scrollCon}
              showsVerticalScrollIndicator={false}>
              {/* <Paper style={[styles.form2, {paddingBottom: getSize.w(20)}]}>
                <View style={styles.contextBox}>
                  <CheckBoxTitle
                    callback={setAvailableStatus}
                    status={EnumHangoutStatus.NO_TIME}
                    choose={availableStatus}
                    // title={'Is No time'}
                    title={'Default'}
                  />
                  <CheckBoxTitle
                    callback={setAvailableStatus}
                    status={EnumHangoutStatus.COMBINE}
                    choose={availableStatus}
                    // title={'No time & Online'}
                    title={'Online'}
                    isReverse={true}
                  />
                </View>
              </Paper> */}

              <Paper style={styles.form}>
                <FormikInput
                  name="title"
                  {...formikProps}
                  inputProps={{
                    label: lang.titleLabel,
                    placeholder: lang.titlePlace,
                  }}
                />
                <FormikInput
                  name="description"
                  {...formikProps}
                  inputProps={{
                    placeholder: lang.morePlace,
                    label: lang.moreLabel,
                    numberOfLines: 4,
                    style: styles.aboutInput,
                    multiline: true,
                  }}
                />
                {/* <InputPhoto
                  isSelectVideo={true}
                  label={lang.photoLabel}
                  onChange={data => formikProps.setFieldValue('cover', data.id)}
                  onDelete={() => formikProps.setFieldValue('cover', null)}
                  value={initialValues?.media?.data}
                  limitVideo={20}
                  resizeMode='contain'
                /> */}

                <ImageMultiple
                  type="user.hangout"
                  initialData={initialValues?.media?.data}
                  onChange={(data) => {
                    const listIdString = data.map((item) => item.id).join(';');
                    formikProps.setFieldValue('cover', listIdString);
                  }}
                  label={lang.photoLabel}
                  editable
                />
              </Paper>

              {/* {availableStatus === null && (
                <Paper style={styles.form}>
                  <FormikInput
                    name='schedule'
                    {...formikProps}
                    inputProps={{
                      label: lang.dateLabel,
                      placeholder: lang.datePlace,
                    }}
                  />
                  <View style={styles.infoWrap}>
                    <MaterialCommunityIcons
                      name='information-outline'
                      color={theme.colors.text}
                      size={getSize.f(20)}
                    />
                    <Text numberOfLines={2} style={styles.infoText}>
                      Helper contacts you via chat messenger!
                    </Text>
                  </View>
                  <Input
                    placeholder={'Tomorrow at 12:00'}
                    label={lang.endLabel}
                    touched={formikProps.touched.end}
                    value={hangoutFormat(formikProps.values.end)}
                    onPress={() => {
                      Keyboard.dismiss()
                      setShowEndTimePicker(true)
                      formikProps.setFieldTouched('end', true, true)
                    }}
                    error={formikProps.errors.end}
                    rightIconProps={{
                      icon: 'calendar',
                      color: theme.colors.primary,
                      size: getSize.f(24),
                    }}
                  />
                  <Input
                    placeholder='enter help location'
                    label={lang.locationLabel}
                    value={formikProps.values.short_address}
                    touched={formikProps.touched.short_address}
                    onPress={() => {
                      Keyboard.dismiss()
                      formikProps.setFieldTouched('short_address', true, true)
                      navigation.navigate('PickLocationPost', {
                        onSelect: data => {
                          formikProps.setFieldError('address', null)
                          formikProps.setFieldValue(
                            'short_address',
                            data.short_address,
                          )

                          formikProps.setFieldValue('address', data.address)
                          formikProps.setFieldValue('lat', data.lat)
                          formikProps.setFieldValue('lng', data.lng)
                        },
                      })
                    }}
                    error={formikProps.errors.address}
                    rightIconProps={{
                      icon: 'map-marker',
                      color: theme.colors.primary,
                      size: getSize.f(24),
                    }}
                  />
                </Paper>
              )}

              {EnumHangoutStatus.ONLINE === availableStatus && (
                <Paper style={styles.form}>
                  <FormikInput
                    name='schedule'
                    {...formikProps}
                    inputProps={{
                      label: lang.dateLabel,
                      placeholder: lang.datePlace,
                    }}
                  />
                  <View style={styles.infoWrap}>
                    <MaterialCommunityIcons
                      name='information-outline'
                      color={theme.colors.text}
                      size={getSize.f(20)}
                    />
                    <Text numberOfLines={2} style={styles.infoText}>
                      Helper contacts you via chat messenger!
                    </Text>
                  </View>
                  <Input
                    placeholder={'Tomorrow at 12:00'}
                    label={lang.endLabel}
                    touched={formikProps.touched.end}
                    value={hangoutFormat(formikProps.values.end)}
                    onPress={() => {
                      Keyboard.dismiss()
                      setShowEndTimePicker(true)
                      formikProps.setFieldTouched('end', true, true)
                    }}
                    error={formikProps.errors.end}
                    rightIconProps={{
                      icon: 'calendar',
                      color: theme.colors.primary,
                      size: getSize.f(24),
                    }}
                  />
                </Paper>
              )}

              {EnumHangoutStatus.NO_TIME === availableStatus && (
                <Paper style={styles.form}>
                  <FormikInput
                    name='schedule'
                    {...formikProps}
                    inputProps={{
                      label: lang.dateLabel,
                      placeholder: lang.datePlace,
                    }}
                  />
                  <View style={styles.infoWrap}>
                    <MaterialCommunityIcons
                      name='information-outline'
                      color={theme.colors.text}
                      size={getSize.f(20)}
                    />
                    <Text numberOfLines={2} style={styles.infoText}>
                      Helper contacts you via chat messenger!
                    </Text>
                  </View>

                  <Input
                    placeholder='enter help location'
                    label={lang.locationLabel}
                    value={formikProps.values.short_address}
                    touched={formikProps.touched.short_address}
                    onPress={() => {
                      Keyboard.dismiss()
                      formikProps.setFieldTouched('short_address', true, true)
                      navigation.navigate('PickLocationPost', {
                        onSelect: data => {
                          formikProps.setFieldError('address', null)
                          formikProps.setFieldValue(
                            'short_address',
                            data.short_address,
                          )

                          formikProps.setFieldValue('address', data.address)
                          formikProps.setFieldValue('lat', data.lat)
                          formikProps.setFieldValue('lng', data.lng)
                        },
                      })
                    }}
                    error={formikProps.errors.address}
                    rightIconProps={{
                      icon: 'map-marker',
                      color: theme.colors.primary,
                      size: getSize.f(24),
                    }}
                  />
                </Paper>
              )}

              {EnumHangoutStatus.COMBINE === availableStatus && (
                <Paper style={styles.form}>
                  <FormikInput
                    name='schedule'
                    {...formikProps}
                    inputProps={{
                      label: lang.dateLabel,
                      placeholder: lang.datePlace,
                    }}
                  />
                  <View style={styles.infoWrap}>
                    <MaterialCommunityIcons
                      name='information-outline'
                      color={theme.colors.text}
                      size={getSize.f(20)}
                    />
                    <Text numberOfLines={2} style={styles.infoText}>
                      Helper contacts you via chat messenger!
                    </Text>
                  </View>
                </Paper>
              )} */}

              <Paper style={styles.form}>
                <FormikInput
                  name="schedule"
                  {...formikProps}
                  inputProps={{
                    label: lang.dateLabel,
                    placeholder: lang.datePlace,
                  }}
                />
                {/* <View style={styles.infoWrap}>
                  <MaterialCommunityIcons
                    name='information-outline'
                    color={theme.colors.text}
                    size={getSize.f(20)}
                  />
                  <Text numberOfLines={2} style={styles.infoText}>
                    Helper contacts you via chat messenger!
                  </Text>
                </View> */}

                <View style={styles.rowBox}>
                  <CheckBox
                    disabled
                    value={isOnline}
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
                    onCheckColor={'grey'}
                    onTintColor={'grey'}
                  />
                  <Text style={[styles.formHeaderText, {color: 'grey'}]}>
                    Is Online
                  </Text>
                </View>

                {!isOnline && (
                  <Input
                    placeholder="enter help location"
                    label={lang.locationLabel}
                    value={formikProps.values.short_address}
                    touched={formikProps.touched.short_address}
                    onPress={() => {
                      Keyboard.dismiss();
                      formikProps.setFieldTouched('short_address', true, true);
                      navigation.navigate('PickLocationPost', {
                        onSelect: (data) => {
                          formikProps.setFieldError('address', null);
                          formikProps.setFieldValue(
                            'short_address',
                            data.short_address,
                          );

                          formikProps.setFieldValue('address', data.address);
                          formikProps.setFieldValue('lat', data.lat);
                          formikProps.setFieldValue('lng', data.lng);
                        },
                      });
                    }}
                    error={formikProps.errors.address}
                    rightIconProps={{
                      icon: 'map-marker',
                      color: theme.colors.primary,
                      size: getSize.f(24),
                    }}
                  />
                )}
              </Paper>

              <Paper style={styles.form}>
                <FormikInput
                  name="amount"
                  {...formikProps}
                  inputProps={{
                    placeholder: 'enter price',
                    label: `Price (USD)`,
                    keyboardType: 'numeric',
                    disabled: formType === 'edit',
                  }}
                />
                {/* <FormikInput
                  valueCheckBox={minCapacity}
                  callback={value => setMinCapacity(value)}
                  rightIconPropsCheckBox={true}
                  name='capacity'
                  {...formikProps}
                  inputProps={{
                    placeholder: !minCapacity
                      ? lang.capacityPlace
                      : lang.capacityMinPlace,
                    label: !minCapacity
                      ? lang.capacityLabel
                      : lang.capacityMinLabel,
                    keyboardType: 'number-pad',
                    disabled: formType === 'edit',
                  }}
                /> */}
              </Paper>

              <Paper style={styles.form2}>
                <View style={styles.flexRow}>
                  <Text style={styles.formHeaderText}>Categories</Text>
                  <PaperIconButton
                    icon="plus-circle"
                    color={theme.colors.primary}
                    size={getSize.h(24)}
                    onPress={() => {
                      Keyboard.dismiss();
                      navigation.navigate('PickCategory', {
                        initials: formikProps.values.categories,
                        suggests: userInfo.categories?.data,
                        onSelect: (values) => {
                          values?.length &&
                            formikProps.setFieldError('categories', null);
                          formikProps.setFieldValue('categories', values);
                        },
                      });
                      formikProps.setFieldTouched('categories', true, true);
                    }}
                  />
                </View>
                {formikProps.touched.categories &&
                  formikProps.errors?.categories && (
                    <Text style={styles.helper} variant="errorHelper">
                      {formikProps.errors?.categories?.message ||
                        formikProps.errors?.categories}
                    </Text>
                  )}
                <SpecialtyList data={formikProps.values.categories} />
              </Paper>

              <Paper style={styles.form2}>
                <View style={styles.flexRow}>
                  <Text style={styles.formHeaderText}>Specialties</Text>
                  <PaperIconButton
                    icon="plus-circle"
                    color={theme.colors.primary}
                    size={getSize.h(24)}
                    onPress={() => {
                      Keyboard.dismiss();
                      navigation.navigate('PickSpecialty', {
                        initials: formikProps.values.skills,
                        suggests: userInfo?.specialities?.data,
                        onSelect: (values) => {
                          values?.length &&
                            formikProps.setFieldError('skills', null);
                          formikProps.setFieldValue('skills', values);
                        },
                      });
                      formikProps.setFieldTouched('skills', true, true);
                    }}
                  />
                </View>
                {formikProps.touched.skills && formikProps.errors?.skills && (
                  <Text style={styles.helper} variant="errorHelper">
                    {formikProps.errors?.skills?.message ||
                      formikProps.errors?.skills}
                  </Text>
                )}
                <SpecialtyList data={formikProps.values.skills} />
              </Paper>
              {/* <Paper style={styles.form2}>
                <View style={styles.flexRow}>
                  <Text style={styles.formHeaderText}>Add friends</Text>
                  <PaperIconButton
                    icon='plus-circle'
                    color={theme.colors.primary}
                    size={getSize.h(24)}
                    onPress={() => {
                      Keyboard.dismiss()
                      if (formType === 'edit') {
                        Keyboard.dismiss()
                        navigation.navigate('EditOrUpdateFriendPostScreen', {
                          initials:
                            formikProps.values &&
                            formikProps.values.friends &&
                            formikProps.values.friends.length !== 0
                              ? [
                                  ...formikProps.values.friends.map(item => {
                                    return item.id
                                  }),
                                ]
                              : [],
                          onSelect: values => {
                            values?.length &&
                              formikProps.setFieldError('friends', null)
                            formikProps.setFieldValue('friends', values)
                          },
                        })
                        formikProps.setFieldTouched('friends', true, true)
                      } else {
                        navigation.navigate('AddFriendPostScreen', {
                          initials:
                            formikProps.values &&
                            formikProps.values.friends &&
                            formikProps.values.friends.length !== 0
                              ? [
                                  ...formikProps.values.friends.map(item => {
                                    return item.user.id
                                  }),
                                ]
                              : [],
                          onSelect: values => {
                            values?.length &&
                              formikProps.setFieldError('friends', null)
                            formikProps.setFieldValue('friends', values)
                          },
                        })
                        formikProps.setFieldTouched('friends', true, true)
                      }
                    }}
                  />
                </View>
                {formikProps.touched.friends && formikProps.errors?.friends && (
                  <Text style={styles.helper} variant='errorHelper'>
                    {formikProps.errors?.friends?.message ||
                      formikProps.errors?.friends}
                  </Text>
                )}
                {formType === 'edit' ? (
                  <FriendLishUpdateOrEdit data={formikProps.values.friends} />
                ) : (
                  <FriendList data={formikProps.values.friends} />
                )}
              </Paper> */}
            </ScrollView>
          </KeyboardAvoidingView>
          <DateTimePicker
            open={showStartTimePicker}
            onCancel={() => {
              setShowStartTimePicker(false);
            }}
            mode="datetime"
            onConfirm={(date) => {
              setShowStartTimePicker(false);
              formikProps.setFieldError('start', null);
              formikProps.setFieldValue('start', date);
            }}
            minimumDate={new Date()}
            maximumDate={
              formikProps.values.end
                ? moment(formikProps.values.end).toDate()
                : undefined
            }
            date={
              formikProps.values.start
                ? moment(formikProps.values.start).toDate()
                : moment().toDate()
            }
          />
          <DateTimePicker
            open={showEndTimePicker}
            onCancel={() => {
              setShowEndTimePicker(false);
            }}
            mode="datetime"
            onConfirm={(date) => {
              setShowEndTimePicker(false);
              formikProps.setFieldError('end', null);
              formikProps.setFieldValue('end', date);
            }}
            minimumDate={moment().toDate()}
            date={
              formikProps.values.end
                ? moment(formikProps.values.end).toDate()
                : moment().toDate()
            }
          />
        </View>
      )}
    </Formik>
  );
};

export default FormMultiTimesHelp;
