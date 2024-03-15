import React, {useState, useRef, useEffect, useImperativeHandle} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {IconButton as PaperIconButton} from 'react-native-paper';

import {getSize} from 'utils/responsive';
import moment from 'moment-timezone';
import {Formik} from 'formik';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import * as yup from 'yup';
import {useSelector, useDispatch} from 'react-redux';
import ImageMultiple from 'components/ImageMultiple/ImageMultiple';
import useTheme from 'theme';
import {
  Text,
  Input,
  Paper,
  SpecialtyList,
  DateTimePicker,
  FormikInput,
  CheckBoxTitle,
  Button,
} from 'components';
import {
  showAlert,
  createHelp,
  showModalize,
  hideModalize,
  getNewsFeed,
} from 'actions';
import {hangoutFormat} from 'utils/datetime';
import CheckBox from '@react-native-community/checkbox';
import {EnumHangoutStatus} from '../../utils/constants';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ModalChooseDraft from 'components/ModalChooseDraft';
import {getUniqueId} from 'utils/util';
import InputChoosePaymentMethod from 'components/InputChoosePaymentMethod';
import {Linking} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';

const constants = {
  feeCredit: 5, // %
  feeCrypto: 0.5, // %
};
const FormCreateHelp = ({navigation, route}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.auth.userInfo);
  const {cards} = useSelector((state) => state.wallet);

  const {formRef, initialValues, formType, callback, roomId, refDraftBtn} =
    route.params;

  const coords = useSelector((state) => state.location.coords);
  const creating = useSelector((state) => state.feed.beingCreateHelp);
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
  const [isNoTime, setIsNoTime] = useState(false);

  const [helpType, setHelpType] = useState('oneTime'); // oneTime | multiTimes
  const [priceType, setPriceType] = useState('fixed'); // fixed | range
  const [paymentType, setPaymentType] = useState('credit'); // credit | crypto

  const minimumCreditPrice = 10;

  const [minimumCryptoUsdPrice, setMinimumCryptoUsdPrice] = useState(0);
  const [minimumCryptoCoinPrice, setMinimumCryptoCoinPrice] = useState(0);

  const [draftCategories, setDraftCategories] = useState([]);
  const [draftSkills, setDraftSkills] = useState([]);

  const fee =
    paymentType === 'credit' ? constants.feeCredit : constants.feeCrypto;
  const minimumPrice =
    paymentType === 'credit' ? minimumCreditPrice : minimumCryptoUsdPrice;

  const minimumPriceCryptoCoin =
    (minimumCryptoCoinPrice / 100) * fee + minimumCryptoCoinPrice;

  const refModalDraft = useRef(null);
  const refDraftImgList = useRef([]);
  const refImageMultiple = useRef(null);
  const refInputChoosePaymentMethod = useRef(null);

  const refConfirmBack = useRef(false);

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
    amount: initialValues?.amount ? initialValues?.amount?.toString() : '',
    min_amount: '',
    max_amount: '',
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
    payment_method: 'credit',
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

  const handleSubmit = (values, {setFieldError, resetForm}) => {
    let friendsTmp = [];
    values.friends.map((item, i) => {
      friendsTmp.push(item.user.id);
    });

    if (moment(values.start).isAfter(moment(values.end))) {
      setFieldError('start', 'start time should before end time');

      return;
    }

    Keyboard.dismiss();

    const available_status =
      helpType === 'oneTime'
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

    let formData = {
      ...values,
      capacity: helpType === 'oneTime' ? parseInt(values.capacity, 10) : 1,
      isMinCapacity: null,
      categories: values.categories.map((i) => i.id),
      skills: values.skills.map((i) => i.id),
      room_id: roomId,
      friends: friendsTmp,
      current_location_lat: coords?.latitude,
      current_location_long: coords?.longitude,

      address: isOnline ? null : values.address,
      short_address: isOnline ? null : values.short_address,
      lat: isOnline ? null : values.lat?.toString(),
      lng: isOnline ? null : values.lng?.toString(),
      available_status,
      type: helpType === 'oneTime' ? 1 : 2,
      amount: roundUpToTwoDecimalPlaces(
        values.amount.includes(',')
          ? parseFloat(values.amount.replace(',', '.'), 10)
          : parseFloat(values.amount, 10),
      ),
      is_range_price: priceType === 'range',
      min_amount: parseFloat(values.min_amount, 10),
      max_amount: parseFloat(values.max_amount, 10),
    };
    if (helpType === 'oneTime') {
      delete formData?.['schedule'];
    } else {
      delete formData?.['date'];
      delete formData?.['isMinCapacity'];
      delete formData?.['start'];
    }
    if (priceType === 'range') {
      formData.amount = formData.min_amount;
    } else {
      formData.min_amount = 0;
      formData.max_amount = 0;
    }

    dispatch(
      createHelp(formData, {
        success: (result) => {
          resetForm(INITIAL_VALUES);
          dispatch(
            showAlert({
              title: 'Success',
              body: 'New help added!',
              type: 'success',
            }),
          );

          const needPayment = result.data.payment_status === 'unpaid';

          if (needPayment) {
            const paymentUrl = result.data.invoice_url;

            Alert.alert(
              'Last step',
              'Almost there. You can complete payment now for pubnish post immediately or later!',
              [
                {
                  text: 'Now',
                  onPress: async () => {
                    const supported = await Linking.canOpenURL(paymentUrl);
                    if (supported) {
                      await Linking.openURL(paymentUrl);

                      return;
                    }

                    Alert.alert(
                      'Warning',
                      `We can not open link automatically, please pay manually by: ${paymentUrl}`,
                      [
                        {
                          text: 'Copy link',
                          onPress: () => {
                            Clipboard.setString(paymentUrl);
                          },
                        },
                        {
                          text: 'Cancel',
                        },
                      ],
                    );
                  },
                },
                {text: 'Later'},
              ],
            );
          }

          refConfirmBack.current = true;
          dispatch(getNewsFeed({page: 1}));
          callback
            ? callback(result)
            : navigation.navigate('AppTab', {
                screen: 'MyPage',
              });
        },
        failure: (result) => {
          console.log(result);
          dispatch(
            showAlert({
              title: 'Error',
              body: 'Something went wrong',
              type: 'error',
            }),
          );
          if (
            result &&
            result === "You don't have enough Kizuna to create this Help"
          ) {
            setTimeout(() => {
              dispatch(showModalize(addKizuna));
            }, 1000);
          }
        },
      }),
    );
  };
  const roundUpToTwoDecimalPlaces = (number) => {
    return (Math.round(number * 100 + Number.EPSILON) / 100).toFixed(2);
  };
  function onRenderCondition() {
    return yup.object().shape({
      type: yup.number().required(),
      title: yup.string().max(125).nullable().required(),
      description: yup.string().max(1000).required(),
      cover: yup.string().nullable(),
      amount:
        priceType === 'fixed' &&
        yup
          .number()
          .min(minimumPrice, 'Minimum price is $' + minimumPrice)
          .max(10000)
          .nullable()
          .typeError('please enter number value only')
          .required(),
      min_amount:
        priceType === 'range' &&
        yup
          .number()
          .min(minimumPrice, 'Minimum price is $' + minimumPrice)
          .max(10000, 'min price should lower max price')
          .nullable()
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
          .typeError('please enter number value only')
          .required('max price is required'),
      capacity:
        helpType === 'oneTime' &&
        yup
          .number()
          .max(10000)
          .min(0)
          .nullable()
          .integer()
          .typeError('please enter number value only')
          .required(),
      isMinCapacity: yup.number().nullable().default(null).integer(),

      start:
        helpType === 'oneTime' &&
        !isNoTime &&
        yup.string().nullable().required(),
      end:
        helpType === 'oneTime' &&
        !isNoTime &&
        yup.string().nullable().required(),
      address: !isOnline && yup.string().nullable().required(),
      short_address: !isOnline && yup.string().nullable().required(),
      lat: yup.string(),
      lng: yup.string(),
      skills: yup.array(yup.object()).min(0),
      schedule: helpType === 'multiTimes' && yup.string().required(),
      categories: yup.array(yup.object()).min(1).required(),
      friends: yup.array(yup.object()).min(0),
      card_id: paymentType === 'credit' && yup.string().nullable().required(),
      currency: paymentType === 'crypto' && yup.string().nullable().required(),
    });
  }

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
                  helpType === 'oneTime'
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
                  type: helpType,
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
    [navigation, helpType, isOnline, isNoTime, priceType, roomId],
  );

  return (
    <>
      <ModalChooseDraft
        ref={refModalDraft}
        type="help"
        roomId={roomId}
        onChooseDraft={(draft) => {
          formRef.current?.setFieldValue('title', draft.title);
          formRef.current?.setFieldValue('description', draft.description);
          refImageMultiple.current?.setMediaData(draft.cover);

          setHelpType((prev) => (prev = draft.type));
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

          setPaymentType((prev) => (prev = draft.payment_method));
          refInputChoosePaymentMethod.current?.setPaymentMethod(
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
          formRef.current?.setFieldValue('categories', draft.categories || []);
          draft.categories?.length &&
            formRef.current?.setFieldError('categories', null);

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
        validationSchema={onRenderCondition()}
        onSubmit={handleSubmit}>
        {(formikProps) => {
          return (
            <View style={styles.scrollWrap}>
              <KeyboardAvoidingView
                behavior="padding"
                style={styles.keyAvoidView}
                keyboardVerticalOffset={
                  Platform.OS === 'ios' ? (roomId ? 75 : 135) : -200
                }>
                <ScrollView
                  style={styles.scrollWrap}
                  contentContainerStyle={styles.scrollCon}
                  showsVerticalScrollIndicator={false}>
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
                    )}

                    {helpType === 'oneTime' ? (
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
                        placeholder="enter help location"
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
                    <InputChoosePaymentMethod
                      ref={refInputChoosePaymentMethod}
                      onChange={(
                        type,
                        value,
                        min_amount_usd,
                        min_amount_coin,
                      ) => {
                        formikProps.setFieldValue('payment_method', type);
                        setPaymentType((prev) => (prev = type));

                        const isCredit = type === 'credit';

                        if (isCredit) {
                          formikProps.setFieldValue('card_id', value);
                          formikProps.setFieldValue('currency', '');

                          return;
                        }

                        formikProps.setFieldValue('currency', value);
                        formikProps.setFieldValue('card_id', '');

                        setMinimumCryptoUsdPrice(
                          (prev) => (prev = Math.ceil(min_amount_usd)),
                        );
                        setMinimumCryptoCoinPrice(
                          (prev) => (prev = min_amount_coin),
                        );
                      }}
                    />

                    <Text variant="errorHelper" style={{marginBottom: 10}}>
                      {(paymentType === 'credit' &&
                        formikProps.errors.card_id) ||
                      (paymentType === 'crypto' && formikProps.errors.currency)
                        ? 'Please choose payment method'
                        : ' '}
                    </Text>

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
                          keyboardType: 'numeric',
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
                              keyboardType: 'number-pad',
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
                              keyboardType: 'number-pad',
                            }}
                          />
                        </View>
                      </View>
                    )}

                    <PriceInfo
                      paymentType={paymentType}
                      priceType={priceType}
                      currency={formikProps.getFieldProps('currency').value}
                      fee={fee}
                      minimumPrice={minimumPrice}
                      minimumCreditPrice={minimumCreditPrice}
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
                    onPress={formRef.current?.handleSubmit}
                    loading={creating}
                  />
                </View>
                <View style={{height: insets.bottom}} />
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
    <View style={{marginBottom: 15}}>
      <Text variant="inputLabel">
        • Min price: <Text>${minPrice}</Text>
      </Text>

      <Text variant="inputLabel">
        • Actual amount to pay: <Text>{amountPay} USD</Text>
      </Text>

      {/* <Text variant="inputLabel">
        • Actual amount to receive:
        {priceType === 'fixed' ? (
          <Text>{amount.toFixed(2)} USD</Text>
        ) : (
          <Text>
            {minAmount.toFixed(2)} - {maxAmount.toFixed(2)} USD
          </Text>
        )}
      </Text> */}
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
  minimumCryptoUsdPrice,
}) => {
  const minPrice = minimumCryptoUsdPrice;
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
      <Text variant="inputLabel">• Actual amount to pay:</Text>
      <Text>
        {'   '}${amountPay} + Network Fee
        {hasWallet &&
          ` ~ ${parseFloat(
            (amountPay * minimumPriceCryptoCoin) / minPrice || 0,
          ).toFixed(5)} ${currency}`}
      </Text>

      {/* <Text variant="inputLabel" style={{marginBottom: 15}}>
        • Helper will receive:{' '}
        {priceType === 'fixed' ? (
          <Text>
            {amount.toFixed(2)} USD
            {hasWallet &&
              ` ~ ${parseFloat(
                (amount * minimumPriceCryptoCoin) / minPrice || 0,
              ).toFixed(5)} ${currency}`}
          </Text>
        ) : (
          <Text>
            {minAmount.toFixed(2)} - {maxAmount.toFixed(2)} USD
            {hasWallet &&
              ` ~ ${parseFloat(
                (minAmount * minimumPriceCryptoCoin) / minPrice || 0,
              ).toFixed(5)} - ${parseFloat(
                (maxAmount * minimumPriceCryptoCoin) / minPrice || 0,
              ).toFixed(5)} ${currency}`}
          </Text>
        )}
      </Text> */}
    </View>
  );
};

const PriceInfo = ({
  paymentType,
  priceType,
  currency,
  minimumPrice,
  minimumCreditPrice = 10,
  minimumCryptoUsdPrice,
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
          minimumCryptoUsdPrice,
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
          minimumCryptoUsdPrice,
        }}
      />
    </>
  );
};

export default FormCreateHelp;
