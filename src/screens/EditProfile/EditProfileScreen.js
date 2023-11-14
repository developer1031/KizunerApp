import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {IconButton as PaperIconButton} from 'react-native-paper';
import * as yup from 'yup';
import {useSelector, useDispatch} from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import {Formik} from 'formik';

import useTheme from 'theme';
import {getSize} from 'utils/responsive';

import {data as languagesDataJson} from 'assets/data';

import LanguagePicker from 'components/LanguagePicker';
import {
  Wrapper,
  Paper,
  HeaderBg,
  Text,
  Touchable,
  FormikInput,
  SpecialtyList,
  Select,
  DateTimePicker,
  Loading,
  Input,
  CountryPickerDataServer,
} from 'components';
import {GENDERS} from 'utils/constants';
import {getCountryList, updateUserGeneral} from 'actions';

const EditProfileScreen = ({navigation}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.beingUpdateGeneral);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const countryList = useSelector((state) => state.app.countryList);
  const HEADER_HEIGHT = getStatusBarHeight() + 120;
  const [showDatePicker, setShowDatePicker] = useState(false);

  let dateMax = new Date();
  dateMax.setDate(dateMax.getDate() - 1);

  // Not Luan
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [country, setCountry] = useState(userInfo?.language ?? ['en']);

  const [showCountryUserPicker, setShowCountryUserPicker] = useState(false);

  useEffect(() => {
    dispatch(getCountryList({}));
    return;
  }, []);

  //console.log(countryList);

  const styles = StyleSheet.create({
    wrapper: {flex: 1},
    scrollWrap: {marginTop: getSize.h(70), flex: 1},
    scrollCon: {
      paddingBottom: getSize.h(20) + insets.bottom,
    },
    form: {
      paddingVertical: getSize.h(30),
      paddingHorizontal: getSize.w(24),
      marginHorizontal: getSize.w(24),
      marginBottom: getSize.h(24),
    },
    headerTitle: {
      top: getStatusBarHeight() + getSize.h(26),
      textAlign: 'center',
    },
    headerActions: {
      position: 'absolute',
      top: getStatusBarHeight() + getSize.h(25),
      left: getSize.w(24),
      right: getSize.w(24),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 1,
    },
    headerBtn: {
      fontSize: getSize.f(16),
      fontFamily: theme.fonts.sfPro.medium,
      color: theme.colors.textContrast,
    },
    formHeaderText: {
      fontFamily: theme.fonts.sfPro.medium,
      fontSize: getSize.f(16),
      textTransform: 'uppercase',
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
    facebook: {
      backgroundColor: '#1778F2',
    },
    twitter: {
      backgroundColor: '#4DC7F1',
    },
    linkedin: {
      backgroundColor: '#017EBB',
    },
    instagram: {
      backgroundColor: '#FF3C60',
    },
    snsIcon: {
      width: getSize.h(24),
      height: getSize.h(24),
      borderRadius: getSize.h(24 / 2),
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.paper,
    },
    countryFlag: {
      width: getSize.w(24),
      height: getSize.h(20),
      borderRadius: getSize.h(2),
      resizeMode: 'contain',
      marginRight: getSize.w(10),
    },
    languageLetter: {
      borderRadius: getSize.h(2),
      //marginRight: getSize.w(12),
    },
    countryWrap: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    countryInput: {
      minWidth: 100,
      borderBottomWidth: getSize.h(1),
      borderBottomColor: theme.colors.divider,
    },
    countryValue: {
      paddingVertical: getSize.h(Platform.OS === 'ios' ? 10 : 8),
      fontSize: getSize.f(16),
      letterSpacing: 1,
      color: theme.colors.text,
    },
    languageWrap: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    language: {
      marginBottom: getSize.h(20),
    },
  });
  //const countryData = languagesData[country];
  return (
    <Formik
      initialValues={{
        about: userInfo?.about || '',
        birth_date: userInfo?.birth_date,
        gender: userInfo?.gender,
        social: {
          facebook: userInfo?.social?.facebook,
          twitter: userInfo?.social?.twitter,
          linkedin: userInfo?.social?.linkedin,
          instagram: userInfo?.social?.instagram,
        },
        language: userInfo?.language || [],
        address: userInfo?.resident?.address,
        short_address: userInfo?.resident?.short_address,
        lat: userInfo?.resident?.lat,
        lng:
          userInfo && userInfo.resident && userInfo.resident.lng
            ? userInfo.resident.lng
            : userInfo?.resident?.long,
        country: userInfo?.country?.id || 0,
      }}
      validationSchema={yup.object().shape({
        about: yup.string().nullable(),
        birth_date: yup.string().nullable(),
        gender: yup.number().nullable(),
        social: yup.object().shape({
          facebook: yup.string().nullable(),
          twitter: yup.string().nullable(),
          linkedin: yup.string().nullable(),
          instagram: yup.string().nullable(),
        }),
        language: yup.array(yup.string().nullable()).min(0),
        address: yup.string().nullable(),
        short_address: yup.string().nullable(),
        lat: yup.string().nullable(),
        lng: yup.string().nullable(),
        country: yup.number().nullable(),
      })}
      onSubmit={(values) => {
        Keyboard.dismiss();
        const data = Object.assign(values, {
          residentAddress: values.address,
          residentLat: values.lat,
          residentLng: values.lng,
        });
        dispatch(updateUserGeneral(data, () => navigation.goBack()));
      }}>
      {(formikProps) => (
        <Wrapper style={styles.wrapper}>
          <HeaderBg height={HEADER_HEIGHT} />
          <Text variant="header" style={styles.headerTitle}>
            Edit Profile
          </Text>
          <View style={styles.headerActions}>
            <Touchable onPress={navigation.goBack}>
              <Text style={styles.headerBtn}>Cancel</Text>
            </Touchable>
            {loading ? (
              <Loading />
            ) : (
              <Touchable
                disabled={loading}
                onPress={() => formikProps.handleSubmit()}>
                <Text style={styles.headerBtn}>Save</Text>
              </Touchable>
            )}
          </View>
          <KeyboardAvoidingView
            style={styles.wrapper}
            behavior="padding"
            keyboardVerticalOffset={Platform.OS === 'android' ? -200 : -150}>
            <ScrollView
              style={styles.scrollWrap}
              contentContainerStyle={styles.scrollCon}
              showsVerticalScrollIndicator={false}>
              <Paper style={styles.form}>
                <FormikInput
                  name="about"
                  {...formikProps}
                  inputProps={{
                    placeholder: 'introduce yourself',
                    label: 'About',
                    numberOfLines: 4,
                    style: styles.aboutInput,
                    multiline: true,
                  }}
                />
                <Select
                  placeholder="select your gender"
                  label="Genders"
                  options={GENDERS}
                  error={formikProps.errors.gender}
                  onSelect={(value) =>
                    formikProps.setFieldValue('gender', value, true)
                  }
                  value={
                    GENDERS.find((i) => i.value === formikProps.values.gender)
                      ?.label
                  }
                />
                <Input
                  placeholder="MMM DD, YYYY"
                  label="Birthday"
                  value={
                    formikProps.values.birth_date
                      ? moment(
                          formikProps.values.birth_date,
                          'YYYY-MM-DD',
                        ).format('MMM DD, YYYY')
                      : ''
                  }
                  onPress={() => setShowDatePicker(true)}
                  error={formikProps.errors.birth_date}
                />

                <Touchable
                  style={styles.language}
                  onPress={() => setShowCountryPicker(true)}>
                  <View style={styles.countryInput}>
                    <Text variant="inputLabel">Language</Text>
                    <View style={styles.countryWrap}>
                      <View
                        style={[
                          styles.languageWrap,
                          {
                            flexWrap: 'wrap',
                            paddingVertical: getSize.w(8),
                            width: '90%',
                          },
                        ]}>
                        {formikProps.values.language?.map((item, index) => {
                          return (
                            <View
                              key={languagesDataJson[item]?.name}
                              style={styles.languageLetter}>
                              <Text>
                                {languagesDataJson[item]?.name}
                                {index !=
                                  formikProps.values.language?.length - 1 &&
                                  ' - '}
                              </Text>
                            </View>
                          );
                        })}
                      </View>
                      <MaterialCommunityIcons
                        name="menu-down"
                        size={getSize.f(24)}
                        color={theme.colors.text}
                      />
                    </View>
                  </View>
                </Touchable>
                {/* <Input
                  placeholder='Your hometown'
                  label='Country'
                  touched={formikProps.touched.country}
                  value={
                    countryList?.find(i => i.id === formikProps.values.country)
                      ?.country
                  }
                  onPress={() => setShowCountryUserPicker(true)}
                  error={formikProps.errors.country}
                /> */}

                {/* <Touchable
                  style={styles.language}
                  onPress={() => setShowCountryUserPicker(true)}>
                  <View style={styles.countryInput}>
                    <Text variant='inputLabel'>Country</Text>
                    <View style={styles.countryWrap}>
                      <View style={styles.languageWrap}>
                        {formikProps.values.language?.map((item, index) => {
                          return (
                            <FastImage
                              key={uuid()}
                              style={styles.countryFlag}
                              source={{uri: languagesData[item].flag}}
                            />
                          )
                        })}
                      </View>
                      <MaterialCommunityIcons
                        name='menu-down'
                        size={getSize.f(24)}
                        color={theme.colors.text}
                      />
                    </View>
                  </View>
                </Touchable> */}

                <Input
                  placeholder="Permanent address"
                  label="Home address"
                  touched={formikProps.touched.address}
                  value={formikProps.values.address}
                  onPress={() => {
                    Keyboard.dismiss();
                    formikProps.setFieldTouched('address', true, true);
                    navigation.navigate('PickLocation', {
                      location: {
                        short_address: formikProps?.values?.short_address,
                        address: formikProps?.values?.address,
                        lat: formikProps?.values?.lat,
                        lng: formikProps?.values?.lng,
                      },
                      onSelect: async (data) => {
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
                />
                <Input
                  placeholder="Facebook ID or Name"
                  label="SNS links"
                  value={formikProps.values.social?.facebook}
                  onChangeText={(text) =>
                    formikProps.setFieldValue('social.facebook', text, true)
                  }
                  leftIcon={
                    <View style={[styles.snsIcon, styles.facebook]}>
                      <MaterialCommunityIcons
                        name="facebook"
                        color={theme.colors.textContrast}
                        size={getSize.f(16)}
                      />
                    </View>
                  }
                />
                <Input
                  placeholder="Twitter ID or Name"
                  value={formikProps.values.social?.twitter}
                  onChangeText={(text) =>
                    formikProps.setFieldValue('social.twitter', text, true)
                  }
                  leftIcon={
                    <View style={[styles.snsIcon, styles.twitter]}>
                      <MaterialCommunityIcons
                        name="twitter"
                        color={theme.colors.textContrast}
                        size={getSize.f(16)}
                      />
                    </View>
                  }
                />
                <Input
                  placeholder="LinkedIn ID or Name"
                  value={formikProps.values.social?.linkedin}
                  onChangeText={(text) =>
                    formikProps.setFieldValue('social.linkedin', text, true)
                  }
                  leftIcon={
                    <View style={[styles.snsIcon, styles.linkedin]}>
                      <MaterialCommunityIcons
                        name="linkedin"
                        color={theme.colors.textContrast}
                        size={getSize.f(16)}
                      />
                    </View>
                  }
                />
                <Input
                  placeholder="Instagram ID or Name"
                  value={formikProps.values.social?.instagram}
                  onChangeText={(text) =>
                    formikProps.setFieldValue('social.instagram', text, true)
                  }
                  leftIcon={
                    <View style={[styles.snsIcon, styles.instagram]}>
                      <MaterialCommunityIcons
                        name="instagram"
                        color={theme.colors.textContrast}
                        size={getSize.f(16)}
                      />
                    </View>
                  }
                />
              </Paper>
              <Paper style={styles.form2}>
                <View style={styles.flexRow}>
                  <Text style={styles.formHeaderText}>Specialties</Text>
                  <PaperIconButton
                    icon="plus-circle"
                    color={theme.colors.primary}
                    size={getSize.h(24)}
                    onPress={() =>
                      navigation.navigate('EditSpecialty', {isEdit: true})
                    }
                  />
                </View>
                <SpecialtyList
                  data={userInfo?.specialities?.data?.filter(
                    (item) => !item.suggest,
                  )}
                />
              </Paper>
            </ScrollView>
          </KeyboardAvoidingView>
          <DateTimePicker
            open={showDatePicker}
            onCancel={() => setShowDatePicker(false)}
            mode="date"
            onConfirm={(date) => {
              setShowDatePicker(false);
              formikProps.setFieldValue(
                'birth_date',
                moment(date).format('YYYY-MM-DD'),
              );
            }}
            maximumDate={dateMax}
            date={
              formikProps.values.birth_date
                ? moment(formikProps.values.birth_date, 'YYYY-MM-DD').toDate()
                : dateMax
            }
          />
          <LanguagePicker
            open={showCountryPicker}
            onClose={() => setShowCountryPicker(false)}
            value={country}
            onSelect={(value) => {
              setCountry(value);
              formikProps.setFieldValue('language', value, true);
              setShowCountryPicker(false);
            }}
          />
          <CountryPickerDataServer
            open={showCountryUserPicker}
            onClose={() => setShowCountryUserPicker(false)}
            value={formikProps.values.country}
            onSelect={(value) => {
              setShowCountryUserPicker(false);
              formikProps.setFieldValue('country', value, true);
            }}
          />
        </Wrapper>
      )}
    </Formik>
  );
};

export default EditProfileScreen;
