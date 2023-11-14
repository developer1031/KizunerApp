import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  ScrollView,
  Dimensions,
  RefreshControl,
  Platform,
  PermissionsAndroid,
  Share,
  TouchableOpacity,
} from 'react-native';
// import 'react-native-gesture-handler';

import {getStatusBarHeight} from 'react-native-status-bar-height';
import {useSelector, useDispatch} from 'react-redux';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Contacts from 'react-native-contacts';
import Clipboard from '@react-native-clipboard/clipboard';

import {
  Wrapper,
  HeaderBg,
  Text,
  Touchable,
  SearchBar,
  Avatar,
  Button,
  EmptyState,
} from 'components';
import useTheme from 'theme';
import {getSize} from 'utils/responsive';
import {
  getFriendList,
  showAlert,
  showModalize,
  hideModalize,
  inviteContactList,
} from 'actions';
import debounce from 'utils/debounce';
import {shareFacebook} from 'utils/share';
import SendSMS from 'utils/nativeSendSMS';
import {SHARE_URL} from 'utils/constants';

const width = Dimensions.get('window').width;

const ShareAppWithFriendScreen = ({navigation, route}) => {
  const STATUS_BAR = getStatusBarHeight();
  const HEADER_HEIGHT = 68;
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();

  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(1);
  const [isRefresh, setIsRefresh] = useState(false);
  const [link, setLink] = useState(SHARE_URL);

  const [contacts, setContacts] = useState([]);

  function handleDone() {
    dispatch(showModalize(selectListData));
    return;
  }

  function handleLoadMore() {}

  const handleRefresh = () => {
    // loadContacts();
    if (Platform.OS === 'android') {
      loadContactsAndroid();
    } else {
      loadContacts();
    }
  };

  function handleSearch(value) {
    setSearch(value);
  }

  useEffect(() => {
    onDispatchPermissonContact();
  }, []);

  async function onDispatchPermissonContact() {
    if (Platform.OS === 'ios') {
      loadContacts();
    }
  }

  async function hasAndroidPermission() {
    const permission = PermissionsAndroid.PERMISSIONS.READ_CONTACTS;
    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      return true;
    }
    const status = await PermissionsAndroid.request(permission);
    return status === 'granted';
  }

  const loadContactsAndroid = async () => {
    if (await hasAndroidPermission()) {
      Contacts.getAll().then((req) => {
        const contactsData = req.filter(
          (item) => item?.phoneNumbers?.length > 0,
        );
        setContacts(contactsData);
      });
    }
    return;
  };

  useEffect(() => {
    if (Platform.OS === 'android') {
      hasAndroidPermission();
    }
  }, []);

  useEffect(() => {
    if (Platform.OS === 'android') {
      loadContactsAndroid();
    }
  }, [hasAndroidPermission]);

  function loadContacts() {
    Contacts.getAll()
      .then((req) => {
        const contactsData = req.filter(
          (item) => item?.phoneNumbers?.length > 0,
        );
        setContacts(contactsData);
      })
      .catch((e) => {
        console.log(e);
      });
    Contacts.checkPermission();
  }

  const selectListData = [
    {
      label: 'Share email',
      icon: (
        <MaterialCommunityIcons
          size={getSize.f(20)}
          color={theme.colors.primary}
          name="email"
        />
      ),
      onPress: () => shareEmail(),
    },
    {
      label: 'Share with your phone',
      icon: (
        <MaterialCommunityIcons
          size={getSize.f(20)}
          color={theme.colors.primary}
          name="account-box"
        />
      ),
      onPress: () => sharePhoneNumber(),
    },
  ];

  const shareEmail = () => {
    let emails = [];
    contacts.map((item) => {
      if (item?.emailAddresses?.length > 0) {
        item?.emailAddresses?.map((mail) => {
          if (mail?.email) {
            emails.push(mail?.email);
          }
        });
      }
    });
    dispatch(
      inviteContactList({
        contact_emails: emails,
        share_url: `Kizuner - Hangout with suitable cast and offer your talent to Kizuners all over the world. - (Website: https://kizuner.com and Mobile: ${SHARE_URL})`,
      }),
    );
  };

  const sharePhoneNumber = () => {
    const users = selected.map((id) => {
      return contacts.find((i) => i.recordID === id);
    });
    const recipients = [];
    users.map((item) => {
      item?.phoneNumbers?.map((child) => {
        recipients.push(child?.number);
      });
    });
    SendSMS.send(
      {
        body: `Kizuner - Hangout with suitable cast and offer your talent to Kizuners all over the world. - (Website: https://kizuner.com and Mobile: ${SHARE_URL}`,
        recipients: recipients,
        successTypes: ['sent', 'queued'],
        allowAndroidSendWithoutReadPermission: true,
      },
      () => {
        dispatch(hideModalize());
        //console.log('errors', error);
      },
    );
    //navigation.goBack();
  };

  const styles = StyleSheet.create({
    wrapper: {flex: 1},
    headerBg: {zIndex: 1},
    headerTitle: {
      top: STATUS_BAR + getSize.h(26),
      textAlign: 'center',
      left: 0,
      right: 0,
      position: 'absolute',
      justifyContent: 'center',
      zIndex: 1,
    },
    backBtn: {
      position: 'absolute',
      top: getStatusBarHeight() + getSize.h(20),
      left: getSize.w(24),
      zIndex: 10,
    },
    headerBtn: {
      fontSize: getSize.f(16),
      fontFamily: theme.fonts.sfPro.medium,
      color: theme.colors.textContrast,
    },
    scrollWrap: {
      flex: 1,
    },
    scrollCon: {
      paddingTop: getSize.h(10),
    },
    searchContainer: {
      position: 'absolute',
      paddingTop: STATUS_BAR + getSize.h(10),
      paddingBottom: getSize.h(10),
      paddingHorizontal: getSize.w(20),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 10,
    },
    searchWrap: {
      marginRight: getSize.w(10),
      flexGrow: 1,
    },
    headerWrap: {
      paddingTop: getSize.h(15),
      paddingBottom: getSize.h(20),
      marginTop: STATUS_BAR + getSize.h(HEADER_HEIGHT),
    },
    selectedWrap: {
      // paddingBottom: getSize.h(20),
    },
    selectedCon: {
      paddingHorizontal: getSize.w(20),
    },
    selectedItem: {
      alignItems: 'center',
      width: getSize.w(60),
      marginRight: getSize.w(6),
      marginBottom: getSize.h(20),
    },
    unselectBtn: {
      position: 'absolute',
      backgroundColor: theme.colors.offerStatus.rejected,
      width: getSize.h(20),
      height: getSize.h(20),
      borderRadius: getSize.h(20 / 2),
      justifyContent: 'center',
      alignItems: 'center',
      right: getSize.w(0),
      top: getSize.h(0),
    },
    selectedAvatar: {
      marginBottom: getSize.h(7),
    },
    peopleTitle: {
      marginHorizontal: getSize.w(20),
      textTransform: 'uppercase',
      color: theme.colors.primary,
      fontSize: getSize.f(15),
      fontFamily: theme.fonts.sfPro.medium,
    },
    titleShare: {
      textTransform: 'uppercase',
      color: theme.colors.primary,
      fontSize: getSize.f(15),
      fontFamily: theme.fonts.sfPro.medium,
    },
    friendItemWrap: {
      height: getSize.h(68),
      paddingHorizontal: getSize.w(20),
    },
    friendItemCon: {
      borderTopWidth: 1,
      borderTopColor: theme.colors.divider,
      height: getSize.h(68),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    friendItemMeta: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    checkIcon: {
      width: getSize.h(22),
      height: getSize.h(22),
      borderRadius: getSize.h(22 / 2),
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.primary,
    },
    checkIconActive: {
      borderWidth: 0,
      backgroundColor: theme.colors.primary,
    },
    friendItemName: {
      marginLeft: getSize.w(10),
      fontFamily: theme.fonts.sfPro.medium,
      fontSize: getSize.f(17),
      color: theme.colors.tagTxt,
      width: width - getSize.w(48 + 20 + 22 + 40),
    },
    bottomWrap: {
      paddingTop: getSize.h(20),
      paddingBottom: getSize.h(20) + insets.bottom,
      paddingHorizontal: getSize.w(20),
      backgroundColor: theme.colors.paper,
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      ...theme.shadow.large.ios,
      ...theme.shadow.large.android,
    },
    contextSendLink: {
      paddingHorizontal: getSize.w(20),
      paddingBottom: getSize.w(16),
    },
    contextContentShare: {
      height: getSize.h(60),
      marginTop: getSize.h(16),
      flexDirection: 'row',
      backgroundColor: theme.colors.divider,
      borderRadius: getSize.w(6),
      flex: 1,
    },
    btnCopy: {
      width: getSize.w(80),
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.primary,
      borderRadius: getSize.w(6),
      zIndex: 100000,
    },
    textCopy: {
      fontFamily: theme.fonts.sfPro.medium,
      fontSize: getSize.f(14),
      color: theme.colors.textContrast,
    },
    contextLink: {
      alignItems: 'center',
      flexDirection: 'row',
      paddingHorizontal: getSize.w(10),
      flexGrow: 1,
      flex: 1,
    },
    contextContentShareSocial: {
      height: getSize.h(60),
      marginTop: getSize.h(16),
      flexDirection: 'row',
      borderRadius: getSize.w(6),
    },
    btnFacebook: {
      height: getSize.h(54),
      width: getSize.h(54),
      borderRadius: getSize.h(26),
      backgroundColor: theme.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  const lang = {
    title: 'Kizuner Introduce',
    cancel: 'Cancel',
    people: 'People',
    done: 'Done',
    share: 'Share',
    linkTitle: 'Introduce link friend',
  };

  async function shareLinkApp() {
    try {
      const result = await Share.share({
        title: 'Kizuner',
        message: `${SHARE_URL}`,
        url: SHARE_URL,
      });
      return result;
    } catch (error) {
      console.log(error);
      return;
    }
  }

  function renderListHeader() {
    return (
      <View style={styles.headerWrap}>
        <View style={styles.contextSendLink}>
          <Text style={styles.titleShare}>{lang.linkTitle}</Text>
          <View style={styles.contextContentShare}>
            <View style={styles.contextLink}>
              <Text numberOfLines={1}>{link}</Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                Clipboard.setString(link);
                dispatch(
                  showAlert({
                    title: 'Success',
                    body: 'Copied to clipboard',
                    type: 'success',
                  }),
                );
                return;
              }}
              style={styles.btnCopy}>
              <Text style={styles.textCopy}>{'Copy'}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.contextSendLink}>
          <Text style={styles.titleShare}>{lang.share}</Text>
          <View style={styles.contextContentShareSocial}>
            {/* <Touchable
              hitSlop={{
                top: getSize.w(60),
                left: getSize.w(60),
                bottom: getSize.w(60),
                right: getSize.w(60),
              }}
              onPress={() => shareFacebook(SHARE_URL)}
              style={styles.btnFacebook}>
              <MaterialCommunityIcons
                name='facebook'
                color={theme.colors.textContrast}
                size={getSize.f(25)}
              />
            </Touchable> */}
            <Touchable
              onPress={() => shareLinkApp()}
              style={[styles.btnFacebook, {marginLeft: getSize.w(8)}]}>
              <MaterialCommunityIcons
                name="share"
                color={theme.colors.textContrast}
                size={getSize.f(25)}
              />
            </Touchable>
          </View>
        </View>
        {selected.length > 0 && (
          <ScrollView
            horizontal
            style={styles.selectedWrap}
            contentContainerStyle={styles.selectedCon}
            showsHorizontalScrollIndicator={false}>
            {selected.map((id) => {
              const user = contacts.find((i) => i.recordID === id);
              if (!user) {
                return null;
              }
              const name =
                user && user.displayName
                  ? user.displayName
                  : (user.givenName ? user.givenName + ' ' : '') +
                    (user.familyName ? user.familyName : '');
              return (
                <View style={styles.selectedItem} key={id}>
                  <Avatar
                    size="medium"
                    source={{uri: user.thumbnailPath}}
                    style={styles.selectedAvatar}
                    renderExtra={() => {
                      return (
                        <Touchable
                          style={styles.unselectBtn}
                          onPress={() =>
                            setSelected(selected.filter((i) => i !== id))
                          }>
                          <MaterialCommunityIcons
                            name="close"
                            color={theme.colors.textContrast}
                            size={getSize.f(16)}
                          />
                        </Touchable>
                      );
                    }}
                  />
                  <Text numberOfLines={1} color={theme.colors.tagTxt}>
                    {name}
                  </Text>
                </View>
              );
            })}
          </ScrollView>
        )}
        <Text style={styles.peopleTitle}>{lang.people}</Text>
      </View>
    );
  }

  function renderFriendItem({item}) {
    const isSelected = selected.find((i) => i === item.recordID);
    const name =
      item && item.displayName
        ? item.displayName
        : (item.givenName ? item.givenName + ' ' : '') +
          (item.familyName ? item.familyName : '');
    return (
      <Touchable
        onPress={() => {
          isSelected
            ? setSelected(selected.filter((i) => i !== item.recordID))
            : setSelected([...selected, item.recordID]);
        }}
        style={styles.friendItemWrap}>
        <View style={styles.friendItemCon}>
          <View style={styles.friendItemMeta}>
            <Avatar source={{uri: item.thumbnailPath}} size="header" />
            <Text numberOfLines={1} style={styles.friendItemName}>
              {name}
            </Text>
          </View>
          <View
            style={[styles.checkIcon, isSelected && styles.checkIconActive]}>
            {isSelected && (
              <MaterialCommunityIcons
                name="check"
                color={theme.colors.textContrast}
                size={getSize.f(16)}
              />
            )}
          </View>
        </View>
      </Touchable>
    );
  }

  return (
    <>
      <Wrapper style={styles.wrapper}>
        <HeaderBg
          height={HEADER_HEIGHT}
          style={styles.headerBg}
          addSBHeight
          noBorder
        />
        {showSearch ? (
          <View style={styles.searchContainer}>
            <SearchBar
              wrapperStyle={styles.searchWrap}
              placeholder="Search friend"
              value={search}
              onChangeText={handleSearch}
              autoFocus
              onClear={() => handleSearch('')}
            />
            <Touchable onPress={() => setShowSearch(false)}>
              <Text style={styles.headerBtn}>{lang.cancel}</Text>
            </Touchable>
          </View>
        ) : (
          <>
            <Touchable onPress={navigation.goBack} style={styles.backBtn}>
              <MaterialCommunityIcons
                name="chevron-left"
                size={getSize.f(34)}
                color={theme.colors.textContrast}
              />
            </Touchable>
            <Text variant="header" style={styles.headerTitle}>
              {lang.title}
            </Text>
          </>
        )}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: getSize.h(100)}}>
          {renderListHeader()}
          <FlatList
            style={styles.scrollWrap}
            contentContainerStyle={styles.scrollCon}
            data={contacts}
            keyExtractor={(item) => item.recordID}
            renderItem={renderFriendItem}
            showsVerticalScrollIndicator={false}
            onEndReached={handleLoadMore}
            ListEmptyComponent={() => <EmptyState />}
            refreshControl={
              <RefreshControl
                refreshing={isRefresh}
                colors={theme.colors.gradient}
                tintColor={theme.colors.primary}
                onRefresh={handleRefresh}
              />
            }
          />
        </ScrollView>
      </Wrapper>
      <View style={styles.bottomWrap}>
        <TouchableOpacity
          style={{
            height: getSize.h(48),
            paddingHorizontal: getSize.w(23),
            borderRadius: getSize.h(48 / 2),
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            backgroundColor: selected.length
              ? theme.colors.secondary
              : theme.colors.disabled,
          }}
          onPress={handleDone}
          fullWidth
          disabled={!selected.length}>
          <Text variant="button" style={{color: 'white'}}>
            {'Invite your friends'}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default ShareAppWithFriendScreen;
