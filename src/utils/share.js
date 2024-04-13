import Share from 'react-native-share';
// import {ShareDialog} from 'react-native-fbsdk-next';
import RNFetchBlob from 'rn-fetch-blob';
import {PermissionsAndroid, ToastAndroid, Alert, Platform} from 'react-native';
import dynamicLinks from '@react-native-firebase/dynamic-links';

var fs = require('react-native-fs');

import fetchApi from 'utils/fetchApi';
import {
  SHARE_URL,
  API_URL,
  GoogleStoreUrl,
  AppleStoreUrl,
  BundleID,
  AppStoreID,
  PageLink,
  GCPStorageLink,
} from 'utils/constants';

const generateShortLink = async (link) => {
  try {
    const result = await fetchApi({
      endpoint: '/shortlink',
      method: 'POST',
      data: {link},
    });
    if (result?.data?.code) {
      return `${API_URL}/share/${result.data.code}`;
    }
    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const shareMultipleMediaFile = async (
  title,
  message,
  urls,
  data,
  callback = () => {},
) => {
  let urlImage = null;
  const mediaData = data?.media?.data;
  if (mediaData) {
    if (mediaData.length > 0) {
      urlImage = mediaData[0].path || mediaData[0].thumb;
    }
  }

  const shareLinks =
    'https://kizuner.com/?type=' + data?.type + '&id=' + data?.id;

  const dynamicLinkParameters = {
    link: shareLinks,
    domainUriPrefix: PageLink,
    android: {
      packageName: BundleID,
      fallbackUrl: GoogleStoreUrl,
    },
    ios: {
      bundleId: BundleID,
      appStoreId: AppStoreID,
      fallbackUrl: AppleStoreUrl,
    },
    social: {
      imageUrl: urlImage,
      title: data.type != 'status' ? data?.title : title,
      descriptionText: data.type != 'status' ? data?.description : '',
    },
  };

  try {
    // let url = await dynamicLinks().buildLink(dynamicLinkParameters);
    const url = await dynamicLinks().buildShortLink(
      dynamicLinkParameters,
      'SHORT',
    );

    const dl = url.replace(PageLink + '/', '');

    const hackyLinking = `${SHARE_URL}/k?dl=${dl}&t=${encodeURIComponent(
      data?.title,
    )}&d=${encodeURIComponent(data?.description)}&i=${encodeURIComponent(
      urlImage?.replace(GCPStorageLink, ''),
    )}&k=${encodeURIComponent(data.type)}&id=${encodeURIComponent(data?.id)}`;

    console.log(hackyLinking);
    // const shortLink = await generateShortLink(hackyLinking);
    const shortLink = hackyLinking;

    await Share.open(
      Platform.select({
        android: {
          title: title || 'Kizuner',
          message: message || '',
          failOnCancel: false,
          url: shortLink || 'https://kizuner.com',
        },
        ios: {
          activityItemSources: [
            {
              placeholderItem: {
                type: 'text',
                content: `${message} ${shortLink}`,
              },
              item: {
                copyToPasteBoard: {
                  type: 'text',
                  content: `${message} ${shortLink}`,
                },
                default: {
                  type: 'text',
                  content: `${message} ${shortLink}`,
                },
              },
              subject: {
                copyToPasteBoard: `${message} ${shortLink}`,
                default: title,
              },
              linkMetadata: {originalUrl: shortLink, shortLink, title},
            },
          ],
        },
      }),
    );

    callback();
  } catch (e) {
    console.log(e);
  }
};

export const shareDownloadImage = async (title, message, data, urlImage) => {
  if (Platform.OS === 'android') {
    ToastAndroid.show('Progress will started soon', ToastAndroid.SHORT);
    const checkVersion = Platform.Version > 22;
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'Access Require',
        message: 'Press Allow Permission to start progress',
      },
    );
    if (granted !== PermissionsAndroid.RESULTS.GRANTED && checkVersion) {
      Alert.alert('Cancel, permission denied');
      return;
    }

    let Pictures = [urlImage].map((item) =>
      RNFetchBlob.config({
        fileCache: true,
      })
        .fetch('GET', item)
        .then((resp) => {
          let base64s = RNFetchBlob.fs
            .readFile(resp.data, 'base64')
            .then((dataImage) => 'data:image/png;base64,' + dataImage);
          return base64s;
        }),
    );

    Promise.all(Pictures).then((completed) => {
      const shareOptions = {
        // title: title || 'Kizuner',
        // message: message || '',
        failOnCancel: false,
        urls: completed,
      };
      Share.open(shareOptions);
    });
  } else {
    let Pictures = [urlImage].map((item) =>
      RNFetchBlob.config({
        fileCache: true,
      })
        .fetch('GET', item)
        .then((resp) => {
          let base64s = RNFetchBlob.fs
            .readFile(resp.data, 'base64')
            .then((dataImage) => 'data:image/png;base64,' + dataImage);
          return base64s;
        }),
    );
    Promise.all(Pictures).then((completed) => {
      const shareOptions = {
        // title: title || 'Kizuner',
        // message: message || '',
        failOnCancel: false,
        urls: completed,
      };
      Share.open(shareOptions);
    });
  }

  if (data?.type === 'status') {
    await fetchApi({
      method: 'POST',
      endpoint: '/statuses/react',
      data: {status_id: data?.id, react_type: 'share'},
    });
  }
  if (data?.type === 'hangout') {
    await fetchApi({
      method: 'POST',
      endpoint: '/hangouts/react',
      data: {hangout_id: data?.id, react_type: 'share'},
    });
  }
  if (data?.type === 'help') {
    await fetchApi({
      method: 'POST',
      endpoint: '/helps/react',
      data: {help_id: data?.id, react_type: 'share'},
    });
  }
};

export const shareTitleWithUrl = async (title, url, callback) => {
  const shareOptions = {
    title: title || 'Kizuner',
    url,
    social: Share.Social.FACEBOOK,
  };

  try {
    const shareResponse = await Share.shareSingle(shareOptions);
    //callback(shareResponse);
    return shareResponse;
  } catch (error) {
    console.log(error);
    return;
  }
};

export const shareFacebook = async (url, description) => {
  const shareLinkContent = {
    contentType: 'link',
    contentUrl: url ?? 'https://kizuner.com',
    contentDescription:
      description ??
      `${`Do what you like, where you want, with the people you like. There are many people around the world waiting for you and you'll find the people you need. (Website: https://kizuner.com and Mobile: ${SHARE_URL})`}`,
  };
  try {
    // const shareResponse = await ShareDialog.canShow(shareLinkContent).then(
    //   () => {
    //     ShareDialog.show(shareLinkContent);
    //   },
    // );
    // return shareResponse;
  } catch (error) {
    return;
  }
};

export const downloadFileWithURL = (file_url) => {
  let imagePath = null;
  RNFetchBlob.config({
    fileCache: true,
  })
    .fetch('GET', file_url)
    .then((resp) => {
      imagePath = resp.path();
      return resp.readFile('base64');
    })
    .then(async (base64) => {
      let base64Data = 'data:image/png;base64,' + base64;
      fs.unlink(imagePath);
      return base64Data;
    });
};
