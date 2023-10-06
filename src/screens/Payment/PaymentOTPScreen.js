import {StyleSheet, View} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Text from 'components/Text';
import Touchable from 'components/Touchable';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {getSize} from 'utils/responsive';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import useTheme from 'theme';
import {useSafeArea} from 'react-native-safe-area-context';
import InputOTPCustom from 'components/InputOTPCustom';
import Wrapper from 'components/Wrapper';
import Paper from 'components/Paper';
import {ScrollView} from 'react-native';
import {Checkbox, Chip, Searchbar} from 'react-native-paper';
import {TouchableOpacity} from 'react-native';

const PaymentOTPScreen = ({navigation}) => {
  const theme = useTheme();
  const insets = useSafeArea();
  const HEADER_HEIGHT = 68 + insets.top;

  const onPressResend = () => {};
  const onPressChangeNumber = () => navigation.goBack();

  const styles = StyleSheet.create({
    btnBack: {
      position: 'absolute',
      top: getStatusBarHeight() + getSize.h(20),
      left: getSize.w(24),
      zIndex: 10,
    },
    headerTitle: {
      top: getStatusBarHeight() + getSize.h(26),
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
  });

  return (
    <View style={{flex: 1}}>
      <LinearGradient
        style={{height: HEADER_HEIGHT}}
        colors={theme.colors.gradient}
        start={{x: 0, y: 1}}
        end={{x: 1, y: 1}}>
        <Touchable onPress={navigation.goBack} style={styles.btnBack}>
          <MaterialCommunityIcons
            name="chevron-left"
            size={getSize.f(34)}
            color={theme.colors.textContrast}
          />
        </Touchable>

        <Text variant="header" style={styles.headerTitle}>
          Payment Connect
        </Text>
      </LinearGradient>

      <ScrollView
        style={{flex: 1}}
        contentContainerStyle={styles.mainContainer}>
        <Paper style={styles.formWrapper}>
          <Text variant="headerBlack" style={{marginBottom: getSize.f(24)}}>
            Verify your phone number
          </Text>
          <Text variant="caption">Verification code</Text>

          <InputOTPCustom />

          <TouchableOpacity onPress={onPressResend}>
            <Text
              variant="inputLabel"
              style={{
                color: theme.colors.offerStatus.completed,
                marginVertical: getSize.f(15),
              }}>
              Resend message
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onPressChangeNumber}>
            <Text
              variant="inputLabel"
              style={{
                color: theme.colors.offerStatus.cancelled,
              }}>
              ← Use different mobile number
            </Text>
          </TouchableOpacity>
        </Paper>
      </ScrollView>
    </View>
  );
};

export default PaymentOTPScreen;

const styles = StyleSheet.create({});
