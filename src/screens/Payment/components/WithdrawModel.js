import {Dimensions, Modal, StyleSheet, View} from 'react-native';
import React, {forwardRef, useImperativeHandle, useState} from 'react';
import {getSize} from 'utils/responsive';
import {Text, Touchable, Button} from 'components';
import {useSelector, useDispatch} from 'react-redux';
import {payoutStripe} from 'actions';
import {num_delimiter} from 'utils/util';

const WithdrawModel = forwardRef(({externalAccountId, countryCode}, ref) => {
  const dispatch = useDispatch();

  const [visible, setVisible] = useState(false);
  const walletState = useSelector((state) => state.wallet);
  const {stripeStatusResponse} = walletState;
  const {amount, currency} = stripeStatusResponse;

  const unit = currency == 'jpy' ? '￥' : '$';
  const unitFee = currency === 'jpy' ? 3 * 100 : 3;

  const show = () => setVisible(true);
  const close = () => setVisible(false);
  const onPayout = () => {
    if (externalAccountId) {
      dispatch(
        payoutStripe(
          {
            amount: amount - 3,
            externalAccountId,
            currency: countryCode === 'JP' ? 'jpy' : 'usd',
          },
          {
            success: (result) => {
              console.log(result);
              setVisible(false);
            },
            failure: (err) => {
              console.log(err);
              setVisible(false);
            },
          },
        ),
      );
    }
  };

  useImperativeHandle(
    ref,
    () => ({
      show,
    }),
    [],
  );

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.background}>
        <View style={styles.container}>
          <Text variant="headerBlack">Confirmation</Text>

          <Text style={{marginVertical: getSize.w(12)}}>
            Do you want to withdraw in bank account?
          </Text>

          <Text variant="bold" style={{alignSelf: 'flex-end'}}>
            Total funds: {unit}
            {num_delimiter(amount)}
          </Text>
          <Text style={{alignSelf: 'flex-end'}}>
            Kizuner fee: {unit}
            {unitFee}
          </Text>
          <Text variant="bold" style={{alignSelf: 'flex-end', color: 'green'}}>
            Your actual funds: {unit}
            {num_delimiter(amount - unitFee)}
          </Text>

          <View style={styles.btnContainer}>
            <View style={{flex: 1, marginRight: getSize.w(12)}}>
              <Button
                title="Cancel"
                variant="ghost"
                fullWidth
                onPress={close}
              />
            </View>

            <View style={{flex: 1}}>
              <Button title="Confirm" onPress={onPayout} />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  background: {
    width: '100%',
    height: '100%',
    backgroundColor: '#00000077',
    justifyContent: 'center',
    alignItems: 'center',
    padding: getSize.w(24),
  },
  container: {
    position: 'absolute',
    width: '100%',
    backgroundColor: 'white',
    borderRadius: getSize.w(20),
    padding: getSize.w(24),
  },
  btnContainer: {
    marginTop: getSize.w(24),
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});

export default WithdrawModel;
