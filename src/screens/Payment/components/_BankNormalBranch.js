import React from 'react';
import FormikInput from 'components/FormikInput';

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
          // 123456 (6 digits)
        }}
      />
      <FormikInput
        name="branch_code"
        {...formikProps}
        inputProps={{
          label: 'Branch Code',
          returnKeyType: 'next',
          placeholder: '',
          // 123456 (6 digits)
        }}
      />
      <FormikInput
        name="account_number"
        {...formikProps}
        inputProps={{
          label: 'Account number',
          returnKeyType: 'next',
          placeholder: '',
        }}
      />
    </>
  );
};

export default App;

/*
Brazil(BR)
Dominican Republic(DO)
Jamaica(JM)
Singapore(SG)
Sri Lanka(LK)
Trinidad and Tobago(TT)
Uzbekistan(UZ)
*/
