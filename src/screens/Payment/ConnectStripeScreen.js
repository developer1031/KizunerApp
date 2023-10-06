import React, {useEffect, useRef, useState} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSafeArea} from 'react-native-safe-area-context';
import useTheme from 'theme';
import {getSize} from 'utils/responsive';
import {Wrapper, Text, Touchable, Button} from 'components';
import LinearGradient from 'react-native-linear-gradient';
import {useDispatch} from 'react-redux';
import {connectStripe} from 'actions';
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

const yupValidation = () =>
  yup.object().shape({
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
  });
const initialValues = {
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

  const theme = useTheme();
  const insets = useSafeArea();
  const HEADER_HEIGHT = 68 + insets.top;

  const refWithdraw = useRef(null);

  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [country, setCountry] = useState('US');
  const countryData = countriesData[country];

  const [showCountryCodePicker, setShowCountryCodePicker] = useState(false);
  const [countryCode, setCountryCode] = useState('US');

  //init datepicker
  const refDatePicker = useRef(null);
  const [rerenderFlag, setRerenderFlag] = useState(false);

  const countryCodeData = countriesData[countryCode];

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
          dispatch(showAlert({title: 'Error', type: 'error', body: err}));
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

      <WithdrawModel ref={refWithdraw} />

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
  };
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
    <TouchableWithoutFeedback onPress={props.onPress} disabled>
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
          keyboardType: 'phone-pad',
          style: props.styles.phoneInput,
        }}
      />
    </View>
  );
};
const CalendarComponent = (props) => {
  return (
    <>
      <DatePicker
        ref={props.refs}
        onChange={props.onChange}
        maximumDate={new Date(new Date().getFullYear() - 13, 12, 31)}
      />
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
          name="routing_number"
          {...props.formikProps}
          inputProps={{
            label: 'Routing number',
            type: 'number-pad',
            returnKeyType: 'next',
            placeholder: '110000000',
          }}
        />
        <FormikInput
          name="account_number"
          {...props.formikProps}
          inputProps={{
            label: 'Account number',
            type: 'number-pad',
            returnKeyType: 'next',
            placeholder: '000123456789',
          }}
        />
        <FormikInput
          name="aconfirm_account_number"
          {...props.formikProps}
          inputProps={{
            label: 'Confirm account number',
            type: 'number-pad',
            returnKeyType: 'next',
            placeholder: '000123456789',
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
