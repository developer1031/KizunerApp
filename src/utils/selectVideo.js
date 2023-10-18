import {Alert, Platform, PermissionsAndroid} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {isVideoType} from './fileTypes';
import {formatBytesToMB} from './util';
import ImagePicker from 'react-native-image-crop-picker';

const OPTIONS = {
  cropping: true,
  height: 1000,
  width: 1000,
  mediaType: 'video',
};

const limitFile = 50;

const handleResponsePhoto = (response, callback) => {
  if (response.didCancel) {
    console.log('User cancelled image picker');
  } else if (response.error) {
    Alert.alert('Error:', response.error);
  } else if (response.customButton) {
    console.log('User tapped custom button:', response.customButton);
  } else {
    console.log(response);
    if (!response) {
      console.log('No asset returned');
      return;
    }
    const data = {
      name: response.filename || 'kizuner-photo',
      uri:
        Platform.OS === 'android'
          ? response.path
          : response.path.replace('file://', ''),
      type: response.mime,
    };
    callback(data);
  }
};

const requestPermissionAndroid = async () => {
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.CAMERA,
  );
  if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    return true;
  }
};

const handleResponse = (response, callback, limitFileVideo) => {
  // else if (
  //   (response.type === 'video/mp4' &&
  //     formatBytesToMB(response.fileSize) > (limitFileVideo || limitFile)) ||
  //   (response?.path?.includes('mp4') &&
  //     formatBytesToMB(response.fileSize) > (limitFileVideo || limitFile))
  // ) {
  //   Alert.alert('Error:', `File so largger ${limitFileVideo}MB`);
  // }

  if (response.didCancel) {
    console.log('User cancelled image/video picker');
  } else if (response.error) {
    Alert.alert('Error:', response.error);
  } else if (response.customButton) {
    console.log('User tapped custom button:', response.customButton);
  } else {
    if (!response?.assets?.[0]) {
      console.log('No asset returned');
      return;
    }
    const data = {
      name: response.assets[0].fileName || 'kizuner-photo-video',
      uri:
        Platform.OS === 'android'
          ? response.assets[0].uri
          : response.assets[0].uri.replace('file://', ''),
      type: response.assets[0].type
        ? response.assets[0].type
        : isVideoType(response.assets[0].fileName)
        ? 'video/mp4'
        : response.assets[0].type,
      fileType: response.assets[0].type
        ? response.assets[0].type
        : isVideoType(response.assets[0].fileName)
        ? 'video/mp4'
        : response.assets[0].type,
      fileSize: response.assets[0].fileSize,
    };
    console.log(data);
    callback(data);
  }
};

const handleResponseTakeVideo = (response, callback, limitFileVideo) => {
  // else if (
  //   (response.type === 'video/mp4' &&
  //     formatBytesToMB(response.fileSize) > (limitFileVideo || limitFile)) ||
  //   (response?.path?.includes('mp4') &&
  //     formatBytesToMB(response.fileSize) > (limitFileVideo || limitFile))
  // ) {
  //   Alert.alert('Error:', `File so largger ${limitFileVideo}MB`);
  // }

  if (response.didCancel) {
    console.log('User cancelled image/video picker');
  } else if (response.error) {
    Alert.alert('Error:', response.error);
  } else if (response.customButton) {
    console.log('User tapped custom button:', response.customButton);
  } else {
    const data = {
      name: response.filename || 'kizuner-photo-video',
      uri:
        Platform.OS === 'android'
          ? response.path
          : response.path.replace('file://', ''),
      type: response.mime
        ? response.mime
        : isVideoType(response.filename)
        ? 'video/mp4'
        : response.type,
      fileType: response.mime
        ? response.mime
        : isVideoType(response.filename)
        ? 'video/mp4'
        : response.mime,
      fileSize: response.size,
    };
    callback(data);
  }
};

export const selectPhotoVideoOnlyPhoto = (
  callback,
  limitFileVideo,
  cropping = true,
) => {
  ImagePicker.openPicker({...OPTIONS, mediaType: 'photo', cropping}).then(
    (response) => handleResponsePhoto(response, callback, limitFileVideo),
  );
};

export const selectPhotoVideoOnlyVideo = (callback, limitFileVideo) => {
  launchImageLibrary({mediaType: 'video', noData: true}, (response) =>
    handleResponse(response, callback, limitFileVideo),
  );
};

export const takePhotoVideo = (callback) => {
  ImagePicker.openCamera({...OPTIONS, mediaType: 'photo'}).then((response) =>
    handleResponsePhoto(response, callback),
  );
};

export const takeVideo = (callback) => {
  ImagePicker.openCamera({
    ...OPTIONS,
    mediaType: 'video',
    cropping: false,
  }).then((response) => handleResponseTakeVideo(response, callback));
};
