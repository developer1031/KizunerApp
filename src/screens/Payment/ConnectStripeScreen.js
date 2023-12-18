import React, {useEffect, useRef, useState} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import useTheme from 'theme';
import {getSize} from 'utils/responsive';
import {Wrapper, Text, Touchable, Button} from 'components';
import LinearGradient from 'react-native-linear-gradient';
import {useDispatch, useSelector} from 'react-redux';
import {connectStripe, getStripeCustomAccount} from 'actions';
import {View} from 'react-native';
import {Formik} from 'formik';
import Paper from 'components/Paper';
import FormikInput from 'components/FormikInput';
import {ScrollView} from 'react-native';
import WithdrawModel from './components/WithdrawModel';
import {SpaceView} from 'components/SpaceView';
import CountryPicker from 'components/CountryPicker';
import {countries as countriesData} from 'assets/data';
import FastImage from 'react-native-fast-image';
import DatePicker from './components/DatePicker';
import {TouchableWithoutFeedback} from 'react-native';
import ImageStripePicker from 'components/ImageStripePicker';
import * as yup from 'yup';
import moment from 'moment';
import {TouchableOpacity} from 'react-native';
import {showAlert} from 'actions';
import {getWalletStripeStatus} from 'actions';
import {styles as style} from './styles/stripeCustom';
import {HeaderLinear} from 'components/HeaderLinear';

const initialValues = {
  first_name: '',
  last_name: '',
  first_name_kana: '',
  last_name_kana: '',
  postal_code: '',
  address_state: '',
  address_city: '',
  address_line1: '',
  address_line1_kana: '',
  address_line2: '',
  address_line2_kana: '',
  dob: '',
  phone: '',
  id_number: '',
  // ssn_last_4: '',
  routing_number: '',
  account_number: '',
  aconfirm_account_number: '',
  identity_document: '',
  identity_document_back: '',
};
const ConnectStripeScreen = ({navigation}) => {
  const dispatch = useDispatch();

  const {stripeStatusResponse} = useSelector((state) => state.wallet);
  const {amount, status} = stripeStatusResponse;
  const isEdit = status == 'CONNECTED' || status == 'PENDING';

  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const HEADER_HEIGHT = 68 + insets.top;

  const refWithdraw = useRef(null);

  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [country, setCountry] = useState('JP');
  const countryData = countriesData[country];

  const [showCountryCodePicker, setShowCountryCodePicker] = useState(false);
  const [countryCode, setCountryCode] = useState('JP');

  const [externalAccountId, setExternalAccountId] = useState('');

  //init datepicker
  const refDatePicker = useRef(null);
  const [rerenderFlag, setRerenderFlag] = useState(false);

  const countryCodeData = countriesData[countryCode];

  useEffect(() => {
    dispatch(
      getStripeCustomAccount(
        {},
        {
          success: (result) => {
            if (result.external_accounts) {
              if (result.external_accounts.data.length > 0) {
                const {id, country} = result.external_accounts.data[0];
                setExternalAccountId(id);
                setCountryCode(country);
              }
            }
            console.log(result.external_accounts);
          },
          failure: (err) => {
            console.log(err);
          },
        },
      ),
    );
  }, []);

  useEffect(() => {
    setRerenderFlag((prevFlag) => !prevFlag);
  }, [refDatePicker]);

  const onSubmit = (data) => {
    const [day, month, year] = data.dob.split('/');
    const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(
      2,
      '0',
    )}`;
    const momentObj = moment(formattedDate);
    const date = momentObj.format('YYYY-MM-DDTHH:mm:ssZ');

    const req = {
      ...data,
      country_code: countryCode,
      currency: countryCodeData.currency[0],
      phone: `+${countryCodeData.callingCode[0]}${data.phone}`,
      dob: date,
    };

    dispatch(
      connectStripe(req, {
        success: (result) => {
          dispatch(
            showAlert({
              title: 'Success',
              type: 'success',
              body: 'Connect successfully',
            }),
          );
          dispatch(getWalletStripeStatus());
          navigation.goBack();
        },
        failure: (err) => {
          console.log(err);
          // dispatch(showAlert({title: 'Error', type: 'error', body: err}));
          dispatch(
            showAlert({
              title: 'Error',
              type: 'error',
              body: 'Something went wrong',
            }),
          );
        },
      }),
    );

    // navigation.navigate('PaymentOTP')
  };
  const onPressWithdraw = () => refWithdraw.current?.show();

  const styles = {...style};

  return (
    <>
      <CountryPicker
        open={showCountryCodePicker}
        onClose={() => setShowCountryCodePicker(false)}
        value={countryCode}
        onSelect={(value) => {
          setCountryCode(value);
          setShowCountryCodePicker(false);
        }}
      />

      <CountryPicker
        open={showCountryPicker}
        onClose={() => setShowCountryPicker(false)}
        value={country}
        showCode={false}
        onSelect={(value) => {
          setCountry(value);
          setShowCountryPicker(false);
        }}
      />

      <WithdrawModel
        ref={refWithdraw}
        externalAccountId={externalAccountId}
        countryCode={countryCode}
      />

      <View style={{flex: 1}}>
        <HeaderLinear
          style={{height: HEADER_HEIGHT}}
          colors={theme.colors.gradient}
          start={{x: 0, y: 1}}
          end={{x: 1, y: 1}}
          iconLeft={
            <Touchable
              onPress={navigation.goBack}
              style={styles.btnBack}
              textStyles={styles.headerTitle}>
              <MaterialCommunityIcons
                name="chevron-left"
                size={getSize.f(34)}
                color={theme.colors.textContrast}
              />
            </Touchable>
          }
          textStyles={styles.headerTitle}
          title={'Payment connect'}
        />
        <FormikComponent
          onSubmit={onSubmit}
          setShowCountryPicker={setShowCountryPicker}
          countryData={countryData}
          refDatePicker={refDatePicker}
          setShowCountryCodePicker={setShowCountryCodePicker}
          countryCodeData={countryCodeData}
          theme={theme}
          insets={insets}
          isEdit={isEdit}
          countryCode={countryCode}
          onPressWithdraw={onPressWithdraw}
        />
      </View>
    </>
  );
};

const FormikComponent = (props) => {
  const styles = {
    ...style,
    countryInput: {
      ...style.countryInput,
      borderBottomColor: props.theme.colors.divider,
    },
    countryValue: {
      ...style.countryValue,
      color: props.theme.colors.text,
    },
    flex: {
      flex: 1,
      flexDirection: 'row',
      gap: getSize.w(10),
    },
  };

  const validateOptions = {
    dob: yup.string().required('required'),
    phone: yup
      .number()
      .integer()
      .typeError('please enter number value only')
      .required('required'),
    id_number: yup
      .number()
      .integer()
      .typeError('please enter number value only')
      .required('required'),
    routing_number: yup
      .number()
      .integer()
      .typeError('please enter number value only')
      .required('required'),
    account_number: yup
      .number()
      .integer()
      .typeError('please enter number value only')
      .required('required'),
    aconfirm_account_number: yup
      .number()
      .integer()
      .typeError('please enter number value only')
      .required('required'),
    identity_document: yup.string().required('required'),
    identity_document_back: yup.string().required('required'),
    account_name: yup.string().required('required'),
    first_name: yup.string().required('required'),
    last_name: yup.string().required('required'),
    postal_code: yup.string().required('required'),
    // address_state: yup.string().required('required'),
    // address_city: yup.string().required('required'),
    address_line1: yup.string().required('required'),
  };
  if (props.countryCode == 'JP') {
    validateOptions.first_name_kana = yup.string().required('required');
    validateOptions.last_name_kana = yup.string().required('required');
    validateOptions.address_line1_kana = yup.string().required('required');
  }

  const yupValidation = () => yup.object().shape(validateOptions);

  return (
    <Formik
      validateOnChange={false}
      validationSchema={yupValidation}
      onSubmit={props.onSubmit}
      initialValues={initialValues}>
      {(formikProps) => (
        <>
          <ScrollView
            style={{flex: 1}}
            contentContainerStyle={styles.mainContainer}>
            <InfoComponent styles={styles}>
              <View style={styles.flex}>
                <View style={{flex: 1}}>
                  <FormikInput
                    name="first_name"
                    {...formikProps}
                    inputProps={{
                      label: 'First Name',
                      returnKeyType: 'next',
                      placeholder: '',
                    }}
                  />
                </View>
                <View style={{flex: 1}}>
                  <FormikInput
                    name="last_name"
                    {...formikProps}
                    inputProps={{
                      label: 'Last Name',
                      // type: 'text',
                      returnKeyType: 'next',
                      placeholder: '',
                    }}
                  />
                </View>
              </View>

              {props.countryCode == 'JP' && (
                <View style={styles.flex}>
                  <View style={{flex: 1}}>
                    <FormikInput
                      name="first_name_kana"
                      {...formikProps}
                      inputProps={{
                        label: 'First Name Kana',
                        returnKeyType: 'next',
                        placeholder: '',
                      }}
                    />
                  </View>
                  <View style={{flex: 1}}>
                    <FormikInput
                      name="last_name_kana"
                      {...formikProps}
                      inputProps={{
                        label: 'Last Name Kana',
                        // type: 'text',
                        returnKeyType: 'next',
                        placeholder: '',
                      }}
                    />
                  </View>
                </View>
              )}

              <FormikInput
                name="postal_code"
                {...formikProps}
                inputProps={{
                  label: 'Postal Code',
                  type: 'number-pad',
                  returnKeyType: 'next',
                  placeholder: '〒000-0000',
                }}
              />
              {/* <FormikInput
                name="address_state"
                {...formikProps}
                inputProps={{
                  returnKeyType: 'next',
                  placeholder: 'State / Province / Region',
                }}
              />
              <FormikInput
                name="address_city"
                {...formikProps}
                inputProps={{
                  returnKeyType: 'next',
                  placeholder: 'City',
                }}
              /> */}
              <FormikInput
                name="address_line1"
                {...formikProps}
                inputProps={{
                  returnKeyType: 'next',
                  placeholder: 'Block / building number',
                }}
              />
              <FormikInput
                name="address_line2"
                {...formikProps}
                inputProps={{
                  returnKeyType: 'next',
                  placeholder: 'Building name + unit number',
                }}
              />
              {props.countryCode == 'JP' && (
                <>
                  <FormikInput
                    name="address_line1_kana"
                    {...formikProps}
                    inputProps={{
                      returnKeyType: 'next',
                      placeholder: 'Block / building number(Kana)',
                    }}
                  />
                  <FormikInput
                    name="address_line2_kana"
                    {...formikProps}
                    inputProps={{
                      returnKeyType: 'next',
                      placeholder: 'Building name + unit number(Kana)',
                    }}
                  />
                </>
              )}
              <CountryComponent
                onPress={() => props.setShowCountryPicker(true)}
                styles={styles}
                formikProps={formikProps}
                {...props}
              />
              <CalendarComponent
                refs={props.refDatePicker}
                onChange={(date) => {
                  formikProps.setFieldValue('dob', date);
                }}
                onPress={props.refDatePicker.current?.show}
                formikProps={formikProps}
                styles={styles}
                {...props}
              />
              <PhoneComponent
                onPress={() => props.setShowCountryCodePicker(true)}
                formikProps={formikProps}
                styles={styles}
                {...props}
              />

              <IdentityFont
                onChange={(id) => {
                  formikProps.setFieldValue('identity_document', id);
                }}
                formikProps={formikProps}
              />
              <IdentityBack
                onChange={(id) => {
                  formikProps.setFieldValue('identity_document_back', id);
                }}
                formikProps={formikProps}
              />

              <LastNumberComponent formikProps={formikProps} />
            </InfoComponent>
            <ReceivePayout styles={styles} formikProps={formikProps} />
          </ScrollView>

          <FooterFormik
            formikProps={formikProps}
            paddingBottom={props.insets.bottom || getSize.h(24)}
            styles={styles}
            onPressWithdraw={props.onPressWithdraw}
          />
        </>
      )}
    </Formik>
  );
};

const InfoComponent = (props) => {
  return (
    <Paper style={[props.styles.formWrapper, {marginBottom: getSize.w(24)}]}>
      <Wrapper dismissKeyboard style={{backgroundColor: 'transparent'}}>
        <Text variant="bold" style={{marginBottom: getSize.w(24)}}>
          Verify your personal details
        </Text>
        {props.children}
      </Wrapper>
    </Paper>
  );
};

const IdentityFont = (props) => {
  return (
    <>
      <Text variant="inputLabel" style={{marginBottom: getSize.h(5)}}>
        Identity font
      </Text>
      <ImageStripePicker onChange={props.onChange} />
      <Text variant="errorHelper" style={{marginBottom: getSize.h(5)}}>
        {props.formikProps.errors.identity_document || ' '}
      </Text>
    </>
  );
};
const IdentityBack = (props) => {
  return (
    <>
      <Text variant="inputLabel" style={{marginBottom: getSize.h(5)}}>
        Identity back
      </Text>
      <ImageStripePicker onChange={props.onChange} />
      <Text variant="errorHelper" style={{marginBottom: getSize.h(5)}}>
        {props.formikProps.errors.identity_document_back || ' '}
      </Text>
    </>
  );
};
const LastNumberComponent = (props) => {
  return (
    <>
      <FormikInput
        name="id_number"
        {...props.formikProps}
        inputProps={{
          label: 'Social Security number',
          type: 'number-pad',
          returnKeyType: 'next',
          placeholder: '123-45-6789',
        }}
      />
      {/* 
      <Text variant="inputLabel">Last 4 digits of Social Security number</Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Text style={{fontSize: 20, top: -getSize.h(6)}}>**** **** **** </Text>
        <FormikInput
          name="id_number"
          {...props.formikProps}
          inputProps={{
            returnKeyType: 'next',
            placeholder: '0000',
            wrapperStyle: {flex: 1},
            maxLength: 4,
          }}
        /> 
      </View>*/}
    </>
  );
};
const CountryComponent = (props) => {
  return (
    <TouchableWithoutFeedback onPress={props.onPress}>
      <View style={props.styles.countryInput}>
        <Text variant="inputLabel">Country 🔒</Text>
        <View style={props.styles.countryWrap}>
          <FastImage
            style={props.styles.countryFlag}
            source={{uri: props.countryData?.flag}}
          />
          <Text style={[props.styles.countryValue, {flex: 1}]}>
            {' '}
            {props.countryData?.name?.common}
          </Text>
          <MaterialCommunityIcons
            name="menu-down"
            size={getSize.f(24)}
            color={props.theme.colors.text}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};
const PhoneComponent = (props) => {
  return (
    <View style={props.styles.phoneInputWrapper}>
      <Touchable onPress={props.onPress}>
        <View style={props.styles.countryInput}>
          <Text variant="inputLabel">Phone Number</Text>
          <View style={props.styles.countryWrap}>
            <FastImage
              style={props.styles.countryFlag}
              source={{uri: props.countryCodeData?.flag}}
            />
            <Text style={props.styles.countryValue}>
              (+{props.countryCodeData?.callingCode?.[0]})
            </Text>
            <MaterialCommunityIcons
              name="menu-down"
              size={getSize.f(24)}
              color={props.theme.colors.text}
            />
          </View>
        </View>
      </Touchable>
      <FormikInput
        name="phone"
        {...props.formikProps}
        inputProps={{
          label: ' ',
          returnKeyType: 'next',
          placeholder: '',
          wrapperStyle: props.styles.phoneWrapper,
          type: 'phone-pad',
          style: props.styles.phoneInput,
        }}
      />
    </View>
  );
};
const CalendarComponent = (props) => {
  return (
    <>
      <TouchableOpacity onPress={props.onPress}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <FormikInput
            name="dob"
            {...props.formikProps}
            inputProps={{
              type: 'number-pad',
              label: 'Date of birth',
              returnKeyType: 'next',
              placeholder: 'DD/MM/YYYY',
              wrapperStyle: {flex: 1},
            }}
          />
          <MaterialCommunityIcons
            name="calendar"
            size={getSize.f(20)}
            color={props.theme.colors.primary}
          />
          <View style={props.styles.bodInterface} />
        </View>
      </TouchableOpacity>
      <DatePicker
        ref={props.refs}
        onChange={props.onChange}
        maximumDate={new Date(new Date().getFullYear() - 13, 12, 31)}
      />
    </>
  );
};
const ReceivePayout = (props) => {
  return (
    <Paper style={props.styles.formWrapper}>
      <Wrapper dismissKeyboard style={{backgroundColor: 'transparent'}}>
        <Text variant="bold" style={{marginBottom: getSize.w(24)}}>
          Add your bank to receive payouts
        </Text>

        <FormikInput
          name="account_name"
          {...props.formikProps}
          inputProps={{
            label: 'Account Holder Name',
            returnKeyType: 'next',
            placeholder: 'Kizuner',
          }}
        />

        <FormikInput
          name="routing_number"
          {...props.formikProps}
          inputProps={{
            label: 'Routing number',
            type: 'number-pad',
            returnKeyType: 'next',
            placeholder: '1100000',
          }}
        />
        <FormikInput
          name="account_number"
          {...props.formikProps}
          inputProps={{
            label: 'Account number',
            type: 'number-pad',
            returnKeyType: 'next',
            placeholder: '0001234',
          }}
        />
        <FormikInput
          name="aconfirm_account_number"
          {...props.formikProps}
          inputProps={{
            label: 'Confirm account number',
            type: 'number-pad',
            returnKeyType: 'next',
            placeholder: '0001234',
          }}
        />
      </Wrapper>
    </Paper>
  );
};
const FooterFormik = (props) => {
  return (
    <View
      style={[
        props.styles.btnContainer,
        {
          paddingBottom: props.paddingBottom,
        },
      ]}>
      <View style={{flexDirection: 'row', width: '100%'}}>
        <Button
          onPress={props.formikProps.handleSubmit}
          title="Continue"
          fullWidth
          loading={false}
          containerStyle={{flex: 1 / 2}}
        />

        {/* <Button
  onPress={props.formikProps.handleSubmit}
  title='Update'
  fullWidth
  loading={false}
/> */}
        <SpaceView />
        <Button
          onPress={props.onPressWithdraw}
          title="Withdraw"
          fullWidth
          containerStyle={{flex: 1 / 2}}
        />
      </View>
    </View>
  );
};
export default ConnectStripeScreen;
