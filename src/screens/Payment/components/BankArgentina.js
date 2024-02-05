import React from 'react';
import FormikInput from 'components/FormikInput';

const App = ({formikProps}) => {
  return (
    <>
      <FormikInput
        name="cbu"
        {...formikProps}
        inputProps={{
          label: 'CBU',
          returnKeyType: 'next',
          placeholder: '',
          // 0110000600000000000000 (22 digits)
        }}
      />
    </>
  );
};

export default App;

/*
Argentina(AR)
*/
