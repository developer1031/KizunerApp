import {StyleSheet, Text, View} from 'react-native';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import {CheckBoxTitle} from './CheckBoxTitle';
import InputChooseCardPayment from './InputChooseCardPayment';
import InputChooseCryptoCurrencyPayment from './InputChooseCryptoCurrencyPayment';
import {useDispatch} from 'react-redux';
import {getNowPaymentsMinAmount} from 'actions';

const InputChoosePaymentMethod = forwardRef(({onChange = () => {}}, ref) => {
  const dispatch = useDispatch();
  const [type, setType] = useState('credit'); // credit | crypto
  const [creditId, setCreditId] = useState('');
  const [cryptoId, setCryptoId] = useState('');
  const [minAmountCryptoUsd, setMinAmountCryptoUsd] = useState(0);
  const [minAmountCryptoCoin, setMinAmountCryptoCoin] = useState(0);

  const setPaymentMethod = (method) => setType(method);

  useImperativeHandle(
    ref,
    () => ({
      setPaymentMethod,
    }),
    [setPaymentMethod],
  );

  useEffect(() => {
    const isCredit = type === 'credit';

    if (isCredit) {
      onChange(type, creditId);

      return;
    }

    onChange(type, cryptoId, minAmountCryptoUsd, minAmountCryptoCoin);
  }, [type]);

  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <CheckBoxTitle
          callback={setType}
          status={'credit'}
          choose={type}
          title="Credit"
        />
        <CheckBoxTitle
          callback={setType}
          status={'crypto'}
          choose={type}
          title="Crypto"
          isReverse={true}
        />
      </View>

      <InputChooseCardPayment
        onChange={(id) => {
          setCreditId((prev) => (prev = id));
          onChange('credit', id);
        }}
        visible={type === 'credit'}
      />

      <InputChooseCryptoCurrencyPayment
        onChange={(crypto) => {
          setCryptoId((prev) => (prev = crypto));
          dispatch(
            getNowPaymentsMinAmount(crypto, {
              success: (data) => {
                const {
                  absolute_min_amount_usd: min_amount_usd,
                  absolute_min_amount: min_amount_coin,
                } = data;
                setMinAmountCryptoUsd((prev) => (prev = min_amount_usd));
                setMinAmountCryptoCoin((prev) => (prev = min_amount_coin));
                onChange('crypto', crypto, min_amount_usd, min_amount_coin);
              },
            }),
          );
        }}
        visible={type === 'crypto'}
      />
    </View>
  );
});

export default InputChoosePaymentMethod;

const styles = StyleSheet.create({});
