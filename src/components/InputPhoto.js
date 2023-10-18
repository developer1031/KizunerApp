import React, {useRef, useState} from 'react';
import {View, StyleSheet, Image, Platform} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useDispatch, useSelector} from 'react-redux';
import {ProgressBar} from 'react-native-paper';

import {Touchable, Text} from 'components';
import useTheme from 'theme';
import {getSize} from 'utils/responsive';
import {showModalize, hideModalize, uploadSingleImage} from 'actions';
import {takePhoto, selectPhoto} from 'utils/photo';
import {
  takePhotoVideo,
  selectPhotoVideoOnlyPhoto,
  selectPhotoVideoOnlyVideo,
  takeVideo,
} from 'utils/selectVideo';
import {isVideoType} from 'utils/fileTypes';
import orangeLight from '../theme/orangeLight';
import {images} from './Video/images';
import VideoViewer from './VideoViewer';
import NavigationService from 'navigation/service';

const InputPhoto = ({
  isSelectVideo,
  label,
  labelStyle,
  onDelete,
  onChange,
  value,
  limitVideo,
  disabled,
  resizeMode = 'cover',
  cropping = true,
}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [selected, setSelected] = useState(value);
  const [showVideoView, setShowVideoView] = useState(false);
  const uploading = useSelector((state) => state.feed.beingUploadSingle);
  const [fileType, setFileType] = useState(
    isVideoType(selected?.path) ? 'video/mp4' : '',
  );

  const recorderVideoRef = useRef(null);

  const handleResult = (payload) => {
    setSelected(payload);
    setFileType(payload.fileType);
    const formData = new FormData();
    formData.append('file', payload);
    formData.append('type', 'user.hangout');
    dispatch(hideModalize());
    dispatch(
      uploadSingleImage(formData, {
        success: (result) => {
          setSelected(result.data);
          onChange && onChange(result.data);
        },
      }),
    );
  };

  const handleResultVideo = (payload) => {
    payload.fileType = 'video/mp4';
    payload.type = 'video/mp4';
    setSelected(payload);
    setFileType(payload.fileType);
    const formData = new FormData();
    formData.append('file', payload);
    formData.append('type', 'user.hangout');
    dispatch(hideModalize());
    dispatch(
      uploadSingleImage(formData, {
        success: (result) => {
          setSelected(result.data);
          onChange && onChange(result.data);
        },
        failure: (err) => console.log(err),
      }),
    );
  };

  const handleDelete = () => {
    setSelected(null);
    onDelete && onDelete();
  };

  const selectListData = isSelectVideo
    ? [
        {
          label: 'Take photo',
          icon: (
            <MaterialCommunityIcons
              size={getSize.f(20)}
              color={theme.colors.primary}
              name="camera"
            />
          ),
          onPress: () => takePhotoVideo(handleResult),
        },
        {
          label: 'Take video',
          icon: (
            <MaterialCommunityIcons
              size={getSize.f(20)}
              color={theme.colors.primary}
              name="camera"
            />
          ),
          onPress: () => takeVideo(handleResultVideo),
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
            dispatch(hideModalize());
            onSelectImageOrVideo();
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
      ]
    : [
        {
          label: 'Take photo',
          icon: (
            <MaterialCommunityIcons
              size={getSize.f(20)}
              color={theme.colors.primary}
              name="camera"
            />
          ),
          onPress: () => takePhoto(handleResult),
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
          onPress: () => selectPhoto(handleResult),
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

  const selectImageOrVideo = [
    {
      label: 'Select photo',
      icon: (
        <MaterialCommunityIcons
          size={getSize.f(20)}
          color={theme.colors.primary}
          name="camera"
        />
      ),
      onPress: () => selectPhotoVideoOnlyPhoto(handleResult, 1, cropping),
    },
    {
      label: 'Select video',
      icon: (
        <MaterialCommunityIcons
          size={getSize.f(20)}
          color={theme.colors.primary}
          name="camera"
        />
      ),
      onPress: () => selectPhotoVideoOnlyVideo(handleResultVideo, limitVideo),
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
      onPress: () => {
        dispatch(hideModalize());
        onSelect();
      },
    },
  ];

  const onSelect = () => {
    if (selected && selected.thumb) {
      //setShowVideoView(true);
      NavigationService.push('VideoScreen', {
        selected: selected,
      });
    } else {
      dispatch(showModalize(selectListData));
    }
  };

  const onSelectImageOrVideo = () => dispatch(showModalize(selectImageOrVideo));

  const onStartVideoRecorder = () => {
    recorderVideoRef.current.open({maxLength: limitVideo || 25}, (data) => {
      const req = {
        name: 'kizuner-video-record',
        uri:
          Platform.OS === 'android'
            ? data.uri
            : data.uri.replace('file://', ''),
        fileType: 'video/mp4',
        type: 'video/mp4',
      };
      handleResultVideo(req);
    });
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Text variant="inputLabel" style={labelStyle}>
          {label}
        </Text>
        {selected && (
          <Touchable onPress={handleDelete} style={styles.deleteBtn}>
            <Text style={styles.deleteTxt}>Delete</Text>
            <MaterialCommunityIcons
              name="delete"
              size={getSize.f(20)}
              color={theme.colors.primary}
            />
          </Touchable>
        )}
      </View>
      <Touchable
        onPress={onSelect}
        disabled={disabled || (fileType !== 'video/mp4' && !!selected)}>
        {selected ? (
          <View style={styles.imageWrap}>
            {fileType == 'video/mp4' ? (
              <>
                <View
                  hitSlop={{
                    top: getSize.h(6),
                    left: getSize.h(6),
                    bottom: getSize.h(6),
                    right: getSize.h(6),
                  }}
                  style={styles.absolute}>
                  {!uploading && (
                    <Image
                      style={[{width: getSize.w(22), height: getSize.w(22)}]}
                      resizeMode={resizeMode}
                      source={images.video.player.playBtn}
                    />
                  )}
                </View>
                <Image
                  source={{
                    uri:
                      selected && selected.thumb
                        ? selected?.thumb
                        : selected?.uri || selected?.path,
                  }}
                  resizeMode={resizeMode}
                  style={styles.image}
                />
              </>
            ) : (
              <Image
                source={{uri: selected?.uri || selected?.path}}
                resizeMode={resizeMode}
                style={styles.image}
              />
            )}
            {uploading && (
              <>
                <View style={[styles.image, styles.uploadingOverlay]} />
                <ProgressBar
                  indeterminate
                  color={theme.colors.textContrast}
                  style={styles.progressBar}
                />
              </>
            )}
          </View>
        ) : (
          <View style={styles.body}>
            <MaterialIcons
              name="add-a-photo"
              size={getSize.f(22)}
              color={theme.colors.text2}
            />
          </View>
        )}
      </Touchable>
      <VideoViewer
        open={showVideoView}
        onClose={() => setShowVideoView(false)}
        selected={selected}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
  },
  deleteTxt: {
    color: orangeLight.colors.primary,
    marginRight: getSize.w(5),
  },
  body: {
    height: getSize.h(156),
    borderRadius: getSize.h(10),
    borderWidth: getSize.h(2),
    borderColor: orangeLight.colors.divider,
    borderStyle: 'dashed',
    marginTop: getSize.h(15),
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageWrap: {
    height: getSize.h(156),
    borderRadius: getSize.h(10),
    marginTop: getSize.h(15),
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: getSize.h(10),
    backgroundColor: orangeLight.colors.background,
  },
  progressBar: {
    width: getSize.w(120),
  },
  uploadingOverlay: {
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  absolute: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    position: 'absolute',
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default InputPhoto;
