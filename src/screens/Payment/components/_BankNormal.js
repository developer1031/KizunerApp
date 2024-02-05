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
          // UOB Buana
        }}
      />
      <FormikInput
        name="bank_code"
        {...formikProps}
        inputProps={{
          label: 'Bank Code',
          returnKeyType: 'next',
          placeholder: '',
          // 110000000 (9 characters)
        }}
      />
      <FormikInput
        name="account_number"
        {...formikProps}
        inputProps={{
          label: 'Account Number',
          returnKeyType: 'next',
          placeholder: '',
          // 0000123456789 (13-17 digits)
        }}
      />
    </>
  );
};

export default App;

/*
Bangladesh(BD)
Bolivia(BO)
Indonesia (ID)
Paraquay(PY)
Thailand(TH)
Uruguay(UY)
Vietnam(VN)
*/
