import {StyleSheet, View} from 'react-native';
import React, {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {Image} from 'react-native';
import {TouchableOpacity} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {getSize} from 'utils/responsive';
import useTheme from 'theme';
import {useDispatch, useSelector} from 'react-redux';
import {showModalize, hideModalize} from 'actions';
import ImagePicker from 'react-native-image-crop-picker';
import {uploadStripeIdentity} from 'actions';
import {ProgressBar} from 'react-native-paper';

const ImageStripePicker = ({style, onChange = () => {}}) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const selectMediaType = [
    {
      label: 'Take photo',
      icon: (
        <MaterialCommunityIcons
          size={getSize.f(20)}
          color={theme.colors.primary}
          name="camera"
        />
      ),
      onPress: () => {
        ImagePicker.openCamera({
          mediaType: 'photo',
          forceJpg: true,
        }).then((res) => {
          dispatch(hideModalize());
          setIsLoading(true);

          const image = {
            name: res.path.substring(res.path.length - 15),
            type: res.mime,
            uri: res.path,
          };
          const formData = new FormData();
          formData.append('file', image);
          dispatch(
            uploadStripeIdentity(formData, {
              success: (result) => {
                onChange(result.id);
                setUrl(image.uri);
                setIsLoading(false);
              },
              failure: () => {
                setIsLoading(false);
              },
            }),
          );
        });
      },
    },
    {
      label: 'Choose from library',
      icon: (
        <MaterialCommunityIcons
          size={getSize.f(20)}
          color={theme.colors.primary}
          name="image-plus"
        />
      ),
      onPress: () => {
        ImagePicker.openPicker({
          mediaType: 'photo',
          cropping: false,
          forceJpg: true,
        }).then((res) => {
          dispatch(hideModalize());
          setIsLoading(true);

          const image = {
            name: res.path.substring(res.path.length - 15),
            type: res.mime,
            uri: res.path,
          };
          const formData = new FormData();
          formData.append('file', image);
          dispatch(
            uploadStripeIdentity(formData, {
              success: (result) => {
                onChange(result.id);
                setUrl(image.uri);
                setIsLoading(false);
              },
              failure: () => {
                setIsLoading(false);
              },
            }),
          );
        });
      },
    },
    {
      label: 'Cancel',
      icon: (
        <MaterialCommunityIcons
          size={getSize.f(20)}
          color={theme.colors.primary}
          name="close-circle-outline"
        />
      ),
      onPress: () => dispatch(hideModalize()),
    },
  ];

  return (
    <TouchableOpacity onPress={() => dispatch(showModalize(selectMediaType))}>
      <View
        style={[
          {
            width: '100%',
            aspectRatio: 3 / 2,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
            borderWidth: 0.2,
            borderStyle: 'dashed',
            borderColor: '#555',
            overflow: 'hidden',
          },
          style,
        ]}>
        <Image
          source={{uri: url}}
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        />
        <MaterialCommunityIcons
          size={getSize.f(20)}
          color="grey"
          name="camera"
        />

        {isLoading && (
          <ProgressBar
            progress={0.5}
            indeterminate
            color={theme.colors.primary}
            style={{width: getSize.w(120), borderRadius: 5}}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default ImageStripePicker;

const styles = StyleSheet.create({});
