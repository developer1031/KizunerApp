import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {getNowPaymentsCurrencies} from 'actions';
import SelectDropdown from 'react-native-select-dropdown';
import CreditCardIcon from './CreditCardIcon';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {getSize} from 'utils/responsive';
import useTheme from 'theme';

const InputChooseCryptoCurrencyPayment = ({
  onChange = () => {},
  visible = true,
  defaultCurrency,
  disabled = false,
}) => {
  const theme = useTheme();

  const {paymentNowCurrencies} = useSelector((state) => state.wallet);

  const defaultValueByIndex = defaultCurrency
    ? paymentNowCurrencies.map((item) => item.name).indexOf(defaultCurrency)
    : undefined;

  return (
    <View style={{display: visible ? 'flex' : 'none'}}>
      <SelectDropdown
        data={paymentNowCurrencies}
        defaultValueByIndex={defaultValueByIndex}
        disabled={disabled}
        buttonStyle={{
          width: '100%',
          backgroundColor: 'transparent',
          borderWidth: 0.2,
          borderRadius: 10,
          marginBottom: 10,
        }}
        renderCustomizedButtonChild={(card, i) => {
          if (!card) {
            return <Text style={{marginLeft: 10}}>Choose crypto</Text>;
          }
          return (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              {/* <CreditCardIcon name={card.brand} size={getSize.f(40)} /> */}
              <Text style={{marginLeft: 10}}>{card.name}</Text>
            </View>
          );
        }}
        renderCustomizedRowChild={(card, i) => {
          return (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingLeft: 15,
              }}>
              {/* <CreditCardIcon name={card.brand} size={getSize.f(40)} /> */}
              <Text style={{marginLeft: 10, color: theme.colors.text}}>
                {card.name}
              </Text>
            </View>
          );
        }}
        renderDropdownIcon={() => {
          return <AntDesign name="down" color={'black'} size={getSize.f(15)} />;
        }}
        onSelect={(selectedItem, index) => {
          onChange(selectedItem.name);
        }}
        buttonTextAfterSelection={(selectedItem, index) => {
          // text represented after item is selected
          // if data array is an array of objects then return selectedItem.property to render after item is selected
          return selectedItem;
        }}
        rowTextForSelection={(item, index) => {
          // text represented for each item in dropdown
          // if data array is an array of objects then return item.property to represent item in dropdown
          return item;
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({});

export default InputChooseCryptoCurrencyPayment;
