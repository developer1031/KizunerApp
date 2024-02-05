import React from 'react';
import FormikInput from 'components/FormikInput';

const App = ({formikProps}) => {
  return (
    <>
      <FormikInput
        name="ifsc_code"
        {...formikProps}
        inputProps={{
          label: 'IFSC Code',
          returnKeyType: 'next',
          placeholder: '',
          // HDFC0004051 (11 characters)
        }}
      />
      <FormikInput
        name="account_number"
        {...formikProps}
        inputProps={{
          label: 'Account number',
          returnKeyType: 'next',
          placeholder: '',
          // Format varies by bank
        }}
      />
    </>
  );
};

export default App;
