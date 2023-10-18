import React, {useState} from 'react';
import {ActivityIndicator, FlatList, Animated, View} from 'react-native';

import MentionListItem from '../MentionListItem';
import styles from './MentionListStyles';

const MentionList = (props) => {
  const [previousChar, setPreviousChar] = useState(' ');
  const {keyword, isTrackingStarted} = props;
  const withoutAtKeyword = keyword.substr(1, keyword.length);
  const list = this.props.list;
  const suggestions =
    withoutAtKeyword !== ''
      ? list.filter((user) => user.username.includes(withoutAtKeyword))
      : list;
  if (!isTrackingStarted) {
    return null;
  }

  const renderSuggestionsRow = ({item}) => {
    return (
      <MentionListItem
        onSuggestionTap={this.props.onSuggestionTap}
        item={item}
        editorStyles={this.props.editorStyles}
      />
    );
  };

  return (
    <Animated.View
      style={[
        {...styles.suggestionsPanelStyle},
        this.props.editorStyles.mentionsListWrapper,
      ]}>
      <FlatList
        style={styles.mentionsListContainer}
        keyboardShouldPersistTaps={'always'}
        horizontal={false}
        ListEmptyComponent={
          <View style={styles.loaderContainer}>
            <ActivityIndicator />
          </View>
        }
        enableEmptySections={true}
        data={suggestions}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={(rowData) => {
          return this.renderSuggestionsRow(rowData);
        }}
      />
    </Animated.View>
  );
};

export default MentionList;
