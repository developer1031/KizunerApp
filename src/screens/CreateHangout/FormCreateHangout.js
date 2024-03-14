import React, {useState, useRef, useEffect, useImperativeHandle} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text as RNText,
} from 'react-native';
import {IconButton as PaperIconButton} from 'react-native-paper';
import moment, {min} from 'moment-timezone';
import {Formik} from 'formik';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import * as yup from 'yup';
import {useSelector, useDispatch} from 'react-redux';
import CheckBox from '@react-native-community/checkbox';
import useTheme from 'theme';

import {
  Text,
  Input,
  Paper,
  SpecialtyList,
  DateTimePicker,
  FormikInput,
  CheckBoxTitle,
} from 'components';
import {getSize} from 'utils/responsive';
import {
  showAlert,
  createHangout,
  updateHangout,
  toggleIsSkipLauch,
  toggleIsFirstPost,
  getNowPaymentsMinAmount,
  getNewsFeed,
} from 'actions';
import {hangoutFormat} from 'utils/datetime';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {SafeAreaView} from 'react-native';
import {Alert} from 'react-native';
import ImageMultiple from 'components/ImageMultiple/ImageMultiple';
import Button from 'components/Button';
import ModalChooseDraft from 'components/ModalChooseDraft';
import {getUniqueId} from 'utils/util';
import InputChooseCryptoAddressPayment from 'components/InputChooseCryptoAddressPayment';
import SelectDropdown from 'react-native-select-dropdown';
import {getWalletStripeStatus} from 'actions';

const constants = {
  fee: 10,
  feeCredit: 10, // %
  feeCrypto: 8, // %
};
const FormCreateHangout = ({navigation, route}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.auth.userInfo);
  const {stripeStatusResponse, beingLoadStripeStatus} = useSelector(
    (state) => state.wallet,
  );
  const {status} = stripeStatusResponse;

  const isStripeConnected = status === 'CONNECTED';
  const coords = useSelector((state) => state.location.coords);
  const creating = useSelector((state) => state.feed.beingCreateHangout);

  const {
    formRef,
    initialValues,
    formType,
    callback,
    roomId,
    hangoutType: cHangoutType,
    refDraftBtn,
  } = route.params;

  // const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const [stepGuid, setStepGuid] = useState(false);
  const [hangoutType, setHangoutType] = useState('oneTime'); // oneTime | multiTimes
  const [priceType, setPriceType] = useState('fixed'); // fixed | range
  const [paymentType, setPaymentType] = useState('credit'); // both | credit | crypto
  const [currency, setCurrency] = useState('');

  const [isOnline, setIsOnline] = useState(false);
  const [isNoTime, setIsNoTime] = useState(false);
  const refModalDraft = useRef(null);
  const refDraftImgList = useRef([]);
  const refImageMultiple = useRef(null);

  const refConfirmBack = useRef(false);

  const refScroll = useRef(null);
  const refSelectDropdown = useRef(null);

  const minimumCreditPrice = 10;
  const minimumCryptoPrice = 10;

  const [minimumCryptoUsdPrice, setMinimumCryptoUsdPrice] = useState(0);
  const [minimumCryptoCoinPrice, setMinimumCryptoCoinPrice] = useState(0);

  const [draftCategories, setDraftCategories] = useState([]);
  const [draftSkills, setDraftSkills] = useState([]);

  const fee =
    paymentType === 'credit' ? constants.feeCredit : constants.feeCrypto;
  // const minimumPrice =
  //   paymentType === 'credit'
  //     ? minimumCreditPrice
  //     : (minimumCryptoUsdPrice / 100) * fee + minimumCryptoUsdPrice;
  const minimumPrice =
    paymentType === 'credit' ? minimumCreditPrice : minimumCryptoPrice;

  const minimumPriceCryptoCoin =
    (minimumCryptoCoinPrice / 100) * fee + minimumCryptoCoinPrice;

  const onPressDraft = () => {
    refModalDraft.current?.open();
  };

  useImperativeHandle(
    refDraftBtn,
    () => ({
      onPressDraft,
    }),
    [],
  );

  useEffect(() => {
    dispatch(getWalletStripeStatus());
  }, []);

  useEffect(() => {
    if (!cHangoutType) {
      return;
    }

    setHangoutType(
      (prev) => (prev = cHangoutType === 1 ? 'oneTime' : 'multiTimes'),
    );
  }, [cHangoutType]);
  useEffect(() => {
    if (!initialValues?.available_status) {
      return;
    }

    setIsNoTime(
      (prev) =>
        (prev =
          hangoutType === 'oneTime' &&
          (initialValues.available_status === 'no_time' ||
            initialValues.available_status === 'combine')),
    );

    setIsOnline(
      (prev) =>
        (prev =
          initialValues.available_status === 'online' ||
          initialValues.available_status === 'combine'),
    );
  }, [initialValues?.available_status, hangoutType]);

  useEffect(
    () =>
      navigation.addListener('beforeRemove', (e) => {
        if (refConfirmBack.current) {
          return;
        }

        const {title} = formRef.current.values;
        if (!title.length) {
          return;
        }

        e.preventDefault();

        // Prompt the user before leaving the screen
        Alert.alert(
          'Alert',
          'You have title inputted. Do you want to save draft before leave?',
          [
            {
              text: 'Yes',
              style: 'default',
              onPress: () => {
                const available_status =
                  hangoutType === 'oneTime'
                    ? isOnline && isNoTime
                      ? 'combine'
                      : isOnline
                      ? 'online'
                      : isNoTime
                      ? 'no_time'
                      : null
                    : isOnline
                    ? 'combine'
                    : 'no_time';
                const draft = {
                  ...formRef.current.values,
                  cover: refDraftImgList.current,
                  id: getUniqueId(),
                  type: hangoutType,
                  available_status,
                  is_range_price: priceType === 'range',
                  roomId,
                };

                refModalDraft.current?.store(draft);

                navigation.dispatch(e.data.action);
              },
            },
            {
              text: 'No',
              style: 'destructive',
              onPress: () => navigation.dispatch(e.data.action),
            },
            {text: 'Cancel', style: 'cancel'},
          ],
        );
      }),
    [navigation, hangoutType, isOnline, isNoTime, priceType, roomId],
  );

  if (beingLoadStripeStatus) return <></>;
  console.log(
    '🚀 ~ file: FormCreateHangout.js:62 ~ FormCreateHangout ~ stripeStatusResponse:',
    stripeStatusResponse,
  );

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
    datePlace: 'ex. everyday, every weekend, etc.',
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
    min_amount: '',
    max_amount: '',
    schedule: initialValues?.schedule?.toString(),
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
    payment_method: 'credit',
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

      const available_status =
        hangoutType === 'oneTime'
          ? isOnline && isNoTime
            ? 'combine'
            : isOnline
            ? 'online'
            : isNoTime
            ? 'no_time'
            : null
          : isOnline
          ? 'combine'
          : 'no_time';
      const formData = {
        payment_method: values.payment_method,
        crypto_wallet_id:
          values.payment_method === 'credit' ? '' : values.crypto_wallet_id,
        address: values.address,
        available_status,
        capacity:
          hangoutType === 'multiTimes' ? 1 : parseInt(values.capacity, 10),
        categories: values.categories.map((i) => i.id),
        cover: values.cover,
        date: values.date,
        description: values.description,
        end: values.end,
        friends: null, // friendsTmp,
        isMinCapacity: null,
        amount: roundUpToTwoDecimalPlaces(
          values.amount.includes(',')
            ? parseFloat(values.amount.replace(',', '.'), 10)
            : parseFloat(values.amount, 10),
        ),
        is_range_price: priceType === 'range',
        min_amount: parseFloat(values.min_amount, 10),
        max_amount: parseFloat(values.max_amount, 10),
        lat: values.lat,
        lng: values.lng,
        room_id: roomId,
        schedule: values.schedule,
        short_address: values.short_address,
        skills: values.skills.map((i) => i.id),
        start: values.start,
        title: values.title,
        current_location_lat: coords?.latitude,
        current_location_long: coords?.longitude,
        type: hangoutType === 'oneTime' ? 1 : 2,
      };

      if (formType === 'edit') {
        let data = {...formData};
        if (hangoutType === 'multiTimes') {
          delete data?.['start'];
          delete data?.['current_location_lat'];
          delete data?.['current_location_long'];
        }
        dispatch(
          updateHangout(data, () => {
            resetForm(INITIAL_VALUES);
            navigation.navigate('AppTab', {
              screen: 'MyPage',
            });
          }),
        );
      } else {
        dispatch(toggleIsFirstPost());
        dispatch(toggleIsSkipLauch(false));
        let data = {...formData};

        if (hangoutType === 'multiTimes') {
          delete data?.['start'];
        }
        if (priceType === 'range') {
          data.amount = data.min_amount;
        } else {
          formData.min_amount = 0;
          formData.max_amount = 0;
        }

        dispatch(
          createHangout(data, {
            success: (result) => {
              resetForm(INITIAL_VALUES);
              dispatch(
                showAlert({
                  title: 'Success',
                  body: 'New hangout added!',
                  type: 'success',
                }),
              );

              refConfirmBack.current = true;
              dispatch(getNewsFeed({page: 1}));
              callback
                ? callback(result)
                : navigation.navigate('AppTab', {
                    screen: 'MyPage',
                  });
            },
          }),
        );
      }
    }
  };
  const roundUpToTwoDecimalPlaces = (number) => {
    return (Math.round(number * 100 + Number.EPSILON) / 100).toFixed(2);
  };
  const onRenderCondition = () => {
    return yup.object().shape({
      type: yup.number().required(),
      title: yup.string().nullable().max(125).required(),
      description: yup.string().max(1000).required(),
      cover: yup.string().nullable(),
      amount:
        priceType === 'fixed' &&
        yup
          .number()
          .min(
            paymentType === 'credit' ? minimumCreditPrice : minimumCryptoPrice,
            `Minimum price is $${
              paymentType === 'credit' ? minimumCreditPrice : minimumCryptoPrice
            }`,
          )
          .max(10000)
          .nullable()
          .typeError('Please enter number value only')
          .required(),
      min_amount:
        priceType === 'range' &&
        yup
          .number()
          .min(minimumCreditPrice, `Minimum price is ${minimumCreditPrice}$`)
          .max(10000, 'min price should lower max price')
          .nullable()
          .integer()
          .typeError('Please enter number value only')
          .required('min price is required'),
      max_amount:
        priceType === 'range' &&
        yup
          .number()
          .min(
            yup.ref('min_amount'),
            `must be greater than or equal to Min price`,
          )
          .max(10000)
          .nullable()
          .integer()
          .typeError('Please enter number value only')
          .required('max price is required'),
      schedule:
        hangoutType === 'multiTimes' && yup.string().max(125).required(),
      capacity:
        hangoutType === 'oneTime' &&
        yup
          .number()
          .max(10000)
          .min(
            yup.ref('isMinCapacity'),
            'capacity should more than min capacity',
          )
          .nullable()
          .integer()
          .typeError('Please enter number value only')
          .required(),
      isMinCapacity: yup.number().nullable().default(null).integer(),
      start:
        hangoutType === 'oneTime' &&
        !isNoTime &&
        yup.string().nullable().required(),
      end:
        hangoutType === 'oneTime' &&
        !isNoTime &&
        yup.string().nullable().required(),

      address: !isOnline && yup.string().nullable().required(),
      short_address: !isOnline && yup.string().nullable().required(),
      lat: yup.string(),
      lng: yup.string(),
      skills: yup.array(yup.object()).min(0),
      categories: yup.array(yup.object()).min(1),
      friends: yup.array(yup.object()).min(0),
      crypto_wallet_id: yup.string().when('payment_method', {
        is: (value) => value === 'crypto' || value === 'both',
        then: yup.string().required("wallet's address is required"),
      }),
    });
  };

  return (
    <>
      <ModalChooseDraft
        ref={refModalDraft}
        type="hangout"
        roomId={roomId}
        onChooseDraft={(draft) => {
          formRef.current?.setFieldValue('title', draft.title);
          formRef.current?.setFieldValue('description', draft.description);
          refImageMultiple.current?.setMediaData(draft.cover);

          setHangoutType((prev) => (prev = draft.type));
          formRef.current?.setFieldValue('schedule', draft.schedule);
          if (draft.available_status !== null) {
            setIsNoTime(
              (prev) =>
                (prev =
                  draft.available_status === 'no_time' ||
                  draft.available_status === 'combine'),
            );
            setIsOnline(
              (prev) =>
                (prev =
                  draft.available_status === 'online' ||
                  draft.available_status === 'combine'),
            );
          }
          formRef.current?.setFieldValue('start', draft.start);
          formRef.current?.setFieldValue('end', draft.end);

          formRef.current?.setFieldValue('short_address', draft.short_address);
          formRef.current?.setFieldValue('lat', draft.lat);
          formRef.current?.setFieldValue('lng', draft.lng);

          refSelectDropdown.current?.selectIndex(
            draft.payment_method === 'both'
              ? 0
              : draft.payment_method === 'credit'
              ? 1
              : 2,
          );
          setPaymentType((prev) => (prev = draft.payment_method));
          formRef.current?.setFieldValue(
            'payment_method',
            draft.payment_method,
          );
          setPriceType(
            (prev) => (prev = draft.is_range_price ? 'range' : 'fixed'),
          );
          formRef.current?.setFieldValue('amount', draft.amount);
          formRef.current?.setFieldValue('min_amount', draft.min_amount);
          formRef.current?.setFieldValue('max_amount', draft.max_amount);
          formRef.current?.setFieldValue('capacity', draft.capacity);

          setDraftCategories((prev) => (prev = draft.categories || []));
          draft.categories?.length &&
            formRef.current?.setFieldError('categories', null);
          formRef.current?.setFieldValue('categories', draft.categories || []);

          setDraftSkills((prev) => (prev = draft.skills || []));
          formRef.current?.setFieldValue('skills', draft.skills || []);
          draft.skills?.length &&
            formRef.current?.setFieldError('skills', null);
        }}
      />

      <Formik
        innerRef={formRef}
        validateOnChange={false}
        initialValues={INITIAL_VALUES}
        validationSchema={onRenderCondition}
        onSubmit={handleSubmit}>
        {(formikProps) => {
          return (
            <SafeAreaView style={styles.scrollWrap}>
              <KeyboardAvoidingView
                behavior="padding"
                style={styles.keyAvoidView}
                keyboardVerticalOffset={
                  Platform.OS === 'ios' ? (roomId ? 75 : 135) : -200
                }>
                <ScrollView
                  scrollEnabled={!stepGuid}
                  scrollEventThrottle={16}
                  ref={refScroll}
                  style={styles.scrollWrap}
                  contentContainerStyle={styles.scrollCon}
                  keyboardShouldPersistTaps={'handled'}
                  showsVerticalScrollIndicator={false}>
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

                    <ImageMultiple
                      type="user.hangout"
                      ref={refImageMultiple}
                      editable
                      label={lang.photoLabel}
                      onChange={(data) => {
                        refDraftImgList.current = data;

                        const listIdString = data
                          .map((item) => item.id)
                          .join(';');
                        formikProps.setFieldValue('cover', listIdString);
                      }}
                    />
                  </Paper>

                  <Paper style={styles.form}>
                    {!roomId && (
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <CheckBoxTitle
                          callback={setHangoutType}
                          status={'oneTime'}
                          choose={hangoutType}
                          title="One-Time"
                        />
                        <CheckBoxTitle
                          callback={setHangoutType}
                          status={'multiTimes'}
                          choose={hangoutType}
                          title="Multi-Times"
                          isReverse={true}
                        />
                      </View>
                    )}

                    {hangoutType === 'oneTime' ? (
                      <>
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
                            tintColors={{
                              true: theme.colors.primary,
                              false: theme.colors.inputLabel,
                            }}
                          />
                          <Text style={styles.formHeaderText}>Time Free</Text>
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
                                formikProps.setFieldTouched(
                                  'start',
                                  true,
                                  true,
                                );
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
                        placeholder="enter hangout location"
                        label={lang.locationLabel}
                        touched={formikProps.touched.short_address}
                        value={formikProps.values.short_address}
                        onPress={() => {
                          Keyboard.dismiss();
                          formikProps.setFieldTouched(
                            'short_address',
                            true,
                            true,
                          );
                          navigation.navigate('PickLocationPost', {
                            onSelect: async (data) => {
                              console.log(data);
                              formikProps.setFieldError('address', null);
                              formikProps.setFieldValue(
                                'short_address',
                                data.short_address,
                              );

                              formikProps.setFieldValue(
                                'address',
                                data.address,
                              );
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
                    <Text variant="inputLabel" style={{marginBottom: 10}}>
                      Payment method receive
                    </Text>
                    <SelectDropdown
                      ref={refSelectDropdown}
                      data={['both', 'credit', 'crypto']}
                      onSelect={(method, index) => {
                        formikProps.setFieldValue('payment_method', method);
                        setPaymentType((prev) => (prev = method));
                      }}
                      defaultValueByIndex={1}
                      buttonStyle={{
                        width: '100%',
                        backgroundColor: 'transparent',
                        borderWidth: 0.2,
                        borderRadius: 10,
                        marginBottom: 10,
                      }}
                      renderDropdownIcon={() => {
                        return (
                          <AntDesign
                            name="down"
                            color={'black'}
                            size={getSize.f(15)}
                          />
                        );
                      }}
                      renderCustomizedButtonChild={(type, i) => {
                        return (
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <Text style={{marginLeft: 10}}>{type}</Text>
                          </View>
                        );
                      }}
                      renderCustomizedRowChild={(type, i) => {
                        return (
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              paddingLeft: 15,
                            }}>
                            <Text style={{marginLeft: 10}}>{type}</Text>
                          </View>
                        );
                      }}
                    />

                    {paymentType !== 'crypto' &&
                      (isStripeConnected ? (
                        <Text variant="inputLabel">
                          {'   '}• Credit: will pay by Stripe connect
                        </Text>
                      ) : (
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                          <Text variant="inputLabel" style={{flex: 1}}>
                            {'   '}• You have not connected to Paymenthub yet.
                            Press button to connect now!
                          </Text>

                          <Button
                            title="Connect"
                            variant="ghost"
                            onPress={() =>
                              navigation.navigate('PaymentConnectStripe')
                            }
                          />
                        </View>
                      ))}

                    {paymentType !== 'credit' && (
                      <>
                        <Text variant="inputLabel" style={{marginBottom: 10}}>
                          {'   '}• Crypto: please choose wallet's address
                        </Text>

                        <InputChooseCryptoAddressPayment
                          onChange={(data) => {
                            formikProps.setFieldValue(
                              'crypto_wallet_id',
                              data.id,
                            );

                            dispatch(
                              getNowPaymentsMinAmount(data.currency, {
                                success: (res) => {
                                  const {
                                    absolute_min_amount_usd: min_amount_usd,
                                    absolute_min_amount: min_amount_coin,
                                  } = res;
                                  setMinimumCryptoCoinPrice(
                                    (prev) => (prev = min_amount_coin),
                                  );
                                  setMinimumCryptoUsdPrice(
                                    (prev) => (prev = min_amount_usd),
                                  );
                                  setCurrency((prev) => (prev = data.currency));
                                },
                              }),
                            );
                          }}
                        />
                      </>
                    )}

                    <Text variant="errorHelper">
                      {paymentType !== 'credit' &&
                      formikProps.errors.crypto_wallet_id
                        ? formikProps.errors.crypto_wallet_id
                        : ' '}
                    </Text>

                    <View style={{height: 10}} />

                    {!roomId && (
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <CheckBoxTitle
                          callback={setPriceType}
                          status={'fixed'}
                          choose={priceType}
                          title="Fixed"
                        />
                        <CheckBoxTitle
                          callback={setPriceType}
                          status={'range'}
                          choose={priceType}
                          title="Range"
                          isReverse={true}
                        />
                      </View>
                    )}

                    {priceType === 'fixed' ? (
                      <FormikInput
                        name="amount"
                        {...formikProps}
                        inputProps={{
                          placeholder: 'enter price',
                          label: `Price (USD)`,
                          type: 'number-pad',
                        }}
                      />
                    ) : (
                      <View style={{flexDirection: 'row'}}>
                        <View style={{flex: 1, marginRight: 20}}>
                          <FormikInput
                            name="min_amount"
                            {...formikProps}
                            inputProps={{
                              placeholder: 'enter price',
                              label: 'Min price',
                              type: 'number-pad',
                            }}
                          />
                        </View>

                        <View style={{flex: 1}}>
                          <FormikInput
                            name="max_amount"
                            {...formikProps}
                            inputProps={{
                              placeholder: 'enter price',
                              label: 'Max price',
                              type: 'number-pad',
                            }}
                          />
                        </View>
                      </View>
                    )}

                    <PriceInfo
                      paymentType={paymentType}
                      priceType={priceType}
                      currency={currency}
                      fee={fee}
                      minimumPrice={minimumPrice}
                      minimumCreditPrice={minimumCreditPrice}
                      minimumCryptoPrice={minimumCryptoPrice}
                      minimumCryptoUsdPrice={minimumCryptoUsdPrice}
                      minimumPriceCryptoCoin={minimumPriceCryptoCoin}
                      crypto_wallet_id={
                        formikProps.getFieldProps('crypto_wallet_id').value
                      }
                      amountValue={parseFloat(
                        formikProps.getFieldProps('amount').value || 0,
                      )}
                      minAmountValue={parseFloat(
                        formikProps.getFieldProps('min_amount').value || 0,
                      )}
                      maxAmountValue={parseFloat(
                        formikProps.getFieldProps('max_amount').value || 0,
                      )}
                    />

                    {hangoutType === 'oneTime' && (
                      <FormikInput
                        name="capacity"
                        {...formikProps}
                        inputProps={{
                          placeholder: lang.capacityPlace,
                          label: lang.capacityLabel,
                          type: 'number-pad',
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
                              setDraftCategories(values);
                            },
                          });
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

                    <SpecialtyList data={draftCategories} />
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
                              setDraftSkills(values);
                            },
                          });
                        }}
                      />
                    </View>
                    {formikProps.touched.skills &&
                      formikProps.errors?.skills && (
                        <Text style={styles.helper} variant="errorHelper">
                          {formikProps.errors?.skills?.message ||
                            formikProps.errors?.skills}
                        </Text>
                      )}

                    <SpecialtyList data={draftSkills} />
                  </Paper>
                </ScrollView>

                <View
                  style={{
                    marginHorizontal: getSize.w(24),
                    marginVertical: getSize.w(12),
                  }}>
                  <Button
                    title="Post"
                    // disabled={!isStripeConnected}
                    style={{}}
                    onPress={formRef.current?.handleSubmit}
                    loading={creating}
                  />
                </View>
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
          );
        }}
      </Formik>
    </>
  );
};

const CreditPriceInfo = ({
  priceType,
  amountValue,
  minAmountValue,
  maxAmountValue,
}) => {
  const minPrice = 10;
  const fee = 10;
  const guestFee = 5;

  const amount = (amountValue * (100 - fee)) / 100;
  const minAmount = (minAmountValue * (100 - fee)) / 100;
  const maxAmount = (maxAmountValue * (100 - fee)) / 100;
  const amountPay = (amountValue * (100 + guestFee)) / 100;

  return (
    <View>
      <Text variant="inputLabel">
        • Min price: <Text>${minPrice}</Text>
      </Text>

      <Text variant="inputLabel" style={{marginBottom: 15}}>
        • Actual amount received:{' '}
        {priceType === 'fixed' ? (
          <Text>${amount.toFixed(2)}</Text>
        ) : (
          <Text>
            ${minAmount.toFixed(2)} - ${maxAmount.toFixed(2)}
          </Text>
        )}
      </Text>
    </View>
  );
};
const CryptoPriceInfo = ({
  priceType,
  amountValue,
  minAmountValue,
  maxAmountValue,
  currency,
  crypto_wallet_id,
  minimumPriceCryptoCoin,
}) => {
  const minPrice = 10;
  const fee = 8;
  const guestFee = 0.5;

  const amount = (amountValue * (100 - fee)) / 100;
  const minAmount = (minAmountValue * (100 - fee)) / 100;
  const maxAmount = (maxAmountValue * (100 - fee)) / 100;
  const amountPay = (amountValue * (100 + guestFee)) / 100;

  // const hasWallet = crypto_wallet_id != null;
  const hasWallet = false;

  return (
    <View style={{marginBottom: 15}}>
      <Text variant="inputLabel">
        • Min price:{' '}
        <Text>
          ${minPrice}
          {hasWallet && ` ~ ${minimumPriceCryptoCoin.toFixed(3)} ${currency}`}
        </Text>
      </Text>

      {/* <Text variant="inputLabel">• Guest will pay:</Text>
      <Text>
        {'   '}
        {amountPay} USD + Network Fee
        {hasWallet &&
          ` ~ ${parseFloat(
            (amountPay * minimumPriceCryptoCoin) / minPrice || 0,
          ).toFixed(5)} ${currency}`}
      </Text> */}

      <Text variant="inputLabel">• Actual amount received: </Text>
      {priceType === 'fixed' ? (
        <Text>
          {'   '}${amount.toFixed(2)} - Network Fee
          {hasWallet &&
            ` ~ ${parseFloat(
              (amount * minimumPriceCryptoCoin) / minPrice || 0,
            ).toFixed(5)} ${currency}`}
        </Text>
      ) : (
        <Text>
          {'   '}${minAmount.toFixed(2)} - ${maxAmount.toFixed(2)} - Network Fee
          {hasWallet &&
            ` ~ ${parseFloat(
              (minAmount * minimumPriceCryptoCoin) / minPrice || 0,
            ).toFixed(5)} - ${parseFloat(
              (maxAmount * minimumPriceCryptoCoin) / minPrice || 0,
            ).toFixed(5)} ${currency}`}
        </Text>
      )}
    </View>
  );
};

const PriceInfo = ({
  paymentType,
  priceType,
  currency,
  // minimumPrice,
  minimumCreditPrice = 10,
  minimumCryptoPrice,
  // minimumCryptoUsdPrice,
  minimumPriceCryptoCoin,
  crypto_wallet_id,
  amountValue,
  minAmountValue,
  maxAmountValue,
}) => {
  if (paymentType == 'credit') {
    return (
      <CreditPriceInfo
        {...{priceType, amountValue, minAmountValue, maxAmountValue}}
      />
    );
  }
  if (paymentType == 'crypto') {
    return (
      <CryptoPriceInfo
        {...{
          priceType,
          amountValue,
          minAmountValue,
          maxAmountValue,
          currency,
          crypto_wallet_id,
          minimumPriceCryptoCoin,
        }}
      />
    );
  }

  return (
    <>
      <CreditPriceInfo
        {...{priceType, amountValue, minAmountValue, maxAmountValue}}
      />
      <CryptoPriceInfo
        {...{
          priceType,
          amountValue,
          minAmountValue,
          maxAmountValue,
          currency,
          crypto_wallet_id,
          minimumPriceCryptoCoin,
        }}
      />
    </>
  );
};

export default FormCreateHangout;
