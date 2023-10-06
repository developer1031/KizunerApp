import {StyleSheet, Text, View} from 'react-native';
import React, {forwardRef, useImperativeHandle, useState} from 'react';
import {Modal} from 'react-native';
import InputChooseCardPayment from './InputChooseCardPayment';
import Button from './Button';

const ModalChooseCardPayment = forwardRef(
  ({onConfirm = () => {}, onCancel = () => {}}, ref) => {
    const [visible, setVisible] = useState(false);
    const [cardId, setCardId] = useState('');
    const [errorString, setErrorString] = useState('');

    const open = () => setVisible((prev) => (prev = true));
    const getCardId = () => cardId;

    const onPressCancel = () => {
      setVisible((prev) => (prev = false));
      setErrorString((prev) => (prev = ''));
      onCancel();
    };
    const onPressConfirm = () => {
      if (!cardId.length) {
        setErrorString((prev) => (prev = 'Please choose card before confirm!'));

        return;
      }
      setVisible((prev) => (prev = false));
      onConfirm(cardId);
    };

    useImperativeHandle(
      ref,
      () => ({
        open,
        getCardId,
      }),
      [open, getCardId],
    );

    return (
      <Modal transparent animationType="fade" visible={visible}>
        <View
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#0009',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: '90%',
              backgroundColor: 'white',
              borderRadius: 20,
              padding: 15,
            }}>
            <InputChooseCardPayment
              onChange={(id) => setCardId((prev) => (prev = id))}
            />

            <Text style={{color: 'red', marginBottom: 15}}>{errorString}</Text>

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
        </View>
      </Modal>
    );
  },
);

const styles = StyleSheet.create({});

export default ModalChooseCardPayment;
