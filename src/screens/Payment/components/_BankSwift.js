import React from 'react';
import FormikInput from 'components/FormikInput';

const App = ({formikProps}) => {
  return (
    <>
      <FormikInput
        name="swift_code"
        {...formikProps}
        inputProps={{
          label: 'Swift Code',
          returnKeyType: 'next',
          placeholder: '',
          // AAAAALTXXXX (8-11 characters)
        }}
      />
      <FormikInput
        name="iban"
        {...formikProps}
        inputProps={{
          label: 'IBAN',
          returnKeyType: 'next',
          placeholder: '',
          // AL35202111090000000001234567 (28 characters)
        }}
      />
    </>
  );
};

export default App;

/*
Albania(AL)
Algeria(DZ) // account number
Angola(AO)
Antigua and Barbuda(AG) // account number
Armenia(AM) // account number
Bahamas(BS) // account number
Bahrein(BH)
Bhutan(BT) // account number
Bosnia and Herzegovina(BA)
Botswana(BW) // account number
Brunei(BN) // account number
Cambo
Ecuador(EC) // account number
Egypt(EG)
El Salvador(SV)
Ethiopia(ET) // account number
Gabon(GA) // account number
Gambia(GM) // account number
Guatemala(GT)
Guyana(GY) // account number
Jordan(JO)
Kazahkstan(KZ)
Kenya(KE) // account number
Kuwait(KW)
Lao People's Democratic Republic(LA) // account number
Macao(MO) // account number
Madagascar(MG)
Mauritius(MU)
Moldova(MD) // account number
Mongolia(MN) // account number
Morocco(MA) // account number
Mozambique(MZ) // account number
Namibia(NA) // account number
Nigeria(NG) // account number
North Macedonia(MK) // account number
Oman(OM) // account number
Pakistan(PK)
Panama(PA) // account number
Philippines(PH) // account number
Qatar(QA) // account number
Rwanda(RW) // account number
Saint Lucia(LC) // account number
Saudi Arabia(SA)
San Morino(SM)
Serbia(RS) // account number
South Africa(ZA) // account number
South Korea(KR) // account number
Taiwan(TW) // account number
Tanzaia(TZ) // account number
Turkey(TR)
*/
