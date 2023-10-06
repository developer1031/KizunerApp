import React from 'react';

import {Input} from 'components';

const FormikInput = ({
  name,
  values,
  handleChange,
  handleBlur,
  errors,
  touched,
  rightIconPropsCheckBox,
  callback,
  valueCheckBox,
  inputProps = {},
  onChange,
}) => (
  <Input
    rightIconPropsCheckBox={rightIconPropsCheckBox}
    callback={callback}
    value={values[name]}
    onChangeText={handleChange(name)}
    onBlur={handleBlur(name)}
    error={errors[name]}
    valueCheckBox={valueCheckBox}
    touched={touched[name]}
    onChange={onChange}
    {...inputProps}
  />
);

export default FormikInput;
