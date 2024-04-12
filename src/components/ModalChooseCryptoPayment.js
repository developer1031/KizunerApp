import {StyleSheet, View} from 'react-native';
import React, {forwardRef, useImperativeHandle, useState} from 'react';
import InputChooseCardPayment from './InputChooseCardPayment';
import Button from './Button';
import InputChooseCryptoCurrencyPayment from './InputChooseCryptoCurrencyPayment';
import InputChooseCryptoAddressPayment from './InputChooseCryptoAddressPayment';
import Text from './Text';
import Modal from 'react-native-modal';

const ModalChooseCryptoPayment = forwardRef(
  (
    {
      onConfirm = () => {},
      onCancel = () => {},
      chooseCurrency = true,
      chooseAddress = true,
      currencyLabel = null,
      addressLabel = '',
    },
    ref,
  ) => {
    const [visible, setVisible] = useState(false);
    const [currency, setCurrency] = useState(currencyLabel ?? '');
    const [crypto, setCrypto] = useState(null);
    const [errorCurrencyString, setErrorCurrencyString] = useState('');
    const [errorAddressString, setErrorAddressString] = useState('');

    const open = () => setVisible((prev) => (prev = true));

    const onPressCancel = () => {
      setVisible(false);

      setCurrency('');
      setCrypto(null);

      setErrorAddressString('');
      setErrorCurrencyString('');
      onCancel();
    };
    const onPressConfirm = () => {
      if (chooseCurrency) {
        if (!currency.length && !currencyLabel) {
          setErrorCurrencyString('please choose currency');
          return;
        } else {
          setErrorCurrencyString('');
        }
      }

      if (chooseAddress) {
        setErrorAddressString(
          (prev) => (prev = !crypto ? 'please choose andress' : ''),
        );
        if (!crypto) {
          return;
        }
      }

      setVisible((prev) => (prev = false));
      onConfirm({currency: currencyLabel ?? currency, crypto});
    };

    useImperativeHandle(
      ref,
      () => ({
        open,
      }),
      [open],
    );

    return (
      <Modal
        animationInTiming={10}
        animationOutTiming={10}
        backdropTransitionInTiming={10}
        backdropTransitionOutTiming={10}
        animationIn={'fadeIn'}
        animationOut={'fadeOut'}
        isVisible={visible}
        hasBackdrop
        onBackdropPress={() => setVisible(false)}>
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 20,
            padding: 15,
          }}>
          {chooseCurrency && (
            <>
              <InputChooseCryptoCurrencyPayment
                onChange={(currency) => {
                  setCurrency((prev) => (prev = currency));
                }}
                defaultCurrency={currencyLabel}
                disabled={currencyLabel ? true : false}
              />
              <Text variant="inputLabel">{'   '}• Choose coin for payment</Text>
              <Text variant="errorHelper" style={{marginBottom: 10}}>
                {errorCurrencyString}
              </Text>
            </>
          )}

          {chooseAddress && (
            <>
              <InputChooseCryptoAddressPayment
                onChange={(data) => {
                  setCrypto((prev) => (prev = data));
                }}
              />
              <Text variant="inputLabel">
                {'   '}• Choose address to receive payment.
              </Text>
              <Text variant="errorHelper" style={{marginBottom: 10}}>
                {errorAddressString}
              </Text>
            </>
          )}

          <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
            <Button
              title="Cancel"
              onPress={onPressCancel}
              titleStyle={{color: 'black'}}
              variant="ghost"
              style={{marginRight: 15}}
            />

            <Button title={'Confirm'} onPress={onPressConfirm} />
          </View>
        </View>
      </Modal>
    );
  },
);

const styles = StyleSheet.create({});

export default ModalChooseCryptoPayment;
