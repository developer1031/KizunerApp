import {useSelector} from 'react-redux';

import pinkLight from './pinkLight';
import orangeLight from './orangeLight';
import blackLivesMatter from './blackLivesMatter';

export const themes = {pinkLight, orangeLight, blackLivesMatter};

const useTheme = (themeName = 'orangeLight') => {
  const theme = useSelector(state => state.app.theme);
  return {
    name: theme || themeName,
    ...themes[theme || themeName],
  };
};

export {pinkLight, orangeLight, blackLivesMatter};

export default useTheme;
