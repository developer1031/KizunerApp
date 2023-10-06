import {StyleSheet, View} from 'react-native';
import React, {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {TouchableOpacity} from 'react-native';
import ImageViewer from './ImageViewer';
import ImagePath from './ImagePath';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {getSize} from 'utils/responsive';
import useTheme from 'theme';
import {useDispatch, useSelector} from 'react-redux';
import {
  showModalize,
  hideModalize,
  uploadSingleImage,
  showAlert,
} from 'actions';
import ImagePicker from 'react-native-image-crop-picker';
import {Text} from 'components';
import orangeLight from '../../theme/orangeLight';
import {ProgressBar} from 'react-native-paper';
import {isVideoType} from 'utils/fileTypes';

const constants = {
  gap: 3,
};
/**
 * example: data = [
 *  {
 *    id: 'ajksdhaksjd'
 *    path: 'https:example/askjdhaskjdhas.png'
 *  },
 * ]
 */
const ImageMultiple = memo(
  forwardRef(
    (
      {
        initialData = [],
        onChange = () => {},
        resizeMode = 'cover',
        enableViewer = true,
        editable = false,
        style,
        label = '',
        type = 'default', // type for store in DB
        maxFilesImage = 10,
        maxFilesVideo = 3,
        durationLimitedVideo = 60000, // ms | null
      },
      ref,
    ) => {
      const theme = useTheme();
      const refImageViewer = useRef(null);
      const dispatch = useDispatch();
      const uploading = useSelector((state) => state.feed.beingUploadSingle);
      const [mediaData, setMediaData] = useState([]);
      const isFirstRender = useRef(true);

      const uploadSingleMedia = (data, callback = () => {}) => {
        const formData = new FormData();
        formData.append('file', data);
        formData.append('type', type);
        dispatch(
          uploadSingleImage(formData, {
            success: (result) => {
              const {id, path, thumb} = result.data;
              setMediaData(
                (prev) =>
                  (prev = [
                    ...prev,
                    {
                      id,
                      path,
                      thumb,
                    },
                  ]),
              );

              callback();
            },
          }),
        );
      };
      const uploadMultipleMedia = (imgList) => {
        const cImgList = [...imgList];
        if (!cImgList.length) {
          return;
        }

        uploadSingleMedia(cImgList[0], () => {
          cImgList.shift();
          uploadMultipleMedia(cImgList);
        });
      };

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
              const media = {
                name: res.path.substring(res.path.length - 15),
                type: res.mime,
                uri: res.path,
              };
              uploadSingleMedia(media);
            });
          },
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
          onPress: () => {
            ImagePicker.openCamera({
              mediaType: 'video',
            }).then((res) => {
              dispatch(hideModalize());
              const media = {
                name: res.path.substring(res.path.length - 15),
                type: res.mime,
                uri: res.path,
              };
              uploadSingleMedia(media);
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
              mediaType: 'any',
              cropping: false,
              multiple: true,
              maxFiles: maxFilesImage + maxFilesVideo,
              forceJpg: true,
            }).then((data) => {
              dispatch(hideModalize());

              const imageCounter = data.filter((media) =>
                media.mime.includes('image'),
              ).length;
              const videoCounter = data.length - imageCounter;

              const isOverMaxFiles =
                imageCounter > maxFilesImage || videoCounter > maxFilesVideo;

              if (isOverMaxFiles) {
                dispatch(
                  showAlert({
                    title: 'Error',
                    type: 'error',
                    body: `Maximum are ${maxFilesImage} images and ${maxFilesVideo} videos.`,
                  }),
                );

                return;
              }

              if (!!durationLimitedVideo) {
                const hasOverSizeVideos = data
                  .filter((media) => media.mime.includes('video'))
                  .filter(
                    (video) => video.duration > durationLimitedVideo,
                  ).length;

                if (hasOverSizeVideos) {
                  dispatch(
                    showAlert({
                      title: 'Error',
                      type: 'error',
                      body: `Video is over ${
                        durationLimitedVideo / 1000
                      } seconds`,
                    }),
                  );

                  return;
                }
              }

              const mediaList = data.map((item) => ({
                name: item.path.substring(item.path.length - 15),
                type: item.mime,
                uri: item.path,
              }));
              uploadMultipleMedia(mediaList);
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

      const onPressImage = (index) => () => refImageViewer.current?.open(index);

      useImperativeHandle(
        ref,
        () => ({
          setMediaData,
        }),
        [setMediaData],
      );

      useEffect(() => {
        if (!isFirstRender.current) {
          return;
        }

        isFirstRender.current = false;
        setMediaData(initialData);
      }, [initialData]);
      useEffect(() => {
        onChange(mediaData);
      }, [mediaData]);

      return (
        <>
          <ImageViewer ref={refImageViewer} data={mediaData} />
          <View style={[style, {overflow: 'hidden'}]}>
            <HeaderTitle
              editable={editable}
              label={label}
              isEditable={!!mediaData.length && !uploading}
              onPress={() => setMediaData([])}
              color={theme.colors.primary}
            />
            <ViewImage
              data={mediaData}
              disabled={mediaData.length || uploading || !editable}
              onPress={() => dispatch(showModalize(selectMediaType))}
              setImage={(e) => onPressImage(e)}
              isViewer={!enableViewer}
              editable={editable}
              isVideo={mediaData.length > 0 && isVideoType(mediaData[0].path)}
              color={theme.colors.text2}
              resizeMode={resizeMode}>
              <ProgressBarComponent
                uploading={uploading}
                color={theme.colors.textContrast}
              />
            </ViewImage>
          </View>
        </>
      );
    },
  ),
);

const ViewImage = memo((props) => {
  return (
    <TouchableOpacity onPress={props.onPress} disabled={props.disabled}>
      <View
        style={[
          styles.container,
          !props.data.length && {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}>
        {props.data.length ? (
          <>
            <TouchableOpacity
              style={[
                styles.fullHeight,
                {
                  marginRight: props.data.length > 1 ? constants.gap : 0,
                },
              ]}
              onPress={props.setImage(0)}
              activeOpacity={0.8}
              disabled={props.isViewer}>
              <ImagePath
                source={props.data[0].thumb}
                isVideo={props.isVideo}
                resizeMode={props.resizeMode}
                style={styles.fullParent}
              />
            </TouchableOpacity>

            {props.data.length > 1 && (
              <View style={styles.fullHeight}>
                <MediaData
                  data={props.data}
                  onPress={props.setImage(1)}
                  disabled={props.isViewer}>
                  <ImageComponent
                    source={props.data[1].thumb}
                    isVideo={isVideoType(props.data[1].path)}
                    resizeMode={props.resizeMode}
                  />
                </MediaData>

                <MediaData2
                  data={props.data}
                  onPress={props.setImage(2)}
                  disabled={props.isViewer}>
                  <ImageComponent
                    source={props.data[2].thumb}
                    isVideo={isVideoType(props.data[2].path)}
                    resizeMode={props.resizeMode}
                  />
                </MediaData2>

                <MediaData3
                  data={props.data}
                  onPress={props.setImage(2)}
                  disabled={props.isViewer}
                  title={`+${props.data.length - 3}`}
                />
              </View>
            )}
          </>
        ) : props.editable ? (
          <MaterialIcons
            name="add-a-photo"
            size={getSize.f(22)}
            color={props.color}
          />
        ) : (
          <MaterialCommunityIcons
            name="dots-horizontal"
            size={getSize.f(22)}
            color={props.color}
          />
        )}
      </View>
      {props.children}
    </TouchableOpacity>
  );
});

const ImageComponent = memo((props) => {
  return <ImagePath style={styles.fullParent} {...props} />;
});
const MediaData = memo((props) => {
  return (
    <TouchableOpacity
      style={[
        styles.fullWidth,
        {
          marginBottom: props.data.length > 2 ? constants.gap : 0,
        },
      ]}
      activeOpacity={0.8}
      onPress={props.onPress}
      disabled={props.disabled}>
      {props.children}
    </TouchableOpacity>
  );
});
const MediaData2 = memo((props) => {
  return (
    props.data.length > 2 && (
      <TouchableOpacity
        style={styles.fullWidth}
        activeOpacity={0.8}
        onPress={props.onPress}
        disabled={props.disabled}>
        {props.children}
      </TouchableOpacity>
    )
  );
});
const MediaData3 = memo((props) => {
  if (props.data.length > 3) {
    return (
      <TouchableOpacity
        style={styles.moreContainer}
        activeOpacity={0.8}
        onPress={props.onPress}
        disabled={props.disabled}>
        <Text style={{color: '#fff'}}>{props.title}</Text>
      </TouchableOpacity>
    );
  }
  return null;
});

const ProgressBarComponent = memo((props) => {
  return (
    props.uploading && (
      <View style={styles.loadingContainer}>
        <ProgressBar
          progress={0.5}
          indeterminate
          color={props.color}
          style={{width: getSize.w(120), borderRadius: 5}}
        />
      </View>
    )
  );
});
const HeaderTitle = memo((props) => {
  return (
    props.editable && (
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 15,
        }}>
        <Text variant="inputLabel">{props.label}</Text>
        {props.isEditable && (
          <TouchableOpacity onPress={props.onPress} style={styles.deleteBtn}>
            <Text style={styles.deleteTxt}>Delete</Text>
            <MaterialCommunityIcons
              name="delete"
              size={getSize.f(20)}
              color={props.color}
            />
          </TouchableOpacity>
        )}
      </View>
    )
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    aspectRatio: 3 / 2,
    borderRadius: 10,
    borderWidth: 0.2,
    borderStyle: 'dashed',
    borderColor: '#555',
    overflow: 'hidden',
  },
  fullWidth: {
    flex: 1,
    width: '100%',
  },
  fullHeight: {
    flex: 1,
    height: '100%',
  },
  fullParent: {
    width: '100%',
    height: '100%',
  },
  moreContainer: {
    position: 'absolute',
    width: '100%',
    height: '50%',
    backgroundColor: '#0009',
    right: 0,
    bottom: 0,

    justifyContent: 'center',
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
  loadingContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    backgroundColor: '#0009',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ImageMultiple;
