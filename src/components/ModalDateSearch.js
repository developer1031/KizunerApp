import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import {Text} from 'react-native';
import Button from './Button';
import Modal from 'react-native-modal';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const ModalDateSearch = forwardRef(({onSubmit, value}, ref) => {
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState(0); // 0: specific, 1: range
  const [date, setDate] = useState(value?.date ?? new Date());
  const [fromDate, setFromDate] = useState(value?.fromeDate ?? null);
  const [endDate, setEndDate] = useState(value?.endDate ?? null);
  const [selected, setSelected] = useState(null);

  const open = useCallback(() => setVisible(true), []);
  useImperativeHandle(
    ref,
    () => ({
      open,
    }),
    [open],
  );

  const onPressCancel = useCallback(() => {
    setVisible(false);
  }, []);

  const onConfirm = useCallback(() => {
    if (mode === 0) {
      if (date) {
        setVisible(false);
        setTimeout(() => {
          onSubmit({date});
        }, 100);
      }
    } else {
      if (fromDate && endDate) {
        setVisible(false);
        setTimeout(() => {
          onSubmit({fromDate, endDate});
        }, 100);
      }
    }
  }, [mode, date, fromDate, endDate]);

  const onDateConfirm = useCallback(
    (selectedDate) => {
      if (selected === 1) {
        setDate(selectedDate);
      } else if (selected === 2) {
        setFromDate(selectedDate);
      } else if (selected === 3) {
        setEndDate(selectedDate);
      }
      setSelected(null);
    },
    [selected],
  );

  const dateString = (value) => {
    if (!value) return '';
    return `${value.getFullYear()}/${value.getMonth() + 1}/${value.getDate()}`;
  };

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
        <View style={styles.divider} />
        <Text onPress={() => setMode(0)} style={styles.description}>
          Search on specific day
        </Text>
        <View style={styles.divider} />
        <Text onPress={() => setMode(1)} style={styles.description}>
          Search in range
        </Text>
        <View style={styles.divider} />

        <View style={styles.dateGroup}>
          {mode === 0 ? (
            <TouchableOpacity
              style={styles.viewDate}
              onPress={() => setSelected(1)}>
              <Text style={styles.txtDate}>{dateString(date)}</Text>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity
                style={styles.viewDate}
                onPress={() => setSelected(2)}>
                <Text style={styles.txtDate}>{dateString(fromDate)}</Text>
              </TouchableOpacity>
              <Text>〜</Text>
              <TouchableOpacity
                style={styles.viewDate}
                onPress={() => setSelected(3)}>
                <Text style={styles.txtDate}>{dateString(endDate)}</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <View style={styles.btnGroup}>
          <Button title="OK" onPress={onConfirm} />
        </View>
      </View>

      <DateTimePickerModal
        isVisible={selected !== null}
        mode={'date'}
        display={'spinner'}
        onConfirm={onDateConfirm}
        onCancel={() => setSelected(null)}
      />
    </Modal>
  );
});

const styles = StyleSheet.create({
  content: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 15,
  },
  divider: {
    height: 1,
    backgroundColor: 'lightgray',
    marginHorizontal: 12,
  },
  description: {
    textAlign: 'center',
    paddingVertical: 16,
    fontSize: 15,
  },
  btnGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
    justifyContent: 'center',
  },
  dateGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  viewDate: {
    width: 120,
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    marginHorizontal: 16,
    marginVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txtDate: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default ModalDateSearch;
