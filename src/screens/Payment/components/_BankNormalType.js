import React from 'react';
import FormikInput from 'components/FormikInput';

export const BANK_TYPE_CODES = ['CL', 'CO'];

const App = ({formikProps}) => {
  return (
    <>
      <FormikInput
        name="bank_code"
        {...formikProps}
        inputProps={{
          label: 'Bank Code',
          returnKeyType: 'next',
          placeholder: '',
        }}
      />
      <FormikInput
        name="account_number"
        {...formikProps}
        inputProps={{
          label: 'Account Number',
          returnKeyType: 'next',
          placeholder: '',
        }}
      />
      <FormikInput
        name="account_type"
        {...formikProps}
        inputProps={{
          label: 'Bank account type',
          returnKeyType: 'next',
          placeholder: '',
        }}
      />
    </>
  );
};

export default App;

/*
Chile(CL) checking
Colombia(CO) savings
*/
