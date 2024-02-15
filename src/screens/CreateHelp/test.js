import React, {useState} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {IconButton as PaperIconButton} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import moment from 'moment-timezone';
import {Formik} from 'formik';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import * as yup from 'yup';
import {useSelector, useDispatch} from 'react-redux';

import useTheme from 'theme';
import {
  Text,
  Input,
  Paper,
  SpecialtyList,
  InputPhoto,
  DateTimePicker,
  FormikInput,
  FriendList,
  FriendLishUpdateOrEdit,
  CheckBoxTitle,
} from 'components';
import {getSize} from 'utils/responsive';
import {
  showAlert,
  createHelp,
  updateHelp,
  showModalize,
  hideModalize,
  hideAlert,
} from 'actions';
import {hangoutFormat} from 'utils/datetime';
import CheckBox from '@react-native-community/checkbox';
import {EnumHangoutStatus} from 'utils/constants';

// import {getTimezone} from 'utils/geolocationService';

const FormCreateHelp = ({navigation, route}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.auth.userInfo);
  const {formRef, initialValues, formType, callback, room_id} = route.params;
  const coords = useSelector((state) => state.location.coords);
  // const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [availableStatus, setAvailableStatus] = useState(
    initialValues?.available_status === EnumHangoutStatus.ONLINE
      ? EnumHangoutStatus.ONLINE
      : initialValues?.available_status === EnumHangoutStatus.NO_TIME
      ? EnumHangoutStatus.NO_TIME
      : initialValues?.available_status === EnumHangoutStatus.COMBINE
      ? EnumHangoutStatus.COMBINE
      : null,
  );
  const [isOnline, setIsOnline] = useState(false);
  // const [minCapacity, setMinCapacity] = useState(
  //   (initialValues?.isMinCapacity === 1 ? true : false) || false,
  // );
  const [helpType, setHelpType] = useState('oneTime'); // oneTime | multiTimes

  // const [timezone, setTimezone] = useState(moment.tz.guess());
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
      //textTransform: 'uppercase',
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
      // paddingHorizontal: getSize.w(12),
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    disabled: {opacity: 0.5},
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
    type: 1,
    title: initialValues?.title || '',
    description: initialValues?.description || '',
    cover: initialValues?.media?.data?.id,
    budget: initialValues?.budget ? initialValues?.budget?.toString() : '',
    capacity: initialValues?.capacity
      ? initialValues?.capacity?.toString()
      : '',
    date: initialValues?.date || moment().format('DD/MM/YYYY'),
    start: initialValues?.start
      ? moment.utc(initialValues?.start).toDate()
      : '',
    schedule: initialValues?.schedule?.toString(),
    end: initialValues?.start ? moment.utc(initialValues?.end).toDate() : '',
    address: initialValues?.location?.data?.address,
    short_address: initialValues?.location?.data?.short_address,
    lat: initialValues?.location?.data?.lat,
    lng: initialValues?.location?.data?.lng,
    categories: initialValues?.categories?.data || [],
    skills: initialValues?.skills?.data || [],
    friends: initialValues?.friends?.data || [],
    isMinCapacity: initialValues?.isMinCapacity
      ? initialValues?.isMinCapacity?.toString()
      : '',
  };

  const addKizuna = [
    {
      label: 'Add more Kizuna',
      icon: (
        <MaterialCommunityIcons
          size={getSize.f(20)}
          color={theme.colors.primary}
          name="wallet"
        />
      ),
      onPress: () => {
        dispatch(hideModalize());
        navigation.navigate('MyWallet');
      },
    },
    {
      label: 'Cancel',
      icon: (
        <MaterialCommunityIcons
          size={getSize.f(20)}
          color={theme.colors.primary}
          name="close-circle-outline"
        />
      ),
      onPress: () => {
        dispatch(hideModalize());
      },
    },
  ];

  const handleSubmit = (values, {setFieldError, resetForm}) => {
    console.log('=======');
    return;
    // let friendsTmp = [];
    // if (formType === 'edit') {
    //   values.friends.map((item, i) => {
    //     friendsTmp.push(item.id);
    //   });
    // } else {
    //   values.friends.map((item, i) => {
    //     friendsTmp.push(item.user.id);
    //   });
    // }

    // if (moment(values.start).isAfter(moment(values.end))) {
    //   setFieldError('start', 'start time should before end time');
    // } else {
    //   Keyboard.dismiss();
    //   let formData = {};
    //   if (availableStatus === null) {
    //     formData = {
    //       ...values,
    //       capacity: parseInt(values.capacity, 10),
    //       isMinCapacity: parseInt(values.isMinCapacity, 10),
    //       //kizuna: parseInt(values.kizuna, 10),
    //       lat: values.lat.toString(),
    //       lng: values.lng.toString(),
    //       start: values.start,
    //       end: values.end,
    //       categories: values.categories.map((i) => i.id),
    //       skills: values.skills.map((i) => i.id),
    //       room_id,
    //       available_status: availableStatus,
    //     };
    //   } else if (availableStatus === EnumHangoutStatus.ONLINE) {
    //     formData = {
    //       ...values,
    //       capacity: parseInt(values.capacity, 10),
    //       isMinCapacity: parseInt(values.isMinCapacity, 10),
    //       //kizuna: parseInt(values.kizuna, 10),
    //       start: values.start,
    //       end: values.end,
    //       categories: values.categories.map((i) => i.id),
    //       skills: values.skills.map((i) => i.id),
    //       room_id,
    //       available_status: availableStatus,
    //       lat: null,
    //       lng: null,
    //       address: null,
    //       short_address: null,
    //     };
    //   } else if (availableStatus === EnumHangoutStatus.NO_TIME) {
    //     formData = {
    //       ...values,
    //       capacity: parseInt(values.capacity, 10),
    //       isMinCapacity: parseInt(values.isMinCapacity, 10),
    //       //kizuna: parseInt(values.kizuna, 10),
    //       lat: values.lat.toString(),
    //       lng: values.lng.toString(),
    //       start: null,
    //       end: null,
    //       categories: values.categories.map((i) => i.id),
    //       skills: values.skills.map((i) => i.id),
    //       room_id,
    //       available_status: availableStatus,
    //     };
    //   } else if (availableStatus === EnumHangoutStatus.COMBINE) {
    //     formData = {
    //       ...values,
    //       address: null,
    //       short_address: null,
    //       capacity: parseInt(values.capacity, 10),
    //       isMinCapacity: parseInt(values.isMinCapacity, 10),
    //       lat: null,
    //       lng: null,
    //       start: null,
    //       end: null,
    //       categories: values.categories.map((i) => i.id),
    //       skills: values.skills.map((i) => i.id),
    //       room_id,
    //       available_status: availableStatus,
    //     };
    //   }
    //   if (formType === 'edit') {
    //     dispatch(
    //       updateHelp(
    //         initialValues.id,
    //         Object.assign(formData, {
    //           friends: friendsTmp,
    //         }),
    //         () => {
    //           resetForm(INITIAL_VALUES);
    //           navigation.navigate('AppTab', {
    //             screen: 'MyPage',
    //           });
    //         },
    //       ),
    //     );
    //   } else {
    //     dispatch(
    //       createHelp(
    //         Object.assign(formData, {
    //           friends: friendsTmp,
    //           current_location_lat: coords?.latitude,
    //           current_location_long: coords?.longitude,
    //         }),
    //         {
    //           success: (result) => {
    //             resetForm(INITIAL_VALUES);
    //             dispatch(
    //               showAlert({
    //                 title: 'Success',
    //                 body: 'New help added!',
    //                 type: 'success',
    //               }),
    //             );
    //             callback
    //               ? callback(result)
    //               : navigation.navigate('AppTab', {
    //                   screen: 'MyPage',
    //                 });
    //           },
    //           failure: (result) => {
    //             dispatch(
    //               showAlert({
    //                 title: 'Error',
    //                 body: result,
    //                 type: 'error',
    //               }),
    //             );
    //             if (
    //               result &&
    //               result === "You don't have enough Kizuna to create this Help"
    //             ) {
    //               setTimeout(() => {
    //                 dispatch(showModalize(addKizuna));
    //               }, 1000);
    //             }
    //           },
    //         },
    //       ),
    //     );
    //   }
    // }
  };

  function onRenderCondition() {
    return;
    // return yup.object().shape({
    //   type: yup.number().required(),
    //   title: yup.string().max(125).required(),
    //   description: yup.string().max(1000).required(),
    //   cover: yup.string().nullable(),
    //   budget: yup.number().min(0).max(10000).nullable().integer().required(),
    //   capacity:
    //     helpType === 'oneTime' &&
    //     yup.number().max(10000).min(10).nullable().integer().required(),
    //   isMinCapacity: yup
    //     .number()
    //     // //.max(yup.ref('capacity'), 'min capacity should lower capacity')
    //     .nullable()
    //     .default(null)
    //     .integer(),

    //   start: helpType === 'oneTime' && yup.string().nullable().required(),
    //   end: helpType === 'oneTime' && yup.string().nullable().required(),
    //   address: isOnline && yup.string().nullable().required(),
    //   short_address: isOnline && yup.string().nullable().required(),
    //   lat: isOnline && yup.string(),
    //   lng: isOnline && yup.string(),
    //   skills: yup.array(yup.object()).min(0),
    //   categories: yup.array(yup.object()).min(1).required(),
    //   friends: yup.array(yup.object()).min(0),
    // });
    // if (availableStatus === null) {
    //   return yup.object().shape({
    //     type: yup.number().required(),
    //     title: yup
    //       .string()
    //       .max(125)
    //       .required(),
    //     description: yup
    //       .string()
    //       .max(1000)
    //       .required(),
    //     cover: yup.string().nullable(),
    //     budget: yup
    //       .number()
    //       .min(0)
    //       .max(10000)
    //       .nullable()
    //       .integer()
    //       .required(),
    //     capacity: yup
    //       .number()
    //       .max(10000)
    //       .min(
    //         yup.ref('isMinCapacity'),
    //         'capacity should more than min capacity',
    //       )
    //       .nullable()
    //       .integer()
    //       .required(),
    //     isMinCapacity: yup
    //       .number()
    //       // //.max(yup.ref('capacity'), 'min capacity should lower capacity')
    //       .nullable()
    //       .default(null)
    //       .integer(),

    //     start: yup
    //       .string()
    //       .nullable()
    //       .required(),
    //     end: yup
    //       .string()
    //       .nullable()
    //       .required(),
    //     address: yup
    //       .string()
    //       .nullable()
    //       .required(),
    //     short_address: yup
    //       .string()
    //       .nullable()
    //       .required(),
    //     lat: yup.string(),
    //     lng: yup.string(),
    //     skills: yup.array(yup.object()).min(0),
    //     categories: yup
    //       .array(yup.object())
    //       .min(1)
    //       .required(),
    //     friends: yup.array(yup.object()).min(0),
    //   })
    // } else if (availableStatus === EnumHangoutStatus.ONLINE) {
    //   return yup.object().shape({
    //     type: yup.number().required(),
    //     title: yup
    //       .string()
    //       .max(125)
    //       .required(),
    //     description: yup
    //       .string()
    //       .max(1000)
    //       .required(),
    //     cover: yup.string().nullable(),
    //     budget: yup
    //       .number()
    //       .min(0)
    //       .max(10000)
    //       .nullable()
    //       .integer()
    //       .required(),
    //     isMinCapacity: yup
    //       .number()
    //       //.max(yup.ref('capacity'), 'min capacity should lower capacity')
    //       .nullable()
    //       .default(null)
    //       .integer(),
    //     capacity: yup
    //       .number()
    //       .max(10000)
    //       .min(
    //         yup.ref('isMinCapacity'),
    //         'capacity should more than min capacity',
    //       )
    //       .min(1)
    //       .nullable()
    //       .integer()
    //       .required(),
    //     start: yup
    //       .string()
    //       .nullable()
    //       .required(),
    //     end: yup
    //       .string()
    //       .nullable()
    //       .required(),
    //     // address: yup
    //     //   .string()
    //     //   .nullable()
    //     //   .required(),
    //     // lat: yup.string(),
    //     // lng: yup.string(),
    //     categories: yup
    //       .array(yup.object())
    //       .min(1)
    //       .required(),
    //     skills: yup.array(yup.object()).min(0),
    //     friends: yup.array(yup.object()).min(0),
    //   })
    // } else if (availableStatus === EnumHangoutStatus.NO_TIME) {
    //   return yup.object().shape({
    //     type: yup.number().required(),
    //     title: yup
    //       .string()
    //       .max(125)
    //       .required(),
    //     description: yup
    //       .string()
    //       .max(1000)
    //       .required(),
    //     cover: yup.string().nullable(),
    //     budget: yup
    //       .number()
    //       .min(0)
    //       .max(10000)
    //       .nullable()
    //       .integer()
    //       .required(),
    //     capacity: yup
    //       .number()
    //       .max(10000)
    //       .min(
    //         yup.ref('isMinCapacity'),
    //         'capacity should more than min capacity',
    //       )
    //       .nullable()
    //       .integer()
    //       .required(),
    //     isMinCapacity: yup
    //       .number()
    //       // //.max(yup.ref('capacity'), 'min capacity should lower capacity')
    //       .nullable()
    //       .default(null)
    //       .integer(),

    //     // start: yup
    //     //   .string()
    //     //   .nullable()
    //     //   .required(),
    //     // end: yup
    //     //   .string()
    //     //   .nullable()
    //     //   .required(),
    //     address: yup
    //       .string()
    //       .nullable()
    //       .required(),
    //     short_address: yup
    //       .string()
    //       .nullable()
    //       .required(),
    //     lat: yup.string(),
    //     lng: yup.string(),
    //     categories: yup
    //       .array(yup.object())
    //       .min(1)
    //       .required(),
    //     skills: yup.array(yup.object()).min(0),
    //     friends: yup.array(yup.object()).min(0),
    //   })
    // } else if (availableStatus === EnumHangoutStatus.COMBINE) {
    //   return yup.object().shape({
    //     type: yup.number().required(),
    //     title: yup
    //       .string()
    //       .max(125)
    //       .required(),
    //     description: yup
    //       .string()
    //       .max(1000)
    //       .required(),
    //     cover: yup.string().nullable(),
    //     budget: yup
    //       .number()
    //       .min(0)
    //       .max(10000)
    //       .nullable()
    //       .integer()
    //       .required(),
    //     capacity: yup
    //       .number()
    //       .max(10000)
    //       .min(
    //         yup.ref('isMinCapacity'),
    //         'capacity should more than min capacity',
    //       )
    //       .nullable()
    //       .integer()
    //       .required(),
    //     isMinCapacity: yup
    //       .number()
    //       // //.max(yup.ref('capacity'), 'min capacity should lower capacity')
    //       .nullable()
    //       .default(null)
    //       .integer(),
    //     categories: yup
    //       .array(yup.object())
    //       .min(1)
    //       .required(),
    //     skills: yup.array(yup.object()).min(0),
    //     friends: yup.array(yup.object()).min(0),
    //   })
    // }
  }

  // const defaultTimezone = moment.tz(timezone).format('Z');
  // console.log(timezone);
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
            keyboardVerticalOffset={
              Platform.OS === 'ios' ? (room_id ? 75 : 135) : -200
            }>
            <ScrollView
              style={styles.scrollWrap}
              contentContainerStyle={styles.scrollCon}
              showsVerticalScrollIndicator={false}>
              {/* <Paper style={[styles.form2, {paddingBottom: getSize.w(20)}]}>
                <View
                  style={[
                    styles.contextBox,
                    formType === 'edit' && styles.disabled,
                  ]}>
                  <CheckBoxTitle
                    callback={setAvailableStatus}
                    status={null}
                    choose={availableStatus}
                    title={'Default'}
                    isReverse={false}
                    isDisable={formType === 'edit'}
                  />
                  <CheckBoxTitle
                    callback={setAvailableStatus}
                    status={EnumHangoutStatus.ONLINE}
                    choose={availableStatus}
                    title={'Is Online'}
                    isReverse={true}
                    isDisable={formType === 'edit'}
                  />
                  <CheckBoxTitle
                    callback={setAvailableStatus}
                    status={EnumHangoutStatus.NO_TIME}
                    choose={availableStatus}
                    title={'Is No time'}
                    isDisable={formType === 'edit'}
                  />
                  <CheckBoxTitle
                    callback={setAvailableStatus}
                    status={EnumHangoutStatus.COMBINE}
                    choose={availableStatus}
                    title={'No time & Online'}
                    isReverse={true}
                    isDisable={formType === 'edit'}
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
                <InputPhoto
                  isSelectVideo={true}
                  label={lang.photoLabel}
                  onChange={(data) =>
                    formikProps.setFieldValue('cover', data.id)
                  }
                  onDelete={() => formikProps.setFieldValue('cover', null)}
                  value={initialValues?.media?.data}
                  limitVideo={20}
                  resizeMode="contain"
                />
              </Paper>

              {/* {availableStatus === null && (
                <Paper style={styles.form}>
                  <Input
                    placeholder={'Today at 05:00'}
                    label={lang.startLabel}
                    touched={formikProps.touched.start}
                    value={hangoutFormat(formikProps.values.start)}
                    onPress={() => {
                      Keyboard.dismiss()
                      setShowStartTimePicker(true)
                      formikProps.setFieldTouched('start', true, true)
                    }}
                    error={formikProps.errors.start}
                    rightIconProps={{
                      icon: 'calendar',
                      color: theme.colors.primary,
                      size: getSize.f(24),
                    }}
                  />
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
                    touched={formikProps.touched.short_address}
                    value={formikProps.values.short_address}
                    onPress={() => {
                      Keyboard.dismiss()
                      formikProps.setFieldTouched('short_address', true, true)
                      navigation.navigate('PickLocationPost', {
                        onSelect: async data => {
                          // const {timeZoneId} = await getTimezone({
                          //   latitude: data.lat,
                          //   longitude: data.lng,
                          //   timestamp: moment().unix(),
                          // });
                          // setTimezone(timeZoneId);
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

              {availableStatus === EnumHangoutStatus.ONLINE && (
                <Paper style={styles.form}>
                  <Input
                    placeholder={'Today at 05:00'}
                    label={lang.startLabel}
                    touched={formikProps.touched.start}
                    value={hangoutFormat(formikProps.values.start)}
                    onPress={() => {
                      Keyboard.dismiss()
                      setShowStartTimePicker(true)
                      formikProps.setFieldTouched('start', true, true)
                    }}
                    error={formikProps.errors.start}
                    rightIconProps={{
                      icon: 'calendar',
                      color: theme.colors.primary,
                      size: getSize.f(24),
                    }}
                  />
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

              {availableStatus === EnumHangoutStatus.NO_TIME && (
                <Paper style={styles.form}>
                  <Input
                    placeholder='enter help location'
                    label={lang.locationLabel}
                    touched={formikProps.touched.short_address}
                    value={formikProps.values.short_address}
                    onPress={() => {
                      Keyboard.dismiss()
                      formikProps.setFieldTouched('short_address', true, true)
                      navigation.navigate('PickLocationPost', {
                        onSelect: async data => {
                          // const {timeZoneId} = await getTimezone({
                          //   latitude: data.lat,
                          //   longitude: data.lng,
                          //   timestamp: moment().unix(),
                          // });
                          // setTimezone(timeZoneId);
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
              )} */}

              <Paper style={styles.form}>
                <View
                  style={[
                    styles.contextBox,
                    formType === 'edit' && styles.disabled,
                  ]}>
                  <CheckBoxTitle
                    callback={setHelpType}
                    status={'oneTime'}
                    choose={helpType}
                    title="One-Time"
                    isReverse={false}
                  />
                  <CheckBoxTitle
                    callback={setHelpType}
                    status={'multiTimes'}
                    choose={helpType}
                    title="Multi-times"
                    isReverse={true}
                  />
                </View>

                {helpType === 'oneTime' ? (
                  <>
                    <Input
                      placeholder={'Today at 05:00'}
                      label={lang.startLabel}
                      touched={formikProps.touched.start}
                      value={hangoutFormat(formikProps.values.start)}
                      onPress={() => {
                        Keyboard.dismiss();
                        setShowStartTimePicker(true);
                        formikProps.setFieldTouched('start', true, true);
                      }}
                      error={formikProps.errors.start}
                      rightIconProps={{
                        icon: 'calendar',
                        color: theme.colors.primary,
                        size: getSize.f(24),
                      }}
                    />
                    <Input
                      placeholder={'Tomorrow at 12:00'}
                      label={lang.endLabel}
                      touched={formikProps.touched.end}
                      value={hangoutFormat(formikProps.values.end)}
                      onPress={() => {
                        Keyboard.dismiss();
                        setShowEndTimePicker(true);
                        formikProps.setFieldTouched('end', true, true);
                      }}
                      error={formikProps.errors.end}
                      rightIconProps={{
                        icon: 'calendar',
                        color: theme.colors.primary,
                        size: getSize.f(24),
                      }}
                    />
                  </>
                ) : (
                  <FormikInput
                    name="schedule"
                    {...formikProps}
                    inputProps={{
                      label: lang.dateLabel,
                      placeholder: lang.datePlace,
                    }}
                  />
                )}

                <View style={styles.rowBox}>
                  <CheckBox
                    value={isOnline}
                    onValueChange={setIsOnline}
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
                    tintColors={{
                      true: theme.colors.primary,
                      false: theme.colors.inputLabel,
                    }}
                  />
                  <Text style={styles.formHeaderText}>Is Online</Text>
                </View>

                {!isOnline && (
                  <Input
                    placeholder="enter help location"
                    label={lang.locationLabel}
                    touched={formikProps.touched.short_address}
                    value={formikProps.values.short_address}
                    onPress={() => {
                      Keyboard.dismiss();
                      formikProps.setFieldTouched('short_address', true, true);
                      navigation.navigate('PickLocationPost', {
                        onSelect: async (data) => {
                          // const {timeZoneId} = await getTimezone({
                          //   latitude: data.lat,
                          //   longitude: data.lng,
                          //   timestamp: moment().unix(),
                          // });
                          // setTimezone(timeZoneId);
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
                  name="budget"
                  {...formikProps}
                  inputProps={{
                    placeholder: lang.kizunaPlace,
                    label: lang.kizunaLabel,
                    keyboardType: 'number-pad',
                    disabled: formType === 'edit',
                  }}
                />
                {/* <FormikInput
                  name='isMinCapacity'
                  {...formikProps}
                  inputProps={{
                    placeholder: lang.capacityMinPlace,
                    label: lang.capacityMinLabel,
                    keyboardType: 'number-pad',
                    disabled: formType === 'edit',
                  }}
                /> */}
                {helpType === 'oneTime' && (
                  <FormikInput
                    name="capacity"
                    {...formikProps}
                    inputProps={{
                      placeholder: lang.capacityPlace,
                      label: lang.capacityLabel,
                      keyboardType: 'number-pad',
                      disabled: formType === 'edit',
                    }}
                  />
                )}
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
            minimumDate={
              formikProps.values.start
                ? moment(formikProps.values.start).toDate()
                : undefined
            }
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

export default FormCreateHelp;
