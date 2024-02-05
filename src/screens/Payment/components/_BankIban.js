import React from 'react';
import FormikInput from 'components/FormikInput';

const App = ({formikProps}) => {
  return (
    <>
      <FormikInput
        name="iban"
        {...formikProps}
        inputProps={{
          label: 'IBAN',
          returnKeyType: 'next',
          placeholder: '',
        }}
      />
    </>
  );
};

export default App;

/*
Belgium(BE) BE12345678912345
Bulgaria(BG) BG80BNBG96611020345678 (22 characters)
Costa Rica(CR) CR05123456789012345678 (22 characters)
Cote d'Ivoire(CI) CI93CI0080111301134291200589 (28 characters)
Crotia(HR) HR1210010051863000160 (21 characters)
Cyprus(CY) CY17002001280000001200527600 (28 characters)
Czech Republic(CZ) CZ6508000000192000145399 (24 characters)
Denmark(DK) DK5000400440116243 (18 characters)
Estonia(EE) EE382200221020145685 (20 characters)
Finland(FI) FI2112345600000785 (18 characters)
France(FR) FR1420041010050500013M02606 (27 characters)
Germany(DE) DE89370400440532013000 (22 characters)
Gibraltar(GI) GI75NWBK000000007099453 (23 characters)
Greece(GR) GR1601101250000000012300695 (27 characters)
Hungary(HU) HU42117730161111101800000000 (28 characters)
IceLand(IS) IS140159260076545510730339 (26 characters)
Ireland(IE) IE29AIBK93115212345678 (22 characters)
Israel(IL) IL620108000000099999999 (23 characters)
Italy(IT) IT60X0542811101000000123456 (27 characters)
Latvia(LV) LV80BANK0000435195001 (21 characters)
Liechtenstein(LI) LI21088100002324013AA (21 characters)
Litunia(LT) LT121000011101001000 (20 characters)
Luxeumborg(LU) LU280019400644750000 (20 characters)
Malta(MT) MT84MALT011000012345MTLCAST001S (31 characters)
Monaco(MC) MC5811222000010123456789030 (27 characters)
Netherlands(NL) NL91ABNA0417164300 (18 characters)
Niger(NE) NE58NE0380100100130305000268 (28 characters)
Norway(NO) NO9386011117947 (15 characters)
Poland(PL) PL61109010140000071219812874 (28 characters)
Portugal(PT) PT50000201231234567890154 (25 characters)
Romania(RO) RO49AAAA1B31007593840000 (24 characters)
Senegal(SN) SN12K00100152000025690007542 (28 characters)
Slovakia(SK) SK3112000000198742637541 (24 characters)
Sloveina(SI) SI56191000000123438 (19 characters)
Spain(ES) ES9121000418450200051332 (24 characters)
Sweden(SE) SE3550000000054910000003 (24 characters)
Switzerland(CH) CH9300762011623852957 (21 characters)
Tunisia(TN) TN5910006035183598478831 (24 characters)
United Arab Emirates(AE) AE070331234567890123456 (23 characters)

*/
