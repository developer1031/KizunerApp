import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  StatusBar,
  ScrollView,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {
  updateCategories,
  skipFillingSkill,
  addUserCategories,
  searchCategories,
  listSuggestedCategories,
} from 'actions';

import Wrapper from 'components/Wrapper';
import Text from 'components/Text';
import Button from 'components/Button';
import Tag from 'components/Tag';
import Paper from 'components/Paper';
import Input from 'components/Input';
import HeaderBg from 'components/HeaderBg';
import Touchable from 'components/Touchable';
import Loading from 'components/Loading';
import {getSize} from 'utils/responsive';
import useTheme from 'theme';
import i18n from 'i18n';
import debounce from 'utils/debounce';

const {width, height} = Dimensions.get('window');

const PickCategoryScreen = ({navigation, route}) => {
  const dispatch = useDispatch();
  const {onSelect, initials, suggests = []} = route.params;
  const {suggested, loadingSuggested, searchResults, searching} = useSelector(
    (state) => state.specialty,
  );
  const userInfo = useSelector((state) => state.auth.userInfo);
  const updating = useSelector((state) => state.auth.beingUpdateGeneral);
  const theme = useTheme();
  const [selected, setSelected] = useState(initials);
  const [newCategories, setnewCategories] = useState([]);
  const [skillValue, setSkillValue] = useState('');
  const [skillError, setSkillError] = useState(null);
  const insets = useSafeAreaInsets();

  const isEdit = true;

  useEffect(() => {
    dispatch(listSuggestedCategories());
  }, []);

  const handleSubmit = () => {
    if (newCategories.length > 0) {
      dispatch(
        addUserCategories(
          {categories: newCategories},
          {
            success: (result) => {
              const userSpes = result?.data?.categories?.data;
              const specs = [
                ...selected,
                ...userSpes.filter((item) =>
                  newCategories.find(
                    (i) => i.toLowerCase() === item.name.toLowerCase(),
                  ),
                ),
              ];

              // onSelect(specs);
              // navigation.goBack();
              // return;

              const skillsToUpdate = [
                ...new Set([...selected, ...userSpes].map((i) => i.id)),
              ];
              dispatch(
                updateCategories(
                  {categories: skillsToUpdate},
                  {
                    success: () => {
                      onSelect(specs);
                      navigation.goBack();
                    },
                  },
                ),
              );
            },
          },
        ),
      );
    } else {
      const skillsToUpdate = [
        ...new Set(
          [...selected, ...userInfo?.categories?.data].map((i) => i.id),
        ),
      ];

      // onSelect(selected);
      // navigation.goBack();
      // return;

      dispatch(
        updateCategories(
          {categories: skillsToUpdate},
          {
            success: () => {
              onSelect(selected);
              navigation.goBack();
            },
          },
        ),
      );
    }
  };

  const handleSkip = () => {
    dispatch(skipFillingSkill());
  };

  const submitOtherValue = () => {
    if (!skillValue || !skillValue.trim()) {
      setSkillError({message: 'specialty can not be empty'});
      return;
    }
    if (skillValue.trim().length > 19) {
      setSkillError({message: 'length must shorter than 20'});
      return;
    }
    if (
      selected.find(
        (i) => i.name.toLowerCase() === skillValue.trim().toLowerCase(),
      )
    ) {
      setSkillError({message: 'already existed'});
      return;
    }
    if (
      newCategories.find(
        (i) => i.toLowerCase() === skillValue.trim().toLowerCase(),
      )
    ) {
      setSkillError({message: 'already existed'});
      return;
    }
    if (
      suggests.find(
        (i) => i.name.toLowerCase() === skillValue.trim().toLowerCase(),
      )
    ) {
      setSelected([
        ...selected,
        suggests.find(
          (i) => i.name.toLowerCase() === skillValue.trim().toLowerCase(),
        ),
      ]);
      setSkillValue('');
      return;
    }
    setnewCategories([...newCategories, skillValue.trim()]);
    setSkillValue('');
  };

  const lang = {
    title: 'Select Categories',
    inputLabel: i18n.t('editCategories.inputLabel'),
    addYourcategories: i18n.t('editCategories.addYourSkills'),
    submit: 'Confirm',
    subTitle: i18n.t('editCategories.subTitle'),
    skipHint: i18n.t('editCategories.skipHint'),
    skip: i18n.t('editCategories.skip'),
    suggestedcategories: i18n.t('editCategories.suggestedSkills'),
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      width,
    },
    innerContainer: {
      position: 'absolute',
      alignItems: 'center',
      top: insets.top + getSize.h(isEdit ? 20 : 35),
      left: 0,
      right: 0,
      width,
    },
    backBtn: {
      position: 'absolute',
      top: insets.top + getSize.h(20),
      left: getSize.w(24),
      zIndex: 10,
    },
    formWrapper: {
      paddingVertical: getSize.h(40),
      paddingHorizontal: getSize.w(24),
      width: width - getSize.w(48),
    },
    button: {
      marginTop: getSize.h(20),
    },
    guideText: {
      color: theme.colors.textContrast,
      fontSize: getSize.f(15),
      marginHorizontal: getSize.w(40),
      letterSpacing: 0.04,
      marginBottom: getSize.h(22),
      textAlign: 'center',
    },
    tagSeparator: {
      marginLeft: getSize.w(10),
    },
    listWrap: {
      marginBottom: getSize.h(20),
    },
    listWrapper: {
      flexWrap: 'wrap',
      alignItems: 'flex-start',
      flexDirection: 'row',
      right: -getSize.w(5),
      left: -getSize.w(5),
    },
    tagWrapper: {
      marginBottom: getSize.h(15),
      marginHorizontal: getSize.w(5),
    },
    inputWrapper: {
      marginBottom: getSize.h(10),
    },
    skipText: {
      textAlign: 'center',
      fontSize: getSize.f(15),
      marginTop: getSize.h(27),
      color: theme.colors.grayDark,
    },
    suggestText: {
      marginTop: getSize.h(10),
      marginBottom: getSize.h(20),
    },
    skipBtn: {
      color: theme.colors.primary,
    },
    listScroll: {
      height:
        height - (getSize.h(isEdit ? 230 : 370) + insets.top + insets.bottom),
    },
    headerBtn: {
      fontSize: getSize.f(16),
      fontFamily: theme.fonts.sfPro.medium,
      color: theme.colors.textContrast,
    },
    loading: {
      marginLeft: getSize.w(20),
    },
  });

  const suggestedData =
    skillValue.length > 0
      ? searchResults?.length > 0
        ? searchResults
        : [{name: skillValue}]
      : [...new Set([...suggests, ...suggested])];

  return (
    <Wrapper>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <View style={styles.container}>
        <HeaderBg height={isEdit ? insets.top + 120 : 327} />
        {isEdit && (
          <Touchable onPress={navigation.goBack} style={styles.backBtn}>
            <Text style={styles.headerBtn}>Cancel</Text>
          </Touchable>
        )}
        <View style={styles.innerContainer}>
          <Text variant="header">{lang.title}</Text>
          {!isEdit && <Text style={styles.guideText}>{lang.subTitle}</Text>}
          <Paper style={styles.formWrapper}>
            <ScrollView
              style={styles.listScroll}
              showsVerticalScrollIndicator={false}>
              <Input
                label={lang.inputLabel}
                placeholder={lang.addYourcategories}
                value={skillValue}
                wrapperStyle={styles.inputWrapper}
                touched
                onChangeText={(text) => {
                  setSkillValue(text);
                  setSkillError(null);
                  if (text.length > 0) {
                    debounce(dispatch(searchCategories({query: text})), 500);
                  }
                }}
                error={skillError}
                autoCapitalize="none"
                onSubmitEditing={submitOtherValue}
                rightIconProps={{
                  icon: 'plus-circle',
                  color: theme.colors.primary,
                  onPress: submitOtherValue,
                }}
              />
              <View style={styles.listWrapper}>
                {newCategories.map((item, index) => (
                  <Tag
                    key={index}
                    value={item}
                    active
                    wrapperStyle={styles.tagWrapper}
                    onRemove={() =>
                      setnewCategories(newCategories.filter((i) => i !== item))
                    }
                  />
                ))}
                {selected.map((item) => (
                  <Tag
                    key={item.id}
                    value={item.name}
                    active
                    wrapperStyle={styles.tagWrapper}
                    onRemove={() =>
                      setSelected(selected.filter((i) => i.id !== item.id))
                    }
                  />
                ))}
              </View>
              <Text variant="inputLabel" style={styles.suggestText}>
                {lang.suggestedcategories}
              </Text>
              <View style={styles.listWrapper}>
                {loadingSuggested || searching ? (
                  <Loading style={styles.loading} dark />
                ) : (
                  suggestedData
                    .filter((item) => !selected.find((i) => item.id === i.id))
                    .map((item, index) => (
                      <Tag
                        key={item.id}
                        value={item.name}
                        wrapperStyle={styles.tagWrapper}
                        onPress={() => {
                          if (
                            skillValue.length > 0 &&
                            searchResults?.length === 0
                          ) {
                            submitOtherValue();
                          } else {
                            setSelected([...selected, item]);
                          }
                        }}
                        active={selected.find((i) => i === item)}
                      />
                    ))
                )}
              </View>
            </ScrollView>
            <Button
              containerStyle={styles.button}
              onPress={handleSubmit}
              title={lang.submit}
              fullWidth
              loading={updating}
            />
          </Paper>
          {!isEdit && (
            <Text style={styles.skipText}>
              {lang.skipHint}{' '}
              <Text
                onPress={handleSkip}
                style={[styles.skipText, styles.skipBtn]}>
                {lang.skip}
              </Text>
            </Text>
          )}
        </View>
      </View>
    </Wrapper>
  );
};

export default PickCategoryScreen;
