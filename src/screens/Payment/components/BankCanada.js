import React from 'react';
import FormikInput from 'components/FormikInput';

const App = ({formikProps}) => {
  return (
    <>
      <FormikInput
        name="transit_number"
        {...formikProps}
        inputProps={{
          label: 'Transit number',
          type: 'number-pad',
          returnKeyType: 'next',
          placeholder: '',
        }}
      />
      <FormikInput
        name="institution_number"
        {...formikProps}
        inputProps={{
          label: 'Institution number',
          type: 'number-pad',
          returnKeyType: 'next',
          placeholder: '',
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
 */
