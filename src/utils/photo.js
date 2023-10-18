import {Alert, Platform} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {PermissionsAndroid} from 'react-native';

const OPTIONS = {
  height: 1000,
  width: 1000,
  cropping: true,
  // freeStyleCropEnabled: true,
  mediaType: 'photo',
};

const handleResponse = (response, callback) => {
  console.log(response);
  if (response.didCancel) {
    console.log('User cancelled image picker');
  } else if (response.error) {
    Alert.alert('Error:', response.error);
  } else if (response.customButton) {
    console.log('User tapped custom button:', response.customButton);
  } else {
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
  return false;
};

export const selectPhoto = (callback, option) => {
  ImagePicker.openPicker({...OPTIONS, ...option})
    .then((response) => handleResponse(response, callback))
    .catch((err) => console.log(err));
};

export const takePhoto = (callback, option) => {
  ImagePicker.openCamera({...OPTIONS, ...option, mediaType: 'photo'})
    .then((response) => handleResponse(response, callback))
    .catch(async (err) => {
      console.log(err.message);
      if (err.message === 'User did not grant camera permission.') {
        requestPermissionAndroid().then((granted) => {
          if (granted) {
            takePhoto(callback);
          } else {
            Alert.alert(
              'No permission granted!',
              'Please accept camera permission in app setting.',
            );
          }
        });
      }
    });
};

export const takeVideo = (callback, option) => {
  ImagePicker.openPicker({...OPTIONS, ...option, mediaType: 'video'}).then(
    (response) => handleResponse(response, callback),
  );
};
