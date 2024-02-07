import {StyleSheet, Text, View} from 'react-native';
import React, {useImperativeHandle, useState} from 'react';
import {forwardRef} from 'react';
import {EnumAsyncStorage} from 'utils/constants';
import AsyncStorage from '@react-native-community/async-storage';
import {Modal} from 'react-native';
import {TouchableOpacity} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign'; //
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import useTheme from 'theme';
import {getSize} from 'utils/responsive';
import {FlatList} from 'react-native';
import EmptyState from './EmptyState';
import ImageMultiple from './ImageMultiple/ImageMultiple';
import {Alert} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';

const constants = {
  maxSavedDraft: 10,
};
const ModalChooseDraft = forwardRef(
  ({type = 'hangout', onChooseDraft = () => {}, roomId = null}, ref) => {
    const [visible, setVisible] = useState(false);
    const [dataList, setDataList] = useState([]);

    const StoreKey =
      type === 'hangout'
        ? EnumAsyncStorage.DRAFT_HANGOUT
        : EnumAsyncStorage.DRAFT_HELP;

    const renderHeader = () => {
      return (
        <View style={styles.itemContainer}>
          <Text style={{flex: 1}}></Text>
          <Text style={{flex: 1, marginHorizontal: 10}}>Title</Text>
          <Text style={{flex: 1.3}}>Description</Text>
          <Entypo name="chevron-thin-right" color={'white'} />
        </View>
      );
    };
    const renderItem = ({item, index}) => {
      const onPress = (draft) => () => {
        onChooseDraft(draft);
        setVisible(false);
      };

      return (
        <TouchableOpacity onPress={onPress(item)} key={item.id}>
          <View style={styles.itemContainer}>
            {/* <ImageMultiple initialData={item.cover} style={{flex: 1}} type={`user.${type}`}/> */}
            <Text
              style={{
                flex: 1,
                marginHorizontal: 10,
              }}
              numberOfLines={2}>
              {item.title || 'Untitle'}
            </Text>
            {/* <Text style={{flex: 1.3}} numberOfLines={3}>
              {item.description}
            </Text> */}

            {/* <Entypo name='chevron-thin-right' /> */}
            <TouchableOpacity
              style={{padding: 10}}
              onPress={() => remove(item.id)}>
              <Entypo name="trash" size={20} color="gray" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      );
    };

    const store = (draft) => {
      AsyncStorage.getItem(StoreKey)
        .then((data) => {
          const draftMaxSaved = JSON.parse(data)?.slice(
            0,
            constants.maxSavedDraft,
          );
          const draftList = [draft, ...draftMaxSaved];
          const draftString = JSON.stringify(draftList);

          AsyncStorage.setItem(StoreKey, draftString);
        })
        .catch(() => {
          const draftString = JSON.stringify([draft]);
          AsyncStorage.setItem(StoreKey, draftString);
        });
    };
    const clear = () => {
      AsyncStorage.removeItem(StoreKey);
    };
    const remove = (id) => {
      AsyncStorage.getItem(StoreKey)
        .then((data) => {
          const draftList = JSON.parse(data) ?? [];
          const newData = draftList.filter((d) => d.id != id);
          const draftString = JSON.stringify(newData);

          AsyncStorage.setItem(StoreKey, draftString);
          setDataList(
            (prev) => (prev = newData.filter((d) => d.roomId == roomId)),
          );
        })
        .catch(() => {});
    };
    const open = () => {
      AsyncStorage.getItem(StoreKey).then((data) => {
        const draftList = JSON.parse(data) ?? [];

        setDataList(
          (prev) => (prev = draftList.filter((d) => d.roomId == roomId)),
        );
        setVisible((prev) => (prev = true));
      });
    };
    const close = () => {
      setVisible((prev) => (prev = false));
    };

    useImperativeHandle(
      ref,
      () => ({
        store,
        clear,
        remove,
        open,
        close,
      }),
      [store, remove],
    );

    return (
      <Modal transparent animationType="fade" visible={visible}>
        <View style={styles.background}>
          <View style={styles.container}>
            <View style={styles.btnContainer}>
              <TouchableOpacity
                onPress={() => {
                  clear();
                  close();
                }}
                style={styles.btnClearAll}>
                <EvilIcons
                  color="black"
                  size={getSize.f(25)}
                  name="trash"
                  style={[styles.btnClose, {marginRight: 0}]}
                />
                <Text>Clear all</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={close}>
                <AntDesign
                  color="black"
                  size={getSize.f(25)}
                  name="close"
                  style={styles.btnClose}
                />
              </TouchableOpacity>
            </View>

            <FlatList
              data={dataList}
              keyExtractor={(_, index) => index.toString()}
              renderItem={renderItem}
              // ListHeaderComponent={renderHeader}
              ListEmptyComponent={() => <EmptyState />}
            />
          </View>
        </View>
      </Modal>
    );
  },
);

const styles = StyleSheet.create({
  background: {
    ...StyleSheet.absoluteFillObject,

    backgroundColor: '#0009',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 0.8,
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  btnClearAll: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  btnClose: {
    alignSelf: 'flex-end',
    margin: 15,
  },
  itemContainer: {
    width: '100%',
    padding: 20,
    borderBottomWidth: 0.2,
    borderColor: '#999',
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default ModalChooseDraft;
