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
        name="iban"
        {...formikProps}
        inputProps={{
          label: 'IBAN',
          returnKeyType: 'next',
          placeholder: '',
          // AL35202111090000000001234567 (28 characters)
        }}
      />
    </>
  );
};

export default App;
