import {StyleSheet, TextInput, View} from 'react-native';
import React, {memo, useEffect, useRef, useState} from 'react';

const InputOTPCustom = memo(({style, onChange = () => {}, length = 6}) => {
  const [otpArr, setOtpArr] = useState(Array(length).fill(''));
  const [indexFocused, setIndexFocused] = useState(0);

  const otp = otpArr.reduce((prev, curr) => prev + curr, '');

  const onFocus = (index) => () => setIndexFocused((prev) => (prev = index));

  useEffect(() => {
    if (otp.length < otpArr.length) {
      return;
    }

    onChange(otp);
  }, [otp]);

  return (
    <View style={[styles.container, style]}>
      {Array(length)
        .fill(0)
        .map((_, index) => (
          <BoxCustom
            key={index}
            isFocused={indexFocused === index}
            value={otpArr[index]}
            onFocus={onFocus(index)}
            onChange={(char) => {
              let tmpOTP = [...otpArr];
              tmpOTP[index] = char;
              setOtpArr((prev) => (prev = tmpOTP));
              setIndexFocused((prev) => (prev = (index + 1) % length));
            }}
          />
        ))}
    </View>
  );
});

const BoxCustom = memo(({isFocused, value, onFocus, onChange}) => {
  const ref = useRef(null);

  useEffect(() => {
    isFocused && ref.current?.focus();
  }, [isFocused]);

  return (
    <TextInput
      style={[styles.box, {borderColor: isFocused ? 'orange' : 'grey'}]}
      ref={ref}
      onFocus={onFocus}
      value={value}
      onChangeText={(val) => {
        const text = val.replace(value, '').slice(-1);
        onChange(text);
      }}
    />
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  box: {
    flex: 0.14,
    aspectRatio: 1,
    backgroundColor: 'white',
    textAlign: 'center',
    borderRadius: 10,
    borderWidth: 0.5,
    marginVertical: 16,
  },
});

export default InputOTPCustom;
