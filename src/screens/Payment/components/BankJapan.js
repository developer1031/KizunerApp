import React from 'react';
import FormikInput from 'components/FormikInput';
import {View} from 'react-native';

const App = ({formikProps}) => {
  console.log(formikProps, 'formikProps');
  return (
    <>
      <View style={{flex: 1}}>
        <FormikInput
          name="bank_name"
          {...formikProps}
          inputProps={{
            label: 'Bank Name',
            returnKeyType: 'next',
            placeholder: '',
          }}
        />
      </View>

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
