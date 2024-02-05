import React from 'react';
import FormikInput from 'components/FormikInput';

const App = ({formikProps}) => {
  return (
    <>
      <FormikInput
        name="sort_code"
        {...formikProps}
        inputProps={{
          label: 'Bank sort code',
          returnKeyType: 'next',
          placeholder: '',
          // 022112 (6 digits)
        }}
      />
      <FormikInput
        name="iban"
        {...formikProps}
        inputProps={{
          label: 'IBAN',
          returnKeyType: 'next',
          placeholder: '',
          // 000123456789 (8-20 digits)
        }}
      />
    </>
  );
};

export default App;
