import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import Hyperlink from 'react-native-hyperlink';

import Text from './Text';
import useTheme from 'theme';
import {getSize} from 'utils/responsive';

const ExpandableText = ({children, ...props}) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);

  const styles = StyleSheet.create({
    moreText: {
      color: theme.colors.primary,
      fontSize: getSize.f(15),
    },
    linkStyle: {
      color: theme.colors.primary,
    },
  });

  if (!children) {
    return null;
  }

  return (
    <Hyperlink linkStyle={styles.linkStyle} linkDefault>
      <Text {...props}>
        {children?.length > 120 && !expanded
          ? `${children.slice(0, 120).trim()}...`
          : children}
        {children?.length > 120 ? (
          expanded ? (
            <Text onPress={() => setExpanded(false)} style={styles.moreText}>
              {' '}
              Less
            </Text>
          ) : (
            <Text onPress={() => setExpanded(true)} style={styles.moreText}>
              {' '}
              More
            </Text>
          )
        ) : null}
      </Text>
    </Hyperlink>
  );
};

export default ExpandableText;
