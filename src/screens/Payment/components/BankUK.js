import React from 'react';
import FormikInput from 'components/FormikInput';

const App = ({formikProps}) => {
  return (
    <>
      <FormikInput
        name="sort_code"
        {...formikProps}
        inputProps={{
          label: 'Sort Code',
          returnKeyType: 'next',
          placeholder: '',
          // 12-34-56
        }}
      />
      <FormikInput
        name="account_number"
        {...formikProps}
        inputProps={{
          label: 'Account number',
          returnKeyType: 'next',
          placeholder: '',
          // 01234567
        }}
      />
    </>
  );
};

export default App;
