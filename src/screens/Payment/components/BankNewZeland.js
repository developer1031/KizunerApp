import React from 'react';
import FormikInput from 'components/FormikInput';

const App = ({formikProps}) => {
  return (
    <>
      <FormikInput
        name="account_number"
        {...formikProps}
        inputProps={{
          label: 'Account number',
          returnKeyType: 'next',
          placeholder: '',
          // AABBBB3456789YZZ (15-16 digits)
        }}
      />
    </>
  );
};

export default App;
