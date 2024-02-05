import React from 'react';
import FormikInput from 'components/FormikInput';

const App = ({formikProps}) => {
  return (
    <>
      <FormikInput
        name="bsb"
        {...formikProps}
        inputProps={{
          label: 'BSB	',
          returnKeyType: 'next',
          placeholder: '',
          // 123456 (6 characters)
        }}
      />
      <FormikInput
        name="account_number"
        {...formikProps}
        inputProps={{
          label: 'Account number',
          type: 'number-pad',
          returnKeyType: 'next',
          placeholder: '0001234',
          // 12345678 (4-9 characters)
        }}
      />
    </>
  );
};

export default App;

/*
Australia(AU)
*/
