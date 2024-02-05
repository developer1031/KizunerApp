import React from 'react';
import FormikInput from 'components/FormikInput';

const App = ({formikProps}) => {
  return (
    <>
      <FormikInput
        name="cci"
        {...formikProps}
        inputProps={{
          label: 'CCI',
          returnKeyType: 'next',
          placeholder: '',
          // 99934500012345670024 (20 digits)
        }}
      />
    </>
  );
};

export default App;
