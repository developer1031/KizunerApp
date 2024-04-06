import React, {useEffect, useRef, useState} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import useTheme from 'theme';
import {getSize} from 'utils/responsive';
import {Wrapper, Text, Touchable, Button} from 'components';
import {useDispatch, useSelector} from 'react-redux';
import {connectStripe, getStripeCustomAccount} from 'actions';
import {Formik} from 'formik';
import Paper from 'components/Paper';
import FormikInput from 'components/FormikInput';
import WithdrawModel from './components/WithdrawModel';
import {SpaceView} from 'components/SpaceView';
import CountryPicker from 'components/CountryPicker';
import {countries as countriesData} from 'assets/data';
import FastImage from 'react-native-fast-image';
import DatePicker from './components/DatePicker';
import ImageStripePicker from 'components/ImageStripePicker';
import * as yup from 'yup';
import moment from 'moment';
import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  View,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import {showAlert} from 'actions';
import {getWalletStripeStatus} from 'actions';
import {HeaderLinear} from 'components/HeaderLinear';

import BankJapan from './components/BankJapan';
import BankDefault from './components/_BankDefault';
import BankACOnly, {ACN_ONLY_COUNTRY} from './components/_BankACOnly';
import BankIban, {IBAN_COUNTRY} from './components/_BankIban';
import BankNormal, {BANK_NORMAL_COUNTRY} from './components/_BankNormal';
import BankNormalType, {BANK_TYPE_CODES} from './components/_BankNormalType';
import BankNormalBranch, {
  BANK_BRANCH_CODES,
} from './components/_BankNormalBranch';
import BankSwift, {BANK_SWIFT_CODES} from './components/_BankSwift';
import BankArgentina from './components/BankArgentina';
import BankkAustralia from './components/BankAustralia';
import BankAzerbaijan from './components/BankAzerbaijan';
import BankCanada from './components/BankCanada';
import BankGhana from './components/BankGhana';
import BankHongkong from './components/BankHongkong';
import BankIndia from './components/BankIndia';
import BankMalaysia from './components/BankMalaysia';
import BankMexico from './components/BankMexico';
import BankNewZealand from './components/BankNewZeland';
import BankPeru from './components/BankPeru';
import BankUK from './components/BankUK';
import BankUS from './components/BankUS';

const {width, height} = Dimensions.get('window');

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
  ssn_last_4: '',
  identity_document: '',
  identity_document_back: '',
  routing_number: '',
  account_name: '',
  account_number: '',
  aconfirm_account_number: '',
  iban: '',
  bank_code: '',
  branch_code: '',
  sort_code: '',
  bsb: '',
  transit_number: '',
  institution_number: '',
  swift_code: '',
  clabe: '',
  cci: '',
  ifsc_code: '',
  clearing_code: '',
  cbu: '',
};

const ConnectStripeScreen = ({navigation}) => {
  const dispatch = useDispatch();

  const {stripeStatusResponse} = useSelector((state) => state.wallet);
  const {amount, status} = stripeStatusResponse;
  const isEdit = status == 'CONNECTED' || status == 'PENDING';
  const notConnected = status == 'NOT_CONNECTED';

  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const HEADER_HEIGHT = 68 + insets.top;

  const refWithdraw = useRef(null);

  const [showCountryPicker, setShowCountryPicker] = useState(false);

  const [countryCode, setCountryCode] = useState('US');
  const countryData = countriesData[countryCode];

  const [initialized, setInitialized] = useState(false);
  const [defaultFormValues, setDefaultFormValues] = useState(initialValues);
  const [isEditing, setIsEditing] = useState(false);

  //init datepicker
  const refDatePicker = useRef(null);
  const [rerenderFlag, setRerenderFlag] = useState(false);
  const [loading, setLoading] = useState(false);

  const countryCodeData = countriesData[countryCode];

  const styles = StyleSheet.create({
    btnBack: {
      position: 'absolute',
      top: insets.top + getSize.h(20),
      left: getSize.w(24),
      zIndex: 10,
    },
    headerTitle: {
      top: insets.top + getSize.h(26),
      textAlign: 'center',
    },
    mainContainer: {
      paddingVertical: getSize.w(24),
      paddingHorizontal: getSize.w(24),
    },
    formWrapper: {
      paddingVertical: getSize.h(40),
      paddingHorizontal: getSize.w(24),
    },
    btnContainer: {
      paddingTop: getSize.h(24),
      paddingBottom: insets.bottom + getSize.h(12),
      paddingHorizontal: getSize.w(24),
      backgroundColor: 'white',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',

      shadowOpacity: 0.5,
      shadowOffset: {
        width: 0,
        height: 5,
      },
      shadowColor: '#000',
      shadowRadius: 5,
      elevation: 5,
    },
    countryFlag: {
      width: getSize.w(28),
      height: getSize.h(20),
      borderRadius: getSize.h(2),
      resizeMode: 'contain',
      marginRight: getSize.w(5),
    },
    countryValue: {
      paddingVertical: getSize.h(Platform.OS === 'ios' ? 10 : 8),
      fontSize: getSize.f(16),
      letterSpacing: 1,
    },
    phoneInput: {
      overflow: 'hidden',
      flexGrow: 1,
      maxWidth: width / 2 + getSize.w(10) - getSize.w(48),
      paddingVertical: 0,
      marginVertical: 0,
    },

    bodInterface: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      zIndex: 1,
      top: 0,
      left: 0,
    },
  });

  useEffect(() => {
    dispatch(
      getStripeCustomAccount(
        {},
        {
          success: (result) => {
            const {account} = result;
            const callingCode = countriesData[account.country].callingCode[0];

            const {individual} = account;

            if (countryCode == 'JP') {
              setDefaultFormValues({
                first_name: individual.first_name,
                last_name: individual.last_name,
                first_name_kana: individual.first_name_kana,
                last_name_kana: individual.last_name_kana,
                postal_code: individual.address_kana.postal_code,
                address_state: individual.address_kanji.state,
                address_city: individual.address_kanji.city,
                address_line1: individual.address_kanji.line1,
                address_line1_kana: individual.address_kana.line1,
                address_line2: individual.address_kanji.line2,
                address_line2_kana: individual.address_kana.line2,
                dob: `${individual.dob.day}/${individual.dob.month}/${individual.dob.year}`,
                phone: individual.phone.substring(callingCode.length + 1),
              });
            } else {
              setDefaultFormValues({
                first_name: individual.first_name,
                last_name: individual.last_name,
                postal_code: individual.address.postal_code,
                address_state: individual.address.state,
                address_city: individual.address.city,
                address_line1: individual.address.line1,
                address_line2: individual.address.line2,
                dob: `${individual.dob.day}/${individual.dob.month}/${individual.dob.year}`,
                phone: individual.phone.substring(callingCode.length + 1),
              });
            }

            setCountryCode(account.country);
            setIsEditing(true);
            setInitialized(true);
          },
          failure: (err) => {
            setInitialized(true);
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
    setLoading(true);

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
      isEditing: isEditing,
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
          setLoading(false);
          navigation.goBack();
        },
        failure: (err) => {
          setLoading(false);
          dispatch(
            showAlert({
              title: 'Error',
              type: 'error',
              body: err,
            }),
          );
        },
      }),
    );

    // navigation.navigate('PaymentOTP')
  };
  const onPressWithdraw = () => refWithdraw.current?.show();

  return (
    <KeyboardAvoidingView behavior="padding" style={{flex: 1}}>
      <CountryPicker
        open={showCountryPicker}
        onClose={() => setShowCountryPicker(false)}
        value={countryCode}
        showCode={false}
        onSelect={(value) => {
          setCountryCode(value);
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

        {initialized && (
          <FormikComponent
            loading={loading}
            onSubmit={onSubmit}
            setShowCountryPicker={setShowCountryPicker}
            countryData={countryData}
            refDatePicker={refDatePicker}
            countryCodeData={countryCodeData}
            theme={theme}
            insets={insets}
            isEdit={isEdit}
            isEditing={isEditing}
            countryCode={countryCode}
            notConnected={notConnected}
            onPressWithdraw={onPressWithdraw}
            defaultFormValues={defaultFormValues}
          />
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const FormikComponent = (props) => {
  const {isEditing, defaultFormValues, countryCode} = props;

  const [editBank, setEditBank] = useState(false);
  const [editVerification, setEditVerification] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const insets = useSafeAreaInsets();
  const [showSubmit, setShowSubmit] = useState(true);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardWillShow',
      () => {
        setShowSubmit(false);
      },
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setShowSubmit(true);
      },
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const styles = {
    btnBack: {
      position: 'absolute',
      top: insets.top + getSize.h(20),
      left: getSize.w(24),
      zIndex: 10,
    },
    headerTitle: {
      top: insets.top + getSize.h(26),
      textAlign: 'center',
    },
    mainContainer: {
      flexGrow: 1,
      paddingVertical: getSize.w(24),
      paddingHorizontal: getSize.w(24),
    },
    formWrapper: {
      paddingVertical: getSize.h(40),
      paddingHorizontal: getSize.w(24),
    },
    btnContainer: {
      paddingTop: getSize.h(12),
      paddingBottom: insets.bottom + getSize.h(12),
      paddingHorizontal: getSize.w(24),
      backgroundColor: 'white',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',

      shadowOpacity: 0.5,
      shadowOffset: {
        width: 0,
        height: 5,
      },
      shadowColor: '#000',
      shadowRadius: 5,
      elevation: 5,
    },
    phoneInputWrapper: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    datePickerInput: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: 10,
    },
    countryInput: {
      minWidth: 100,
      borderBottomWidth: getSize.h(1),
      borderBottomColor: props.theme.colors.divider,
    },
    countryWrap: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    countryFlag: {
      width: getSize.w(28),
      height: getSize.h(20),
      borderRadius: getSize.h(2),
      resizeMode: 'contain',
      marginRight: getSize.w(5),
    },
    countryValue: {
      paddingVertical: getSize.h(Platform.OS === 'ios' ? 10 : 8),
      fontSize: getSize.f(16),
      letterSpacing: 1,
      color: props.theme.colors.text,
    },
    phoneWrapper: {
      marginLeft: 20,
      flexGrow: 1,
      width: width - getSize.w(48 * 2 + 20 + 100),
    },
    bodInterface: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      zIndex: 1,
      top: 0,
      left: 0,
    },
    flex: {
      flex: 1,
      flexDirection: 'row',
      gap: getSize.w(10),
    },
    btnEditText: {
      marginBottom: 16,
      // underline
      textDecorationLine: 'underline',
    },
  };

  useEffect(() => {
    if (isEditing) {
      if (editBank) {
        if (countryCode == 'JP') {
          validateOptions.bank_code = yup.string().required('required');
          validateOptions.branch_code = yup.string().required('required');
          validateOptions.account_name = yup.string().required('required');
        } else if (ACN_ONLY_COUNTRY.includes(countryCode)) {
        } else if (IBAN_COUNTRY.includes(countryCode)) {
          validateOptions.iban = yup.string().required('required');
        }

        validateOptions.account_name = yup.string().required('required');
        validateOptions.account_number = yup.string().required('required');
      } else {
        delete validateOptions.account_name;
        delete validateOptions.routing_number;
        delete validateOptions.account_number;
        delete validateOptions.confirm_account_number;
        delete validateOptions.iban;
      }
      setRefresh(!refresh);
    }
  }, [editBank]);

  useEffect(() => {
    if (isEditing) {
      if (editVerification) {
        validateOptions.identity_document = yup.string().required('required');
        validateOptions.identity_document_back = yup
          .string()
          .required('required');
      } else {
        delete validateOptions.identity_document;
        delete validateOptions.identity_document_back;
      }
      setRefresh(!refresh);
    } else {
    }
  }, [editVerification]);

  useEffect(() => {
    if (countryCode == 'JP') {
      validateOptions.first_name_kana = yup.string().required('required');
      validateOptions.last_name_kana = yup.string().required('required');
      validateOptions.address_line1_kana = yup.string().required('required');
      validateOptions.account_name = yup.string().required('required');
      validateOptions.bank_code = yup.string().required('required');
      validateOptions.branch_code = yup.string().required('required');
      validateOptions.account_number = yup.string().required('required');
    } else if (ACN_ONLY_COUNTRY.includes(countryCode)) {
      validateOptions.account_name = yup.string().required('required');
      validateOptions.account_number = yup.string().required('required');
    } else if (IBAN_COUNTRY.includes(countryCode)) {
      validateOptions.iban = yup.string().required('required');
    }
  }, [countryCode]);

  const validateOptions = {
    dob: yup.string().required('required'),
    phone: yup
      .number()
      .integer()
      .typeError('please enter number value only')
      .required('required'),
    first_name: yup.string().required('required'),
    last_name: yup.string().required('required'),
    postal_code: yup.string().required('required'),
    address_line1: yup.string().required('required'),
  };

  const yupValidation = () => yup.object().shape(validateOptions);

  const showVerificationEdit = !isEditing || editVerification;
  const showBankEdit = !isEditing || editBank;

  return (
    <Formik
      validateOnChange={false}
      validationSchema={yupValidation}
      onSubmit={props.onSubmit}
      initialValues={defaultFormValues}>
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

              {['KR', 'AU'].includes(countryCode) && (
                <>
                  <FormikInput
                    name="address_state"
                    {...formikProps}
                    inputProps={{
                      label: 'Province',
                      returnKeyType: 'next',
                      placeholder: '',
                    }}
                  />
                  <FormikInput
                    name="address_city"
                    {...formikProps}
                    inputProps={{
                      label: 'City',
                      returnKeyType: 'next',
                      placeholder: '',
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
                formikProps={formikProps}
                styles={styles}
                {...props}
              />

              {/* COUNTRY-CODE */}
            </InfoComponent>

            {isEditing && !editVerification && (
              <Text
                onPress={() => setEditVerification(true)}
                style={styles.btnEditText}>
                Edit Verification Info
              </Text>
            )}

            {showVerificationEdit && (
              <VerificationComponent styles={styles}>
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

                {countryCode == 'US' && (
                  <>
                    <FormikInput
                      name="id_number"
                      {...formikProps}
                      inputProps={{
                        label: 'Social Security number',
                        returnKeyType: 'next',
                        placeholder: '123-45-6789',
                      }}
                    />
                    <FormikInput
                      name="tax_id"
                      {...formikProps}
                      inputProps={{
                        label: 'Taxpayer Identification Number (TIN)',
                        returnKeyType: 'next',
                        placeholder: '123-45-6789',
                      }}
                    />
                  </>
                )}
              </VerificationComponent>
            )}

            {isEditing && !editBank && (
              <Text
                onPress={() => setEditBank(true)}
                style={styles.btnEditText}>
                Edit Bank Account
              </Text>
            )}

            {showBankEdit && (
              <ExternalAccount
                styles={styles}
                countryCode={countryCode}
                formikProps={formikProps}
              />
            )}
          </ScrollView>

          {showSubmit && (
            <FooterFormik
              loading={props.loading}
              formikProps={formikProps}
              notConnected={props.notConnected}
              paddingBottom={props.insets.bottom || getSize.h(24)}
              styles={styles}
              onPressWithdraw={props.onPressWithdraw}
            />
          )}
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
const VerificationComponent = (props) => {
  return (
    <Paper style={[props.styles.formWrapper, {marginBottom: getSize.w(24)}]}>
      <Wrapper dismissKeyboard style={{backgroundColor: 'transparent'}}>
        <Text variant="bold" style={{marginBottom: getSize.w(24)}}>
          Verification process
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
        Identity front
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
    <View>
      <Text variant="inputLabel">Phone Number</Text>
      <View style={props.styles.phoneInputWrapper}>
        <View style={props.styles.countryInput}>
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

        <FormikInput
          name="phone"
          {...props.formikProps}
          inputProps={{
            label: '',
            returnKeyType: 'next',
            placeholder: '',
            wrapperStyle: props.styles.phoneWrapper,
            type: 'phone-pad',
            style: props.styles.phoneInput,
          }}
        />
      </View>
    </View>
  );
};
const CalendarComponent = (props) => {
  return (
    <>
      <TouchableOpacity onPress={props.onPress}>
        <View style={props.styles.datePickerInput}>
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
        maximumDate={new Date(new Date().getFullYear() - 14, 12, 31)}
      />
    </>
  );
};
const ExternalAccount = ({styles, countryCode, formikProps}) => {
  const render_country_bank = () => {
    if (countryCode == 'JP') {
      return <BankJapan formikProps={formikProps} />;
    } else if (ACN_ONLY_COUNTRY.includes(countryCode)) {
      return <BankACOnly formikProps={formikProps} />;
    } else if (IBAN_COUNTRY.includes(countryCode)) {
      return <BankIban formikProps={formikProps} />;
    } else if (BANK_BRANCH_CODES.includes(countryCode)) {
      return <BankNormalBranch formikProps={formikProps} />;
    } else if (BANK_NORMAL_COUNTRY.includes(countryCode)) {
      return <BankNormal formikProps={formikProps} />;
    } else if (BANK_SWIFT_CODES.includes(countryCode)) {
      return <BankSwift formikProps={formikProps} />;
    } else if (BANK_TYPE_CODES.includes(countryCode)) {
      return <BankNormalType formikProps={formikProps} />;
    }

    switch (countryCode) {
      case 'AR':
        return <BankArgentina formikProps={formikProps} />;
      case 'AU':
        return <BankkAustralia formikProps={formikProps} />;
      case 'AZ':
        return <BankAzerbaijan formikProps={formikProps} />;
      case 'CA':
        return <BankCanada formikProps={formikProps} />;
      case 'GH':
        return <BankGhana formikProps={formikProps} />;
      case 'HK':
        return <BankHongkong formikProps={formikProps} />;
      case 'IN':
        return <BankIndia formikProps={formikProps} />;
      case 'MY':
        return <BankMalaysia formikProps={formikProps} />;
      case 'MX':
        return <BankMexico formikProps={formikProps} />;
      case 'NZ':
        return <BankNewZealand formikProps={formikProps} />;
      case 'PE':
        return <BankPeru formikProps={formikProps} />;
      case 'GB':
        return <BankUK formikProps={formikProps} />;
      case 'US':
        return <BankUS formikProps={formikProps} />;
    }

    return <BankDefault formikProps={formikProps} />;
  };

  return (
    <Paper style={styles.formWrapper}>
      <Wrapper dismissKeyboard style={{backgroundColor: 'transparent'}}>
        <Text variant="bold" style={{marginBottom: getSize.w(24)}}>
          Add your bank to receive payouts.
        </Text>

        {render_country_bank()}
      </Wrapper>
    </Paper>
  );
};
const FooterFormik = (props) => {
  return (
    <View style={[props.styles.btnContainer]}>
      {props.notConnected ? (
        <Button
          title="Connect"
          fullWidth
          loading={props.loading}
          onPress={props.formikProps.handleSubmit}
          containerStyle={{flex: 1 / 2}}
        />
      ) : (
        <View style={{flexDirection: 'row', width: '100%'}}>
          <Button
            title="Stripe Edit"
            onPress={props.formikProps.handleSubmit}
            fullWidth
            loading={props.loading}
            containerStyle={{flex: 1 / 2}}
          />

          <SpaceView />

          <Button
            onPress={props.onPressWithdraw}
            title="Withdraw"
            fullWidth
            containerStyle={{flex: 1 / 2}}
          />
        </View>
      )}
    </View>
  );
};
export default ConnectStripeScreen;
