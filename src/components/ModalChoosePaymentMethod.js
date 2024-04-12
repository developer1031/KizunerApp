import {StyleSheet, View} from 'react-native';
import React, {forwardRef, useImperativeHandle, useState} from 'react';
import {Text} from 'react-native';
import Button from './Button';
import Modal from 'react-native-modal';

const ModalChoosePaymentMethod = forwardRef(
  ({onCredit = () => {}, onCrypto = () => {}, onCancel = () => {}}, ref) => {
    const [visible, setVisible] = useState(false);

    const open = () => setVisible((prev) => (prev = true));

    const onPressCrypto = () => {
      setVisible(false);
      setTimeout(() => {
        onCrypto();
      }, 100);
    };
    const onPressCredit = () => {
      setVisible(false);
      setTimeout(() => {
        onCredit();
      }, 100);
    };
    const onPressCancel = () => {
      setVisible(false);
      onCancel();
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
        transparent
        animationInTiming={10}
        animationOutTiming={10}
        backdropTransitionInTiming={10}
        backdropTransitionOutTiming={10}
        animationIn={'fadeIn'}
        animationOut={'fadeOut'}
        isVisible={visible}
        hasBackdrop
        onBackdropPress={onPressCancel}>
        <View style={styles.content}>
          <Text variant="inputLabel" style={styles.description}>
            Please choose Payment Method
          </Text>

          <View style={styles.btnGroup}>
            <Button title="Crypto" onPress={onPressCrypto} />

            <Button title={'Credit'} onPress={onPressCredit} />
          </View>
        </View>
      </Modal>
    );
  },
);

const styles = StyleSheet.create({
  content: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 15,
  },
  description: {
    textAlign: 'center',
    marginVertical: 16,
    fontSize: 15,
  },
  btnGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
    justifyContent: 'center',
  },
});

export default ModalChoosePaymentMethod;
