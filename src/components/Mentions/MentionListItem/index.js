import React from 'react';
import {Text, View, TouchableOpacity} from 'react-native';

// Styles
import styles from './MentionListItemStyles';

import Avatar from '../Avatar';

const MentionListItem = (props) => {
  // const {onSuggestionTap} = props;
  const {item: user, index, editorStyles} = props;

  const onSuggestionTap = (user, hidePanel) => {
    onSuggestionTap(user);
  };

  return (
    <View>
      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.suggestionItem, editorStyles.mentionListItemWrapper]}
        onPress={() => onSuggestionTap(user)}>
        <Avatar
          user={user}
          wrapperStyles={styles.thumbnailWrapper}
          charStyles={styles.thumbnailChar}
        />

        <View style={[styles.text, editorStyles.mentionListItemTextWrapper]}>
          <Text style={[styles.title, editorStyles.mentionListItemTitle]}>
            {user.name}
          </Text>
          <Text style={[styles.username, editorStyles.mentionListItemUsername]}>
            @{user.username}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default MentionListItem;
