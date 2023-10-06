import React, {useRef} from 'react';

import {EmojiSelector, Categories} from 'components';

const EmojiPicker = ({
  open,
  onSelect,
  onClose,
  showSearchBar,
  showSectionTitles,
}) => {
  return (
    open && (
      <EmojiSelector
        category={Categories.all}
        onEmojiSelected={(emoji) => onSelect(emoji)}
        showSearchBar={showSearchBar || false}
        showSectionTitles={showSectionTitles || false}
      />
    )
  );
};

export default EmojiPicker;
