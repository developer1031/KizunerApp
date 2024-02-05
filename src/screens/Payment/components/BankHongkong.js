import React from 'react';
import FormikInput from 'components/FormikInput';

const App = ({formikProps}) => {
  return (
    <>
      <FormikInput
        name="clearing_code"
        {...formikProps}
        inputProps={{
          label: 'Clearing Code',
          returnKeyType: 'next',
          placeholder: '',
          // 123 (3 characters)
        }}
      />
      <FormikInput
        name="branch_code"
        {...formikProps}
        inputProps={{
          label: 'Branch Code',
          returnKeyType: 'next',
          placeholder: '',
          // 456 (3 characters)
        }}
      />
      <FormikInput
        name="account_number"
        {...formikProps}
        inputProps={{
          label: 'Account Number',
          returnKeyType: 'next',
          placeholder: '',
          // 123456-789 (6-9 characters)
        }}
      />
    </>
  );
};

export default App;
