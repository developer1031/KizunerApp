import React from 'react';
import {ScrollView, GestureResponderEvent} from 'react-native';
import {
  View,
  Modal,
  Animated,
  PanResponder,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import {PanGestureHandler} from 'react-native-gesture-handler';

const heightModal = (Dimensions.get('window').height / 4) * 2;

export default class BottomModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      panY: new Animated.Value(Dimensions.get('screen').height),
      disableScroll: true,
    };

    this._resetPositionAnim = Animated.timing(this.state.panY, {
      toValue: 0,
      duration: 300,
    });

    this._closeAnim = Animated.timing(this.state.panY, {
      toValue: Dimensions.get('screen').height,
      duration: 80,
    });

    this._panResponders = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => false,
      onPanResponderMove: Animated.event([null, {dy: this.state.panY}]),
      onPanResponderRelease: (e, gs) => {
        // Handle dismiss
        if (gs.dy > heightModal / 4) {
          return this._closeAnim.start(() => this.props.onDismiss());
        }
        return this._resetPositionAnim.start();
      },
    });
  }

  isPortrait = () => {
    const dim = Dimensions.get('screen');
    return dim.height >= dim.width;
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.visible !== this.props.visible && this.props.visible) {
      this._resetPositionAnim.start();
    }
  }

  _handleDismiss() {
    this._closeAnim.start(() => this.props.onDismiss());
  }

  render() {
    const top = this.state.panY.interpolate({
      inputRange: [-1, 0, 1],
      outputRange: [0, 0, 1],
    });

    return (
      <Modal
        animated
        animationType="fade"
        visible={this.props.visible}
        transparent={true}
        onRequestClose={() => this._handleDismiss()}>
        <PanGestureHandler>
          <ScrollView
            style={{
              flex: 1,
              zIndex: 100000,
              backgroundColor: 'rgba(0,0,0,0.5)',
              flexDirection: 'column-reverse',
            }}>
            <Animated.View style={styles.overlay}>
              <Animated.View style={[styles.container, {top}]}>
                <Animated.View
                  {...this._panResponders.panHandlers}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      height: 5,
                      width: 50,
                      borderRadius: 10,
                      backgroundColor: 'white',
                    }}
                  />
                </Animated.View>
                <View style={styles.btnClose}>
                  <TouchableOpacity onPress={() => this._handleDismiss()} />
                </View>
                {this.props.children}
              </Animated.View>
            </Animated.View>
          </ScrollView>
        </PanGestureHandler>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  overlay: {
    //   backgroundColor: 'rgba(0, 0, 0, 0.65)',
    flex: 1,
  },
  container: {},
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    //backgroundColor: 'rgba(0,0,0,0.5)',
  },
});
