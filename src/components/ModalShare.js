import {StyleSheet, Text, View} from 'react-native'
import React, {useRef, useImperativeHandle} from 'react'
import {Modalize as RNModalize} from 'react-native-modalize'
import {Platform} from 'react-native'
import {Dimensions} from 'react-native'
import {forwardRef} from 'react'

const ModalShare = forwardRef(({}, ref) => {
  const refModal = useRef(null)

  const open = () => {
    refModal.current?.open()
  }

  useImperativeHandle(
    ref,
    () => ({
      open,
    }),
    [open],
  )

  return (
    <RNModalize
      withReactModal={!(Platform.OS === 'android')}
      ref={refModal}
      modalHeight={Dimensions.get('screen').height / 2.2}></RNModalize>
  )
})

const styles = StyleSheet.create({})

export default ModalShare
