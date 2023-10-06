import React, {useRef} from 'react';
import {VideoRecorder} from 'components';

const VideoPicker = ({onShow, callback, cameraOptions, recordOptions}) => {
  const recorderVideoRef = useRef(null);

  const onStartVideoRecorder = () => {
    recorderVideoRef.current.open({maxLength: 30}, (data) => {
      callback(data);
    });
  };

  onShow = () => {
    onStartVideoRecorder();
  };

  return (
    <VideoRecorder
      cameraOptions={cameraOptions}
      recordOptions={recordOptions}
      ref={recorderVideoRef}
    />
  );
};

export default VideoPicker;
