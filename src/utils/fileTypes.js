export const FILE_TYPES = {
  AUDIO_TYPE: {
    aac: 'aac',
    m4a: 'm4a',
    mp3: 'mp3',
    wav: 'wav',
  },
  APPLE_TYPE: {
    key: 'key',
    pages: 'pages',
    numbers: 'numbers',
  },
  IMAGE_TYPE: {
    jpg: 'jpg',
    tiff: 'tiff',
    gif: 'gif',
    svg: 'svg',
    svgz: 'svgz',
    bmp: 'bmp',
    png: 'png',
  },
  MICROSOFT_TYPE: {
    doc: 'doc',
    docx: 'docx',
    docm: 'docm',
    ppt: 'ppt',
  },
  VIDEO_TYPE: {
    mov: 'mov',
    mp4: 'mp4',
    m4v: 'm4v',
    MOV: 'MOV',
    MP4: 'MP4',
    M4V: 'M4V',
    oggtheora: 'oggtheora',
  },
};

export const getFileTypeWithString = (value) => {
  if (!value) return '';
  return value.substr(value.lastIndexOf('.') + 1);
};

export const isVideoType = (value) => {
  if (!value) return false;
  const type = getFileTypeWithString(value);
  return Object.values(FILE_TYPES.VIDEO_TYPE).includes(type);
};
