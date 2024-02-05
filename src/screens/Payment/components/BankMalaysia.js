import React from 'react';
import FormikInput from 'components/FormikInput';

const App = ({formikProps}) => {
  return (
    <>
      <FormikInput
        name="bank_name"
        {...formikProps}
        inputProps={{
          label: 'Bank name',
          returnKeyType: 'next',
          placeholder: '',
          // HSBC Bank Malaysia Berhad
        }}
      />
      <FormikInput
        name="swift_code"
        {...formikProps}
        inputProps={{
          label: 'Swift Code',
          returnKeyType: 'next',
          placeholder: '',
          // HBMBMYKL (8-11 characters)
        }}
      />
      <FormikInput
        name="account_number"
        {...formikProps}
        inputProps={{
          label: 'Account number',
          returnKeyType: 'next',
          placeholder: '',
          // 1234567890 (5-17 digits, format varies by bank)
        }}
      />
    </>
  );
};

export default App;
