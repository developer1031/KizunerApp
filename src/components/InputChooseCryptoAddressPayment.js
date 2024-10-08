import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import SelectDropdown from 'react-native-select-dropdown';
import {useSelector} from 'react-redux';
import CreditCardIcon from './CreditCardIcon';
import {getSize} from '../utils/responsive';
import AntDesign from 'react-native-vector-icons/AntDesign';
import NavigationService from 'navigation/service';

const InputChooseCryptoAddressPayment = ({
  onChange = () => {},
  visible = true,
}) => {
  const {cryptoCards} = useSelector((state) => state.wallet);
  const emptyState = [
    "You haven't set up your crypto address yet. Click here to set up.",
  ];

  return (
    <View style={{display: visible ? 'flex' : 'none'}}>
      <SelectDropdown
        data={cryptoCards.length > 0 ? cryptoCards : emptyState}
        buttonStyle={{
          width: '100%',
          backgroundColor: 'transparent',
          borderWidth: 0.2,
          borderRadius: 10,
          marginBottom: 10,
        }}
        renderCustomizedButtonChild={(crypto, i) => {
          if (!crypto || !cryptoCards.length) {
            return <Text style={{marginLeft: 10}}>Choose crypto address</Text>;
          }
          return (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              {/* <CreditCardIcon name={crypto.brand} size={getSize.f(40)} /> */}
              <Text style={{marginHorizontal: 10}}>{crypto.currency}</Text>
              <Text numberOfLines={1}>{crypto.wallet_address}</Text>
            </View>
          );
        }}
        renderCustomizedRowChild={(crypto, i) => {
          return (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingLeft: 15,
              }}>
              {cryptoCards.length > 0 ? (
                <>
                  {/* <CreditCardIcon name={crypto.brand} size={getSize.f(40)} /> */}
                  <Text style={{marginHorizontal: 10}}>{crypto.currency}</Text>
                  <Text numberOfLines={1}>{crypto.wallet_address}</Text>
                </>
              ) : (
                <Text style={{color: '#FF6667'}}>{crypto}</Text>
              )}
            </View>
          );
        }}
        renderDropdownIcon={() => {
          return <AntDesign name="down" color={'black'} size={getSize.f(15)} />;
        }}
        onSelect={(selectedItem, index) => {
          if (cryptoCards.length === 0) {
            NavigationService.navigate('PaymentCryptoCardManagement');
          } else {
            onChange(selectedItem);
          }
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

export default InputChooseCryptoAddressPayment;
