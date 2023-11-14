import React, {useState, useRef, useEffect} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {IconButton as PaperIconButton} from 'react-native-paper';
import moment, {min} from 'moment-timezone';
import {Formik} from 'formik';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import * as yup from 'yup';
import {useSelector, useDispatch} from 'react-redux';
import {useTourGuideController} from 'rn-tourguide';

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
  createHangout,
  updateHangout,
  toggleIsSkipLauch,
  toggleIsFirstPost,
  getSelfFeed,
} from 'actions';
import {hangoutFormat} from 'utils/datetime';
import {EnumHangoutStatus} from 'utils/constants';
// import {getTimezone} from 'utils/geolocationService';
import CheckBox from '@react-native-community/checkbox';
import {SafeAreaView} from 'react-native';
import {AsyncStorage} from 'react-native';
import ImageMultiple from 'components/ImageMultiple/ImageMultiple';

const FormOneTimeHangout = ({navigation, route}, ...props) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.auth.userInfo);
  const coords = useSelector((state) => state.location.coords);
  const {formRef, initialValues, formType, callback, room_id} = route.params;
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
  // console.log('initialValues ---------')
  // console.log(initialValues)
  // const [minCapacity, setMinCapacity] = useState(
  //   (initialValues?.isMinCapacity === 1 ? true : false) || false,
  // );
  const [stepGuid, setStepGuid] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [isNoTime, setIsNoTime] = useState(false);

  const refScroll = useRef(null);

  const {canStart, start, stop, eventEmitter} = useTourGuideController();

  const minimumFixedPrice = 10;

  // useEffect(() => {
  //   if (!userInfo?.has_posted) {
  //     if (canStart) {
  //       setStepGuid(true);
  //       start();
  //     }
  //   }
  // }, [canStart, userInfo?.has_posted]);

  const handleOnStart = () => {};
  const handleOnStop = () => {
    // dispatch(
    //   showAlert({
    //     title: 'Success',
    //     body: `Now! Create your first post hangout!`,
    //     type: 'success',
    //   }),
    // );
    //setStepGuid(false);
  };
  const handleOnStepChange = (event) => {
    // if (event?.order >= 8) {
    //   refScroll?.current?.scrollToEnd({animated: true});
    // } else if (event?.order >= 5) {
    //   refScroll?.current?.scrollTo({
    //     y: getSize.h(600),
    //     animated: true,
    //   });
    // } else {
    //   refScroll?.current?.scrollTo({
    //     y: 0,
    //     animated: true,
    //   });
    // }
  };

  useEffect(() => {
    // eventEmitter?.on('start', handleOnStart);
    // eventEmitter?.on('stop', handleOnStop);
    // eventEmitter?.on('stepChange', handleOnStepChange);
    // return () => {
    //   eventEmitter?.off('start', handleOnStart);
    //   eventEmitter?.off('stop', handleOnStop);
    //   eventEmitter?.off('stepChange', handleOnStepChange);
    // };
  }, []);
  useEffect(() => {
    if (!initialValues?.available_status) {
      return;
    }

    setIsNoTime(
      (prev) =>
        (prev =
          initialValues.available_status === 'no_time' ||
          initialValues.available_status === 'combine'),
    );
    setIsOnline(
      (prev) =>
        (prev =
          initialValues.available_status === 'online' ||
          initialValues.available_status === 'combine'),
    );
  }, [initialValues?.available_status]);

  const styles = StyleSheet.create({
    disabled: {opacity: 0.5},
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
    keyAvoidView: {
      flex: 1,
    },
    helper: {
      marginHorizontal: getSize.w(24),
    },
    agreeBox: {
      left: -getSize.w(3),
      transform: [
        {
          scale: Platform.OS === 'ios' ? 0.8 : 1,
        },
      ],
    },
    infoWrap: {
      flexDirection: 'row',
      paddingHorizontal: getSize.w(24),
      marginVertical: getSize.w(8),
    },
    rowBox: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: getSize.w(12),
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
    titlePlace: 'enter hangout title',
    moreLabel: 'More info',
    morePlace: 'enter hangout information',
    photoLabel: 'Hangout Photo/Video',
    fileLabel: 'Hangout File',
    capacityLabel: 'Guest Capacity',
    capacityPlace: 'enter number of guests',
    dateLabel: 'Date available',
    startLabel: 'Start time',
    startPlace: '00:00',
    endLabel: 'End time',
    endPlace: '00:00',
    locationLabel: 'Location',
    capacityMinLabel: 'Guest Minimum Capacity (optional)',
    capacityMinPlace: 'enter minimum number of guests',
  };

  const INITIAL_VALUES = {
    type: 1,
    title: initialValues?.title || '',
    description: initialValues?.description || '',
    cover: initialValues?.media?.data?.id,
    amount: initialValues?.amount ? initialValues?.amount?.toString() : '',
    capacity: initialValues?.capacity
      ? initialValues?.capacity?.toString()
      : '',
    date: initialValues?.date || moment().format('DD/MM/YYYY'),
    start: initialValues?.start
      ? moment.utc(initialValues?.start).toDate()
      : '',
    end: initialValues?.start ? moment.utc(initialValues?.end).toDate() : '',
    address: initialValues?.location?.data?.address,
    short_address: initialValues?.location?.data?.short_address,
    lat: initialValues?.location?.data?.lat,
    lng: initialValues?.location?.data?.lng,
    skills: initialValues?.skills?.data || [],
    categories: initialValues?.categories?.data || [],
    friends: initialValues?.friends?.data || [],
    isMinCapacity: initialValues?.isMinCapacity
      ? initialValues?.isMinCapacity?.toString()
      : '',
  };

  const handleSubmit = (values, {setFieldError, resetForm}) => {
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

    if (moment(values.start).isAfter(moment(values.end))) {
      setFieldError('start', 'start time should before end time');
    } else {
      Keyboard.dismiss();
      const formData = {
        ...values,
        capacity: parseInt(values.capacity, 10),
        isMinCapacity: parseInt(values.isMinCapacity, 10),
        amount: values.amount.includes(',')
          ? parseFloat(values.amount.replace(',', '.'), 10)
          : parseFloat(values.amount, 10),
        start: values.start,
        end: values.end,
        skills: values.skills.map((i) => i.id),
        categories: values.categories.map((i) => i.id),
        room_id,
        available_status:
          isNoTime && isOnline
            ? 'combine'
            : isNoTime
            ? 'no_time'
            : isOnline
            ? 'online'
            : null,
        lat: isOnline ? null : values.lat.toString(),
        lng: isOnline ? null : values.lng.toString(),
        address: isOnline ? null : values.address,
        short_address: isOnline ? null : values.short_address,
        payment_method: 'credit',
      };
      // if (availableStatus === EnumHangoutStatus.NO_TIME) {
      //   formData = {
      //     ...values,

      //     //start: null,
      //     //end: null,
      //     capacity: parseInt(values.capacity, 10),
      //     isMinCapacity: parseInt(values.isMinCapacity, 10),
      //     amount: parseInt(values.amount, 10),
      //     skills: values.skills.map(i => i.id),
      //     categories: values.categories.map(i => i.id),
      //     room_id,
      //     available_status: availableStatus,
      //     start: null,
      //     end: null,
      //   }
      // } else if (availableStatus === EnumHangoutStatus.ONLINE) {
      //   formData = {
      //     ...values,
      //     capacity: parseInt(values.capacity, 10),
      //     isMinCapacity: parseInt(values.isMinCapacity, 10),
      //     amount: parseInt(values.amount, 10),
      //     //lat: values.lat.toString(),
      //     //lng: values.lng.toString(),
      //     start: values.start,
      //     end: values.end,
      //     skills: values.skills.map(i => i.id),
      //     categories: values.categories.map(i => i.id),
      //     room_id,
      //     available_status: availableStatus,
      //     address: null,
      //   }
      // } else if (availableStatus === EnumHangoutStatus.COMBINE) {
      //   formData = {
      //     ...values,
      //     capacity: parseInt(values.capacity, 10),
      //     isMinCapacity: parseInt(values.isMinCapacity, 10),
      //     amount: parseInt(values.amount, 10),
      //     start: null,
      //     end: null,
      //     skills: values.skills.map(i => i.id),
      //     categories: values.categories.map(i => i.id),
      //     room_id,
      //     available_status: availableStatus,
      //     address: null,
      //   }
      // } else {
      //   formData = {
      //     ...values,
      //     capacity: parseInt(values.capacity, 10),
      //     isMinCapacity: parseInt(values.isMinCapacity, 10),
      //     amount: parseInt(values.amount, 10),
      //     start: values.start,
      //     end: values.end,
      //     skills: values.skills.map(i => i.id),
      //     categories: values.categories.map(i => i.id),
      //     room_id,
      //     available_status: availableStatus,
      //   }
      // }

      if (formType === 'edit') {
        dispatch(
          updateHangout(
            initialValues.id,
            Object.assign(formData, {
              friends: friendsTmp,
              //isMinCapacity: minCapacity,
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
        dispatch(toggleIsFirstPost());
        dispatch(toggleIsSkipLauch(false));

        dispatch(
          createHangout(
            Object.assign(formData, {
              friends: friendsTmp,
              current_location_lat: coords?.latitude,
              current_location_long: coords?.longitude,
              //isMinCapacity: minCapacity,
            }),
            {
              success: (result) => {
                resetForm(INITIAL_VALUES);
                dispatch(
                  showAlert({
                    title: 'Success',
                    body: 'New hangout added!',
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
    }
  };

  function onRenderCondition() {
    return yup.object().shape({
      type: yup.number().required(),
      title: yup.string().max(125).nullable().required(),
      description: yup.string().max(1000).required(),
      cover: yup.string().nullable(),
      amount: yup
        .number()
        .min(minimumFixedPrice, `Minimum price is ${minimumFixedPrice}$`)
        .max(10000)
        .nullable()
        .integer()
        .required(),
      capacity: yup
        .number()
        .max(10000)
        .min(yup.ref('isMinCapacity'), 'capacity should more than min capacity')
        .nullable()
        .integer()
        .required(),
      isMinCapacity: yup
        .number()
        // //.max(yup.ref('capacity'), 'min capacity should lower capacity')
        .nullable()
        .default(null)
        .integer(),
      skills: yup.array(yup.object()).min(0),
      categories: yup.array(yup.object()).min(1),
      friends: yup.array(yup.object()).min(0),
      start: !isNoTime && yup.string().nullable().required(),
      end: !isNoTime && yup.string().nullable().required(),
      address: !isOnline && yup.string().nullable().required(),
      short_address: !isOnline && yup.string().nullable().required(),
      lat: !isOnline && yup.string(),
      lng: !isOnline && yup.string(),
    });
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
    //     amount: yup
    //       .number()
    //       .min(10)
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
    //     categories: yup.array(yup.object()).min(1),
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
    //     amount: yup
    //       .number()
    //       .min(10)
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
    //     // address: yup
    //     //   .string()
    //     //   .nullable()
    //     //   .required(),
    //     skills: yup.array(yup.object()).min(0),
    //     categories: yup.array(yup.object()).min(1),
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
    //     amount: yup
    //       .number()
    //       .min(10)
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
    //     skills: yup.array(yup.object()).min(0),
    //     categories: yup.array(yup.object()).min(1),
    //     friends: yup.array(yup.object()).min(0),
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
    //     amount: yup
    //       .number()
    //       .min(10)
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
    //     skills: yup.array(yup.object()).min(0),
    //     categories: yup.array(yup.object()).min(1),
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
        <SafeAreaView style={styles.scrollWrap}>
          {/* <StatusBar
            translucent={false}
            backgroundColor="transparent"
            barStyle="dark-content"
          /> */}
          <KeyboardAvoidingView
            behavior="padding"
            style={styles.keyAvoidView}
            keyboardVerticalOffset={
              Platform.OS === 'ios' ? (room_id ? 75 : 135) : -200
            }>
            <ScrollView
              scrollEnabled={!stepGuid}
              scrollEventThrottle={16}
              ref={refScroll}
              //onScroll={e => console.log(e.nativeEvent.contentOffset.y)}
              style={styles.scrollWrap}
              contentContainerStyle={styles.scrollCon}
              showsVerticalScrollIndicator={false}>
              {/* <Paper style={[styles.form2, {paddingBottom: getSize.w(20)}]}>
                <View
                  style={[
                    styles.contextBox,
                    initialValues?.offers_accepted > 0 && styles.disabled,
                  ]}>
                  <CheckBoxTitle
                    callback={setAvailableStatus}
                    status={null}
                    choose={availableStatus}
                    title={'Default'}
                    isReverse={false}
                    isDisable={stepGuid || initialValues?.offers_accepted > 0}
                  />
                  <CheckBoxTitle
                    callback={setAvailableStatus}
                    status={EnumHangoutStatus.ONLINE}
                    choose={availableStatus}
                    title={'Is Online'}
                    isReverse={true}
                    isDisable={stepGuid || initialValues?.offers_accepted > 0}
                  />
                  <CheckBoxTitle
                    callback={setAvailableStatus}
                    status={EnumHangoutStatus.NO_TIME}
                    choose={availableStatus}
                    title={'Is No time'}
                    isDisable={stepGuid || initialValues?.offers_accepted > 0}
                  />
                  <CheckBoxTitle
                    callback={setAvailableStatus}
                    status={EnumHangoutStatus.COMBINE}
                    choose={availableStatus}
                    title={'No time & Online'}
                    isReverse={true}
                    isDisable={stepGuid || initialValues?.offers_accepted > 0}
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
                    disabled: stepGuid,
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
                    disabled: stepGuid,
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
              <Paper style={styles.form}>
                <FormikInput
                  name="amount"
                  {...formikProps}
                  inputProps={{
                    placeholder: lang.kizunaPlace,
                    label: `Price (USD)`,
                    keyboardType: 'numeric',
                    disabled: stepGuid || formType === 'edit',
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
                    placeholder='enter hangout location'
                    label={lang.locationLabel}
                    touched={formikProps.touched.short_address}
                    value={formikProps.values.short_address}
                    onPress={() => {
                      Keyboard.dismiss()
                      formikProps.setFieldTouched('short_address', true, true)
                      navigation.navigate('PickLocationPost', {
                        onSelect: async data => {
                          console.log(data)
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
              {EnumHangoutStatus.NO_TIME === availableStatus && (
                <Paper style={styles.form}>
                  <Input
                    placeholder='enter hangout location'
                    label={lang.locationLabel}
                    touched={formikProps.touched.short_address}
                    value={formikProps.values.short_address}
                    onPress={() => {
                      Keyboard.dismiss()
                      formikProps.setFieldTouched('short_address', true, true)
                      navigation.navigate('PickLocationPost', {
                        onSelect: async data => {
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
              )} */}

              <Paper style={styles.form}>
                <View style={styles.rowBox}>
                  <CheckBox
                    value={isNoTime}
                    onValueChange={setIsNoTime}
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
                  <Text style={styles.formHeaderText}>No Time</Text>
                </View>

                {!isNoTime && (
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
                  />
                  <Text style={styles.formHeaderText}>Is Online</Text>
                </View>

                {!isOnline && (
                  <Input
                    placeholder="enter hangout location"
                    label={lang.locationLabel}
                    touched={formikProps.touched.short_address}
                    value={formikProps.values.short_address}
                    onPress={() => {
                      Keyboard.dismiss();
                      formikProps.setFieldTouched('short_address', true, true);
                      navigation.navigate('PickLocationPost', {
                        onSelect: async (data) => {
                          console.log(data);
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
            maximumDate={
              formikProps.values.end
                ? moment(formikProps.values.end).toDate()
                : undefined
            }
            minimumDate={moment().toDate()}
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
        </SafeAreaView>
      )}
    </Formik>
  );
};

export default FormOneTimeHangout;
