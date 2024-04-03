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
  // const [type, setType] = useState('credit'); // credit | crypto

  const [credit, setCredit] = useState('credit');
  const [crypto, setCrypto] = useState(null);

  const [creditId, setCreditId] = useState('');
  const [cryptoId, setCryptoId] = useState('');
  const [minAmountCryptoUsd, setMinAmountCryptoUsd] = useState(0);
  const [minAmountCryptoCoin, setMinAmountCryptoCoin] = useState(0);

  const setPaymentMethod = (method) => {
    if (method === 'credit') {
      setCredit(true);
      setCrypto(false);
    }
    if (method === 'crypto') {
      setCredit(false);
      setCrypto(true);
    }
    if (method === 'both') {
      setCredit(true);
      setCrypto(true);
    }
  };

  useImperativeHandle(
    ref,
    () => ({
      setPaymentMethod,
    }),
    [setPaymentMethod],
  );

  useEffect(() => {
    if (credit && crypto) {
      onChange(
        'both',
        cryptoId,
        minAmountCryptoUsd,
        minAmountCryptoCoin,
        creditId,
      );
      return;
    }

    if (credit) {
      onChange('credit', creditId);

      return;
    }

    if (crypto) {
      onChange('crypto', cryptoId, minAmountCryptoUsd, minAmountCryptoCoin);
      return;
    }

    onChange(null);
  }, [credit, crypto]);

  return (
    <View>
      <View style={styles.flex}>
        <CheckBoxTitle
          callback={setCredit}
          status={'credit'}
          choose={credit}
          title="Credit"
          isGroup={false}
        />
        <CheckBoxTitle
          callback={setCrypto}
          status={'crypto'}
          choose={crypto}
          title="Crypto"
          isGroup={false}
          // isReverse={true}
        />
      </View>

      <InputChooseCardPayment
        onChange={(id) => {
          setCreditId((prev) => (prev = id));
          onChange('credit', id);
        }}
        visible={credit}
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

                if (credit) {
                  onChange(
                    'both',
                    crypto,
                    min_amount_usd,
                    min_amount_coin,
                    creditId,
                  );
                } else {
                  onChange('crypto', crypto, min_amount_usd, min_amount_coin);
                }
              },
            }),
          );
        }}
        visible={crypto}
      />
    </View>
  );
});

export default InputChoosePaymentMethod;

const styles = StyleSheet.create({
  flex: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
