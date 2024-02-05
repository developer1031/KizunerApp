import React from 'react';
import FormikInput from 'components/FormikInput';

const App = ({formikProps}) => {
  return (
    <>
      <FormikInput
        name="clabe"
        {...formikProps}
        inputProps={{
          label: 'CLABE',
          returnKeyType: 'next',
          placeholder: '',
          // 123456789012345678 (18 characters)
        }}
      />
    </>
  );
};

export default App;
