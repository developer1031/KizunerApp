import React, {useRef, useState} from 'react';
import {View, StyleSheet, Image} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useDispatch, useSelector} from 'react-redux';
import {ProgressBar} from 'react-native-paper';
import DocumentPicker from 'react-native-document-picker';

import {Touchable, Text} from 'components';
import useTheme from 'theme';
import {getSize} from 'utils/responsive';
import {isVideoType} from 'utils/fileTypes';
import orangeLight from '../theme/orangeLight';
import NavigationService from 'navigation/service';

const InputFile = ({
  label,
  labelStyle,
  onDelete,
  onChange,
  value,
  limitVideo,
}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [selected, setSelected] = useState(value);
  const uploading = useSelector((state) => state.feed.beingUploadSingle);

  const handleResult = (payload) => {};

  const handleResultVideo = (payload) => {};

  const handleDelete = () => {
    setSelected(null);
    onDelete && onDelete();
  };

  const onSelect = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [
          DocumentPicker.types.docx,
          DocumentPicker.types.doc,
          DocumentPicker.types.pdf,
          DocumentPicker.types.plainText,
          DocumentPicker.types.csv,
        ],
      });
      console.log(
        res.uri,
        res.type, // mime type
        res.name,
        res.size,
      );
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Text variant="inputLabel" style={labelStyle}>
          {label}
        </Text>
        <Touchable onPress={onSelect} disabled={!!selected}>
          {selected ? (
            <View style={styles.imageWrap}>
              <Image
                source={{uri: selected?.uri || selected?.path}}
                style={styles.image}
              />
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
                name="file-upload"
                size={getSize.f(22)}
                color={theme.colors.text2}
              />
            </View>
          )}
        </Touchable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {},
  header: {},
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
    resizeMode: 'cover',
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

export default InputFile;
