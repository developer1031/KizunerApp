import React from 'react';
import FormikInput from 'components/FormikInput';

const App = ({formikProps}) => {
  return (
    <>
      <FormikInput
        name="bank_name"
        {...formikProps}
        inputProps={{
          label: 'Bank Name',
          returnKeyType: 'next',
          placeholder: '',
        }}
      />
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
        name="branch_name"
        {...formikProps}
        inputProps={{
          label: 'Branch Name',
          returnKeyType: 'next',
          placeholder: '',
        }}
      />
      <FormikInput
        name="branch_code"
        {...formikProps}
        inputProps={{
          label: 'Branch Code',
          returnKeyType: 'next',
          placeholder: '',
        }}
      />
    </>
  );
};

export default App;
