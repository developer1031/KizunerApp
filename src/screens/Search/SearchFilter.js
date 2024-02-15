import React, {useEffect, useRef, useState} from 'react';
import {ScrollView, StyleSheet, View, Switch} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import {Button, Select, ModalizeWithRange, Text} from 'components';
import {getSize} from 'utils/responsive';
import useTheme from 'theme';
import {GENDERS, PAYMENT_METHOD, TYPE_POST} from 'utils/constants';
import {setFtsFilter, ftsAll, showModalizeAll, hideModalizeAll} from 'actions';
import useKeyboardHeight from 'utils/keyboardHeight';
import {Modalize as RNModalize} from 'react-native-modalize';
import {Platform} from 'react-native';
import {CheckBoxTitle} from 'components/CheckBoxTitle';
import FormikInput from 'components/FormikInput';
import {TextInput} from 'react-native';
import {Formik} from 'formik';
import * as yup from 'yup';
import {Dimensions} from 'react-native';

const SearchFilter = ({navigation}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const refModalLocation = useRef(null);
  const refModalPrice = useRef(null);
  const keyboardHeight = useKeyboardHeight();
  const [showAgeFilter, setShowAgeFilter] = useState(false);
  const [showAgeRange, setShowAgeRange] = useState(false);
  const [gender, setGender] = useState(-1);
  const [ageRange, setAgeRange] = useState(null);
  const {query} = useSelector((state) => state.search);
  const [paymentMethod, setPaymentMethod] = useState(1);
  const [typePost, setTypePost] = useState(1);
  const [priceType, setPriceType] = useState('none'); // none | fixed | range
  const [priceValue, setPriceValue] = useState({
    amount: 0,
    min_amount: 0,
    max_amount: 0,
  });
  const [address, setAddress] = useState({
    address: '',
    lat: null,
    lng: null,
    short_address: '',
  });

  const userInfo = useSelector((state) => state.auth.userInfo);
  const minimumFixedPrice = 10;

  const refFormPrice = useRef(null);
  const refCurrPriceType = useRef('none');

  // Skill
  const [selectedSpecialities, setSelectedSpecialities] = useState([]);

  // Categories
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Online
  const [isOnlineOnly, setIsOnlineOnly] = useState(false);

  const styles = StyleSheet.create({
    wrapper: {
      flex: 1,
      backgroundColor: theme.colors.paper,
    },
    container: {
      paddingHorizontal: getSize.w(24),
      paddingVertical: getSize.h(30),
    },
    bottomButton: {
      position: 'absolute',
      bottom: getSize.h(70),
      left: getSize.w(24),
      right: getSize.w(24),
    },
    bottomResetButton: {
      position: 'absolute',
      bottom: getSize.h(50),
      left: getSize.w(24),
      right: getSize.w(24),
      justifyContent: 'center',
      alignItems: 'center',
    },
    selectWrap: {
      marginBottom: getSize.h(10),
    },
    switchWrap: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: getSize.h(10),
    },
  });

  function handleApplyFilter() {
    const age = ageRange ? `${ageRange.min}-${ageRange.max}` : null;
    const gend = gender !== -1 ? gender : null;
    dispatch(
      setFtsFilter({
        age,
        gender: gend,
        skills: selectedSpecialities.map((i) => i.id),
        categories: selectedCategories.map((i) => i.id),
        available_status: isOnlineOnly ? 'online' : null,
      }),
    );

    setTimeout(
      () =>
        dispatch(
          ftsAll({
            age,
            gender: gend,
            query,
            page: 1,
            skills: selectedSpecialities.map((i) => i.id),
            categories: selectedCategories.map((i) => i.id),
            available_status: isOnlineOnly ? 'online' : null,

            offer_type: typePost === 1 ? null : typePost === 2 ? 1 : 2,
            payment_method:
              paymentMethod === 1
                ? null
                : paymentMethod === 2
                ? 'credit'
                : 'crypto',
            location: {
              lat: address.lat,
              lng: address.lng,
            },
            amount: priceType === 'none' ? null : priceValue.amount,
            min_amount: priceType === 'range' ? priceValue.min_amount : null,
            max_amount: priceType === 'range' ? priceValue.max_amount : null,
          }),
        ),
      100,
    );
    navigation.goBack();
  }

  function showSpecialitiesPicker() {
    dispatch(
      showModalizeAll({
        options: (userInfo?.allSpecs?.data || []).map((item) => ({
          id: item.id,
          label: item.name,
        })),
        selected: selectedSpecialities,
        onApply: (selected) => {
          setSelectedSpecialities(selected);
          dispatch(hideModalizeAll());
        },
        onClear: () => {
          setSelectedSpecialities([]);
          dispatch(hideModalizeAll());
        },
      }),
    );
  }

  function showCategoriesPicker() {
    dispatch(
      showModalizeAll({
        options: (userInfo?.allCategories?.data || []).map((item) => ({
          id: item.id,
          label: item.name,
        })),
        selected: selectedCategories,
        onApply: (selected) => {
          setSelectedCategories(selected);
          dispatch(hideModalizeAll());
        },
        onClear: () => {
          setSelectedCategories([]);
          dispatch(hideModalizeAll());
        },
      }),
    );
  }

  return (
    <>
      <ScrollView
        style={styles.wrapper}
        contentContainerStyle={styles.container}>
        <Select
          label="Filter by Gender"
          value={
            GENDERS.find((i) => i.value === gender)?.label || 'All Genders'
          }
          options={[{label: 'All Genders', value: -1}, ...GENDERS]}
          wrapperStyle={styles.selectWrap}
          onSelect={(value) => setGender(value)}
        />
        <Select
          label="Filter by Age"
          value={
            ageRange ? `from ${ageRange.min} to ${ageRange.max}` : 'All Ages'
          }
          onPress={() => setShowAgeFilter(true)}
          wrapperStyle={styles.selectWrap}
        />
        <Select
          label="Filter by Categories"
          value={selectedCategories.map((i) => i.label).join(', ')}
          onPress={() => showCategoriesPicker(true)}
          wrapperStyle={styles.selectWrap}
        />
        <Select
          label="Filter by Specialties"
          value={selectedSpecialities.map((i) => i.label).join(', ')}
          onPress={() => showSpecialitiesPicker(true)}
          wrapperStyle={styles.selectWrap}
        />

        <Select
          label="Location"
          value={address.short_address}
          onPress={() => {
            refModalLocation.current?.open();
          }}
          wrapperStyle={styles.selectWrap}
        />
        <Select
          label="Price"
          value={
            priceType !== 'none' &&
            (priceType === 'fixed'
              ? `${priceValue.amount} USD`
              : `${priceValue.min_amount} - ${priceValue.max_amount} USD`)
          }
          onPress={() => refModalPrice.current?.open()}
          wrapperStyle={styles.selectWrap}
        />
        <Select
          label="Credit or Crypto"
          value={PAYMENT_METHOD.find((i) => i.value === paymentMethod)?.label}
          options={PAYMENT_METHOD}
          onSelect={(value) => setPaymentMethod(value)}
          wrapperStyle={styles.selectWrap}
        />
        <Select
          label="Date or Multi-times"
          value={TYPE_POST.find((i) => i.value === typePost)?.label}
          options={TYPE_POST}
          onSelect={(value) => setTypePost(value)}
          wrapperStyle={styles.selectWrap}
        />

        <View style={styles.switchWrap}>
          <Text variant="inputLabel">Only Show Online</Text>
          <Switch
            trackColor={{
              false: theme.colors.disabled,
              true: theme.colors.secondary,
            }}
            thumbColor={theme.colors.paper}
            ios_backgroundColor={theme.colors.disabled}
            onValueChange={() => setIsOnlineOnly(!isOnlineOnly)}
            value={isOnlineOnly}
          />
        </View>

        <View style={{height: 300}} />
      </ScrollView>
      {keyboardHeight === 0 && (
        <>
          <View style={styles.bottomButton}>
            <Button
              title="Apply Filter"
              fullWidth
              onPress={handleApplyFilter}
            />
          </View>
        </>
      )}
      <ModalizeWithRange
        onClose={() => setShowAgeFilter(false)}
        open={showAgeFilter}
        options={[
          {
            label: 'All Ages',
            value: false,
            onPress: () => {
              setShowAgeRange(false);
              setShowAgeFilter(false);
              setAgeRange(null);
            },
          },
          {label: 'Custom', value: true, onPress: () => setShowAgeRange(true)},
        ]}
        selected={showAgeRange}
        showRange={showAgeRange}
        onSelectRange={(range) => setAgeRange(range)}
      />

      <RNModalize
        withReactModal={Platform.OS === 'android' ? false : true}
        ref={refModalLocation}
        modalHeight={Dimensions.get('screen').height / 2.2}>
        <View style={{padding: 25, flexDirection: 'row'}}>
          <View style={{flex: 1, marginRight: 25}}>
            <Button
              title="Clear"
              variant="ghost"
              onPress={() => {
                setAddress({
                  address: '',
                  lat: null,
                  lng: null,
                  short_address: '',
                });
                refModalLocation.current?.close();
              }}
            />
          </View>
          <View style={{flex: 1}}>
            <Button
              title="Select"
              onPress={() => {
                refModalLocation.current?.close();
                navigation.navigate('PickLocationPost', {
                  onSelect: async (data) => {
                    setAddress(data);
                  },
                });
              }}
            />
          </View>
        </View>
      </RNModalize>

      <RNModalize
        withReactModal={Platform.OS === 'android' ? true : true}
        ref={refModalPrice}
        modalHeight={Dimensions.get('screen').height / 2.2}
        onClose={() => {
          setPriceType(refCurrPriceType.current);
        }}>
        <View style={{padding: 25}}>
          <Formik
            innerRef={refFormPrice}
            validateOnChange={false}
            initialValues={{
              amount: 0,
              min_amount: 10,
              max_amount: 0,
            }}
            validationSchema={() => {
              return yup.object().shape({
                amount:
                  priceType === 'fixed' &&
                  yup
                    .number()
                    .min(
                      minimumFixedPrice,
                      `Minimum price is ${minimumFixedPrice}$`,
                    )
                    .max(10000)
                    .nullable()
                    .integer()
                    .typeError('Please enter number value only')
                    .required(),
                min_amount:
                  priceType === 'range' &&
                  yup
                    .number()
                    .min(
                      minimumFixedPrice,
                      `Minimum price is ${minimumFixedPrice}$`,
                    )
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
              });
            }}
            onSubmit={(values) => {
              setPriceValue(values);
              refCurrPriceType.current = priceType;

              refModalPrice.current?.close();
            }}>
            {(formikProps) => {
              // useEffect(() => {
              //   setPriceType(refCurrPriceType.current);
              //   formikProps.setFieldValue('amount', priceValue.amount);
              //   formikProps.setFieldValue('min_amount', priceValue.min_amount);
              //   formikProps.setFieldValue('max_amount', priceValue.max_amount);
              // }, []);

              return (
                <>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <CheckBoxTitle
                      callback={setPriceType}
                      status={'none'}
                      choose={priceType}
                      title="None"
                    />
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
                    />
                  </View>

                  {priceType !== 'none' &&
                    (priceType === 'fixed' ? (
                      <FormikInput
                        name="amount"
                        {...formikProps}
                        inputProps={{
                          placeholder: 'enter price',
                          label: `Price`,
                          keyboardType: 'number-pad',
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
                    ))}

                  <View style={{marginTop: 20}}>
                    <Button
                      title="Confirm"
                      onPress={() => refFormPrice.current?.handleSubmit()}
                    />
                  </View>
                </>
              );
            }}
          </Formik>
        </View>
      </RNModalize>
    </>
  );
};

export default SearchFilter;
