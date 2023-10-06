import {StyleSheet, Text, View} from 'react-native';
import React, {forwardRef, useImperativeHandle, useState} from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';

const DatePicker = forwardRef(({onChange = () => {}, maximumDate}, ref) => {
  const [visible, setVisible] = useState(false);

  const show = () => setVisible(true);
  const hide = () => setVisible(false);

  const onConfirm = (data) => {
    hide();

    const check = moment(data, 'DD/MM/YYYY');
    const month = check.format('M');
    const day = check.format('D');
    const year = check.format('YYYY');
    const date = `${day}/${month}/${year}`;

    onChange(date);
  };
  const onCancel = () => {
    hide();
  };

  useImperativeHandle(
    ref,
    () => ({
      show,
      hide,
    }),
    [],
  );

  return (
    <DateTimePickerModal
      isVisible={visible}
      mode="date"
      onConfirm={onConfirm}
      onCancel={onCancel}
      maximumDate={maximumDate}
    />
  );
});

export default DatePicker;

const styles = StyleSheet.create({});
