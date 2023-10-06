import React, {useEffect, useState} from 'react';
import {getVersion, getBuildNumber} from 'react-native-device-info';

import Text from './Text';

const AppVersion = () => {
  const [buildLabel, setBuildLabel] = useState('');

  useEffect(() => {
    // codePush.getUpdateMetadata().then(update => {
    //   if (update) {
    //     setBuildLabel(getVersion());
    //   }
    // });
  }, []);

  return (
    <Text variant="caption">
      Version {getVersion()} ({getBuildNumber()})
    </Text>
  );
};

export default AppVersion;
