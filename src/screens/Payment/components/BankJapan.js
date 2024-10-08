import React from 'react';
import FormikInput from 'components/FormikInput';
import {View} from 'react-native';

const App = ({formikProps}) => {
  return (
    <>
      <View style={{flex: 1}}>
        <FormikInput
          name="bank_code"
          {...formikProps}
          inputProps={{
            label: 'Bank Code',
            returnKeyType: 'next',
            placeholder: '',
          }}
        />
      </View>

      <FormikInput
        name="branch_code"
        {...formikProps}
        inputProps={{
          label: 'Branch Code',
          returnKeyType: 'next',
          placeholder: '',
        }}
      />

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
