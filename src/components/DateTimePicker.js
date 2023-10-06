import React from 'react';
import {} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const DateTimePicker = ({open, ...props}) => {
  return <DateTimePickerModal isVisible={open} {...props} />;
};

export default DateTimePicker;
