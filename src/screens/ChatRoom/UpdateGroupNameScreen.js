import React from 'react';
import {View, StyleSheet, Dimensions, StatusBar, Keyboard} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import * as yup from 'yup';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Formik} from 'formik';

import {updateChatRoomName, showAlert} from 'actions';

import Wrapper from 'components/Wrapper';
import Text from 'components/Text';
import Button from 'components/Button';
import Touchable from 'components/Touchable';
import Paper from 'components/Paper';
import FormikInput from 'components/FormikInput';
import HeaderBg from 'components/HeaderBg';
import {getSize} from 'utils/responsive';
import useTheme from 'theme';

const {width} = Dimensions.get('window');

const UpdateGroupNameScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const {roomDetail, beingUpdateName} = useSelector((state) => state.chat);
  const insets = useSafeAreaInsets();

  const lang = {
    title: 'Update Name',
    send: 'Update',
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      width,
    },
    innerContainer: {
      position: 'absolute',
      alignItems: 'center',
      top: insets.top + getSize.h(26),
      left: 0,
      right: 0,
      width,
    },
    countryFlag: {
      width: getSize.w(28),
      height: getSize.h(20),
      borderRadius: getSize.h(2),
      resizeMode: 'contain',
      marginRight: getSize.w(5),
    },
    backBtn: {
      position: 'absolute',
      top: insets.top + getSize.h(20),
      left: getSize.w(24),
      zIndex: 1,
    },
    formWrapper: {
      paddingVertical: getSize.h(40),
      paddingHorizontal: getSize.w(24),
      width: width - getSize.w(48),
    },
    button: {
      marginTop: getSize.h(20),
    },
    disabled: {
      opacity: 0.3,
    },
  });

  return (
    <Formik
      validationSchema={yup.object().shape({
        name: yup.string().max(18).min(3).trim().required(),
      })}
      initialValues={{
        name: roomDetail?.name?.trim() || '',
      }}
      onSubmit={(values) => {
        Keyboard.dismiss();
        dispatch(
          updateChatRoomName(
            {roomId: roomDetail.id, name: values.name},
            {
              success: () => {
                navigation.goBack();
                setTimeout(
                  () =>
                    dispatch(
                      showAlert({
                        title: 'Success',
                        body: 'Updated group name!',
                        type: 'success',
                      }),
                    ),
                  200,
                );
              },
            },
          ),
        );
      }}>
      {(formikProps) => (
        <Wrapper dismissKeyboard>
          <StatusBar
            translucent
            backgroundColor="transparent"
            barStyle="light-content"
          />
          <View style={styles.container}>
            <HeaderBg height={insets.top + 120} />
            <Touchable onPress={navigation.goBack} style={styles.backBtn}>
              <MaterialCommunityIcons
                name="chevron-left"
                size={getSize.f(34)}
                color={theme.colors.textContrast}
              />
            </Touchable>
            <View style={styles.innerContainer}>
              <Text variant="header">{lang.title}</Text>
              <Paper style={styles.formWrapper}>
                <FormikInput
                  name="name"
                  {...formikProps}
                  inputProps={{
                    label: 'Name',
                    placeholder: 'enter group name',
                  }}
                />
                <Button
                  containerStyle={styles.button}
                  onPress={formikProps.handleSubmit}
                  title={lang.send}
                  loading={beingUpdateName}
                  fullWidth
                  disabled={!formikProps.dirty}
                />
              </Paper>
            </View>
          </View>
        </Wrapper>
      )}
    </Formik>
  );
};

export default UpdateGroupNameScreen;
