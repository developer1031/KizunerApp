import {StyleSheet, Text, View} from 'react-native'
import React from 'react'
import SelectDropdown from 'react-native-select-dropdown'
import {useSelector} from 'react-redux'
import CreditCardIcon from './CreditCardIcon'
import {getSize} from '../utils/responsive'
import AntDesign from 'react-native-vector-icons/AntDesign'

const InputChooseCardPayment = ({onChange = id => {}, visible = true}) => {
  const {cards} = useSelector(state => state.wallet)

  return (
    <View style={{display: visible ? 'flex' : 'none'}}>
      <SelectDropdown
        data={cards}
        buttonStyle={{
          width: '100%',
          backgroundColor: 'transparent',
          borderWidth: 0.2,
          borderRadius: 10,
          marginBottom: 10,
        }}
        renderCustomizedButtonChild={(card, i) => {
          if (!card) {
            return <Text style={{marginLeft: 10}}>Choose credit card</Text>
          }
          return (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <CreditCardIcon name={card.brand} size={getSize.f(40)} />
              <Text style={{marginLeft: 10}}>
                {card.name} *** {card['4digit']}
              </Text>
            </View>
          )
        }}
        renderCustomizedRowChild={(card, i) => {
          return (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingLeft: 15,
              }}>
              <CreditCardIcon name={card.brand} size={getSize.f(40)} />
              <Text style={{marginLeft: 10}}>
                {card.name} *** {card['4digit']}
              </Text>
            </View>
          )
        }}
        renderDropdownIcon={() => {
          return <AntDesign name='down' color={'black'} size={getSize.f(15)} />
        }}
        onSelect={(selectedItem, index) => {
          onChange(selectedItem.id)
        }}
        buttonTextAfterSelection={(selectedItem, index) => {
          // text represented after item is selected
          // if data array is an array of objects then return selectedItem.property to render after item is selected
          return selectedItem
        }}
        rowTextForSelection={(item, index) => {
          // text represented for each item in dropdown
          // if data array is an array of objects then return item.property to represent item in dropdown
          return item
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({})

export default InputChooseCardPayment
