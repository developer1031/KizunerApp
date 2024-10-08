import React from 'react';
import FormikInput from 'components/FormikInput';

export const ACN_ONLY_COUNTRY = [
  //
];

const App = ({formikProps}) => {
  return (
    <>
      <FormikInput
        name="account_name"
        {...formikProps}
        inputProps={{
          label: 'Account Name',
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
    </>
  );
};

export default App;
