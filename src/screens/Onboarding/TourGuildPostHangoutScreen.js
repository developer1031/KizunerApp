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
import moment from 'moment-timezone';
import {Formik} from 'formik';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import * as yup from 'yup';
import {useSelector, useDispatch} from 'react-redux';
import {TourGuideZone, useTourGuideController} from 'rn-tourguide';
import NavigationService from 'navigation/service';

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
  toggleIsFirstLaunch,
} from 'actions';
import {hangoutFormat} from 'utils/datetime';
import {EnumHangoutStatus} from 'utils/constants';
// import {getTimezone} from 'utils/geolocationService';

import {SafeAreaView} from 'react-native';

const TourGuildPostHangoutScreen = ({navigation, route}, ...props) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.auth.userInfo);
  const {formRef, initialValues, formType, callback, room_id} = route.params;
  // const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [availableStatus, setAvailableStatus] = useState(
    initialValues?.available_status === EnumHangoutStatus.ONLINE
      ? EnumHangoutStatus.ONLINE
      : initialValues?.available_status === EnumHangoutStatus.NO_TIME
      ? EnumHangoutStatus.NO_TIME
      : null,
  );
  const [minCapacity, setMinCapacity] = useState(
    (initialValues?.isMinCapacity === 1 ? true : false) || false,
  );
  const [stepGuid, setStepGuid] = useState(false);

  const refScroll = useRef(null);

  const {canStart, start, stop, eventEmitter} = useTourGuideController();

  useEffect(() => {
    // if (!userInfo?.has_posted) {
    //   if (canStart) {
    //     setStepGuid(true);
    //     start();
    //   }
    // }
    if (canStart) {
      setStepGuid(true);
      start();
    }
  }, [canStart, userInfo?.has_posted]);

  const handleOnStart = () => {};
  const handleOnStop = () => {
    setStepGuid(false);
    dispatch(toggleIsFirstLaunch(true));
    dispatch(toggleIsSkipLauch(true));
    NavigationService.navigate('AppTab');

    dispatch(
      showAlert({
        title: 'Success',
        body: 'Now! Create your first post hangout!',
        type: 'success',
      }),
    );
  };
  const handleOnStepChange = (event) => {
    if (event?.order >= 8) {
      refScroll?.current?.scrollToEnd({animated: true});
    } else if (event?.order >= 5) {
      refScroll?.current?.scrollTo({
        y: getSize.h(600),
        animated: true,
      });
    } else {
      refScroll?.current?.scrollTo({
        y: 0,
        animated: true,
      });
    }
  };

  React.useEffect(() => {
    eventEmitter?.on('start', handleOnStart);
    eventEmitter?.on('stop', handleOnStop);
    eventEmitter?.on('stepChange', handleOnStepChange);

    return () => {
      eventEmitter?.off('start', handleOnStart);
      eventEmitter?.off('stop', handleOnStop);
      eventEmitter?.off('stepChange', handleOnStepChange);
    };
  }, []);

  useEffect(() => {
    // start && start();
  }, []);

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
    capacityMinLabel: 'Guest Minimum Capacity',
    capacityMinPlace: 'enter number of guests',
    kizunaLabel: 'Kizuna (min 10 USD)',
    kizunaPlace: 'enter amounts of Kizuna',
  };

  const INITIAL_VALUES = {
    type: 1,
    title: initialValues?.title || '',
    description: initialValues?.description || '',
    cover: initialValues?.media?.data?.id,
    kizuna: initialValues?.kizuna ? initialValues?.kizuna?.toString() : '',
    capacity: initialValues?.capacity
      ? initialValues?.capacity?.toString()
      : '',
    date: initialValues?.date || moment().format('DD/MM/YYYY'),
    start: initialValues?.start
      ? moment.utc(initialValues?.start).toDate()
      : '',
    end: initialValues?.start ? moment.utc(initialValues?.end).toDate() : '',
    address: initialValues?.location?.data?.address,
    lat: initialValues?.location?.data?.lat,
    lng: initialValues?.location?.data?.lng,
    skills: initialValues?.skills?.data || [],
    categories: initialValues?.categories?.data || [],
    friends: initialValues?.friends?.data || [],
    isMinCapacity: (initialValues?.isMinCapacity === 1 ? true : false) || false,
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
      let formData = {};
      if (availableStatus === EnumHangoutStatus.NO_TIME) {
        formData = {
          ...values,

          //start: null,
          //end: null,
          capacity: parseInt(values.capacity, 10),
          kizuna: parseInt(values.kizuna, 10),
          skills: values.skills.map((i) => i.id),
          categories: values.categories.map((i) => i.id),
          room_id,
          available_status: availableStatus,
          start: null,
          end: null,
        };
      } else if (availableStatus === EnumHangoutStatus.ONLINE) {
        formData = {
          ...values,
          capacity: parseInt(values.capacity, 10),
          kizuna: parseInt(values.kizuna, 10),
          //lat: values.lat.toString(),
          //lng: values.lng.toString(),
          start: values.start,
          end: values.end,
          skills: values.skills.map((i) => i.id),
          categories: values.categories.map((i) => i.id),
          room_id,
          available_status: availableStatus,
          address: null,
        };
      } else if (availableStatus === EnumHangoutStatus.COMBINE) {
        formData = {
          ...values,
          capacity: parseInt(values.capacity, 10),
          kizuna: parseInt(values.kizuna, 10),
          start: null,
          end: null,
          skills: values.skills.map((i) => i.id),
          categories: values.categories.map((i) => i.id),
          room_id,
          available_status: availableStatus,
          address: null,
        };
      } else {
        formData = {
          ...values,
          capacity: parseInt(values.capacity, 10),
          kizuna: parseInt(values.kizuna, 10),
          start: values.start,
          end: values.end,
          skills: values.skills.map((i) => i.id),
          categories: values.categories.map((i) => i.id),
          room_id,
          available_status: availableStatus,
        };
      }

      if (formType === 'edit') {
        //dispatch(toggleIsSkipLauch(false));
        dispatch(
          updateHangout(
            initialValues.id,
            Object.assign(formData, {
              friends: friendsTmp,
              isMinCapacity: minCapacity,
            }),
            () => {
              resetForm(INITIAL_VALUES);
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
              isMinCapacity: minCapacity,
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
    if (availableStatus === null) {
      return yup.object().shape({
        type: yup.number().required(),
        title: yup.string().max(125).required(),
        description: yup.string().max(1000).required(),
        cover: yup.string().nullable(),
        kizuna: yup.number().min(10).max(10000).nullable().integer().required(),
        capacity: yup.number().max(10000).nullable().integer(),
        start: yup.string().nullable().required(),
        end: yup.string().nullable().required(),
        address: yup.string().nullable().required(),
        lat: yup.string(),
        lng: yup.string(),
        skills: yup.array(yup.object()).min(0),
        categories: yup.array(yup.object()).min(1),
        friends: yup.array(yup.object()).min(0),
      });
    } else if (availableStatus === EnumHangoutStatus.ONLINE) {
      return yup.object().shape({
        type: yup.number().required(),
        title: yup.string().max(125).required(),
        description: yup.string().max(1000).required(),
        cover: yup.string().nullable(),
        kizuna: yup.number().min(10).max(10000).nullable().integer().required(),
        capacity: yup.number().max(10000).nullable().integer(),
        start: yup.string().nullable().required(),
        end: yup.string().nullable().required(),
        // address: yup
        //   .string()
        //   .nullable()
        //   .required(),
        skills: yup.array(yup.object()).min(0),
        categories: yup.array(yup.object()).min(1),
        friends: yup.array(yup.object()).min(0),
      });
    } else if (availableStatus === EnumHangoutStatus.NO_TIME) {
      return yup.object().shape({
        type: yup.number().required(),
        title: yup.string().max(125).required(),
        description: yup.string().max(1000).required(),
        cover: yup.string().nullable(),
        kizuna: yup.number().min(10).max(10000).nullable().integer().required(),
        capacity: yup.number().max(10000).nullable().integer(),
        skills: yup.array(yup.object()).min(0),
        categories: yup.array(yup.object()).min(1),
        friends: yup.array(yup.object()).min(0),
        address: yup.string().nullable().required(),
        lat: yup.string(),
        lng: yup.string(),
      });
    } else if (availableStatus === EnumHangoutStatus.COMBINE) {
      return yup.object().shape({
        type: yup.number().required(),
        title: yup.string().max(125).required(),
        description: yup.string().max(1000).required(),
        cover: yup.string().nullable(),
        kizuna: yup.number().min(10).max(10000).nullable().integer().required(),
        capacity: yup.number().max(10000).nullable().integer(),
        skills: yup.array(yup.object()).min(0),
        categories: yup.array(yup.object()).min(1),
        friends: yup.array(yup.object()).min(0),
      });
    }
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
          <KeyboardAvoidingView behavior="padding" style={styles.keyAvoidView}>
            <ScrollView
              scrollEnabled={!stepGuid}
              scrollEventThrottle={16}
              ref={refScroll}
              //onScroll={e => console.log(e.nativeEvent.contentOffset.y)}
              style={styles.scrollWrap}
              contentContainerStyle={styles.scrollCon}
              showsVerticalScrollIndicator={false}>
              <Paper style={[styles.form2, {paddingBottom: getSize.w(20)}]}>
                <TourGuideZone
                  zone={1}
                  text={'Status of your hangout post! 🎉'}
                  borderRadius={16}>
                  <View style={styles.contextBox}>
                    <CheckBoxTitle
                      callback={setAvailableStatus}
                      status={null}
                      choose={availableStatus}
                      title={'Default'}
                      isReverse={false}
                      isDisable={stepGuid}
                    />
                    <CheckBoxTitle
                      callback={setAvailableStatus}
                      status={EnumHangoutStatus.ONLINE}
                      choose={availableStatus}
                      title={'Is Online'}
                      isReverse={true}
                      isDisable={stepGuid}
                    />
                    <CheckBoxTitle
                      callback={setAvailableStatus}
                      status={EnumHangoutStatus.NO_TIME}
                      choose={availableStatus}
                      title={'Is Time Free'}
                      isDisable={stepGuid}
                    />
                    <CheckBoxTitle
                      callback={setAvailableStatus}
                      status={EnumHangoutStatus.COMBINE}
                      choose={availableStatus}
                      title={'Time Free & Online'}
                      isReverse={true}
                      isDisable={stepGuid}
                    />
                  </View>
                </TourGuideZone>
              </Paper>

              <Paper style={styles.form}>
                <TourGuideZone
                  zone={2}
                  text={'A title in your hangout!'}
                  borderRadius={16}>
                  <FormikInput
                    name="title"
                    {...formikProps}
                    inputProps={{
                      label: lang.titleLabel,
                      placeholder: lang.titlePlace,
                      disabled: stepGuid,
                    }}
                  />
                </TourGuideZone>

                <TourGuideZone
                  zone={3}
                  text={'A description in your hangout!'}
                  borderRadius={16}>
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
                </TourGuideZone>

                <TourGuideZone
                  tooltipBottomOffset={Platform.OS === 'android' ? 20 : 10}
                  zone={4}
                  text={'A image or video thumbnail in your hangout'}
                  borderRadius={16}>
                  <InputPhoto
                    isSelectVideo={true}
                    label={lang.photoLabel}
                    onChange={(data) =>
                      formikProps.setFieldValue('cover', data.id)
                    }
                    onDelete={() => formikProps.setFieldValue('cover', null)}
                    value={initialValues?.media?.data}
                    limitVideo={20}
                    disabled={stepGuid}
                    resizeMode="contain"
                  />
                </TourGuideZone>
              </Paper>
              <Paper style={styles.form}>
                <TourGuideZone
                  zone={5}
                  text={'Kizuna you will receive in your hangout'}
                  borderRadius={16}>
                  <FormikInput
                    name="kizuna"
                    {...formikProps}
                    inputProps={{
                      placeholder: lang.kizunaPlace,
                      label: lang.kizunaLabel,
                      keyboardType: 'number-pad',
                      disabled: stepGuid || formType === 'edit',
                    }}
                  />
                </TourGuideZone>

                <TourGuideZone
                  zone={6}
                  text={'Number of guest capacity in your hangout'}
                  borderRadius={16}>
                  <FormikInput
                    valueCheckBox={minCapacity}
                    callback={(value) => {
                      setMinCapacity(value);
                    }}
                    rightIconPropsCheckBox={true}
                    name="capacity"
                    {...formikProps}
                    inputProps={{
                      placeholder: !minCapacity
                        ? lang.capacityPlace
                        : lang.capacityMinPlace,
                      label: !minCapacity
                        ? lang.capacityLabel
                        : lang.capacityMinLabel,
                      keyboardType: 'number-pad',
                      disabled: stepGuid || formType === 'edit',
                    }}
                  />
                </TourGuideZone>
              </Paper>
              {availableStatus === null && (
                <Paper style={styles.form}>
                  <TourGuideZone
                    tooltipBottomOffset={Platform.OS === 'android' ? 20 : 10}
                    zone={7}
                    text={'Start time to end time and location in your hangout'}
                    borderRadius={16}>
                    <Input
                      placeholder={'Today at 05:00'}
                      label={lang.startLabel}
                      touched={formikProps.touched.start}
                      value={hangoutFormat(formikProps.values.start)}
                      onPress={() => {
                        if (stepGuid) {
                          return;
                        }
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
                        if (stepGuid) {
                          return;
                        }
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
                      disabled={stepGuid}
                    />
                    <Input
                      placeholder="enter hangout location"
                      label={lang.locationLabel}
                      touched={formikProps.touched.address}
                      value={formikProps.values.address}
                      onPress={() => {
                        if (stepGuid) {
                          return;
                        }
                        Keyboard.dismiss();
                        formikProps.setFieldTouched('address', true, true);
                        navigation.navigate('PickLocation', {
                          onSelect: async (data) => {
                            // const {timeZoneId} = await getTimezone({
                            //   latitude: data.lat,
                            //   longitude: data.lng,
                            //   timestamp: moment().unix(),
                            // });
                            // setTimezone(timeZoneId);
                            formikProps.setFieldError('address', null);
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
                  </TourGuideZone>
                </Paper>
              )}
              {EnumHangoutStatus.NO_TIME === availableStatus && (
                <Paper style={styles.form}>
                  <Input
                    placeholder="enter hangout location"
                    label={lang.locationLabel}
                    touched={formikProps.touched.address}
                    value={formikProps.values.address}
                    onPress={() => {
                      Keyboard.dismiss();
                      formikProps.setFieldTouched('address', true, true);
                      navigation.navigate('PickLocation', {
                        onSelect: async (data) => {
                          // const {timeZoneId} = await getTimezone({
                          //   latitude: data.lat,
                          //   longitude: data.lng,
                          //   timestamp: moment().unix(),
                          // });
                          // setTimezone(timeZoneId);
                          formikProps.setFieldError('address', null);
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
                </Paper>
              )}

              <Paper style={styles.form2}>
                <TourGuideZone
                  zone={8}
                  text={'Categories of you in your hangout'}
                  borderRadius={16}>
                  <View style={styles.flexRow}>
                    <Text style={styles.formHeaderText}>Categories</Text>
                    <PaperIconButton
                      disabled={stepGuid}
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
                </TourGuideZone>

                <SpecialtyList data={formikProps.values.categories} />
              </Paper>

              <Paper style={styles.form2}>
                <TourGuideZone
                  zone={9}
                  text={'Specialties of you in your hangout'}
                  borderRadius={16}>
                  <View style={styles.flexRow}>
                    <Text style={styles.formHeaderText}>Specialties</Text>
                    <PaperIconButton
                      disabled={stepGuid}
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
                </TourGuideZone>

                <SpecialtyList data={formikProps.values.skills} />
              </Paper>
              <Paper style={styles.form2}>
                <TourGuideZone
                  zone={10}
                  text={'Tag friends of you in your hangout'}
                  borderRadius={16}>
                  <View style={styles.flexRow}>
                    <Text style={styles.formHeaderText}>Add friends</Text>
                    <PaperIconButton
                      disabled={stepGuid}
                      icon="plus-circle"
                      color={theme.colors.primary}
                      size={getSize.h(24)}
                      onPress={() => {
                        Keyboard.dismiss();
                        if (formType === 'edit') {
                          Keyboard.dismiss();
                          navigation.navigate('EditOrUpdateFriendPostScreen', {
                            initials:
                              formikProps.values &&
                              formikProps.values.friends &&
                              formikProps.values.friends.length !== 0
                                ? [
                                    ...formikProps.values.friends.map(
                                      (item) => {
                                        return item.id;
                                      },
                                    ),
                                  ]
                                : [],
                            onSelect: (values) => {
                              values?.length &&
                                formikProps.setFieldError('friends', null);
                              formikProps.setFieldValue('friends', values);
                            },
                          });
                          formikProps.setFieldTouched('friends', true, true);
                        } else {
                          navigation.navigate('AddFriendPostScreen', {
                            initials:
                              formikProps.values &&
                              formikProps.values.friends &&
                              formikProps.values.friends.length !== 0
                                ? [
                                    ...formikProps.values.friends.map(
                                      (item) => {
                                        return item.user.id;
                                      },
                                    ),
                                  ]
                                : [],
                            onSelect: (values) => {
                              values?.length &&
                                formikProps.setFieldError('friends', null);
                              formikProps.setFieldValue('friends', values);
                            },
                          });
                          formikProps.setFieldTouched('friends', true, true);
                        }
                      }}
                    />
                  </View>
                  {formikProps.touched.friends &&
                    formikProps.errors?.friends && (
                      <Text style={styles.helper} variant="errorHelper">
                        {formikProps.errors?.friends?.message ||
                          formikProps.errors?.friends}
                      </Text>
                    )}
                  {formType === 'edit' ? (
                    <FriendLishUpdateOrEdit data={formikProps.values.friends} />
                  ) : (
                    <FriendList data={formikProps.values.friends} />
                  )}
                </TourGuideZone>
              </Paper>
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

export default TourGuildPostHangoutScreen;
