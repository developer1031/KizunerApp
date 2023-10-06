import {Dimensions, Modal, StyleSheet, View} from 'react-native';
import React, {forwardRef, useImperativeHandle, useState} from 'react';
import {getSize} from 'utils/responsive';
import {Text, Touchable, Button} from 'components';

const WithdrawModel = forwardRef(({}, ref) => {
  const [visible, setVisible] = useState(false);

  const show = () => setVisible(true);
  const close = () => setVisible(false);

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
            Total funds: ${500}
          </Text>
          <Text style={{alignSelf: 'flex-end'}}>Kizuner fee: ${3}</Text>
          <Text variant="bold" style={{alignSelf: 'flex-end', color: 'green'}}>
            Your actual funds: ${497}
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
              <Button title="Confirm" onPress={close} />
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
