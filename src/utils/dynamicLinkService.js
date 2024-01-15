import {useEffect} from 'react';
import {useSelector} from 'react-redux';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import {Linking, Platform} from 'react-native';

import NavigationService from 'navigation/service';

export default function useDynamicLinkService() {
  const {isAuth} = useSelector((state) => state.auth);
  useEffect(() => {
    dynamicLinks()
      .getInitialLink()
      .then((link) => {
        console.log('DynamicLink: ', link);
        handleDynamicLink(link);
      });

    const linkingListener = dynamicLinks().onLink((url) => {
      console.log('open', url);
      handleDynamicLink(url);
    });

    return () => {
      linkingListener();
    };
  }, []);

  function handleDynamicLink(link) {
    if (link) {
      let rawLink = link.replace(/(^\w+:|^)\/\//, '');
      const id = rawLink?.split('&id=')[1];
      if (!isAuth) {
        NavigationService.navigate('Login');
        return;
      } else {
        if (rawLink.includes('hangout')) {
          id &&
            NavigationService.push('HangoutDetail', {
              hangoutId: id,
            });
        } else if (rawLink.includes('status')) {
          id &&
            NavigationService.push('StatusDetail', {
              statusId: id,
            });
        } else if (rawLink.includes('help')) {
          id &&
            NavigationService.push('HelpDetail', {
              helpId: id,
            });
        }
        return;
      }
    }
  }

  function handleDynamicLinking(event) {
    const link = event?.url;
    if (link) {
      let rawLink = link.replace(/(^\w+:|^)\/\//, '');
      const id = rawLink?.split('&id=')[1];
      if (!isAuth) {
        NavigationService.navigate('Login');
        return;
      } else {
        if (rawLink.includes('hangout')) {
          id &&
            NavigationService.push('HangoutDetail', {
              hangoutId: id,
            });
        } else if (rawLink.includes('status')) {
          id &&
            NavigationService.push('StatusDetail', {
              statusId: id,
            });
        } else if (rawLink.includes('help')) {
          id &&
            NavigationService.push('HelpDetail', {
              helpId: id,
            });
        }
        return;
      }
    }
  }

  // let dynamicLinkOpenedListener;

  // useEffect(() => {
  //   Linking.getInitialURL()
  //     .then(event => {
  //       if (event) {
  //         console.log(123, event);
  //       }
  //     })
  //     .catch(error => {
  //       console.warn(error);
  //     });
  //   Linking.addEventListener('url', handleUrl);
  //   createListener();

  //   return () => {
  //     dynamicLinkOpenedListener && dynamicLinkOpenedListener();
  //     // Linking.removeEventListener('url', handleUrl);
  //   };
  // }, []);

  // const handleUrl = event => {
  //   console.log(1234, event);
  //   navigate(event.url);
  // };

  // async function createListener() {
  //   dynamicLinkOpenedListener = await handleDeepLink();
  // }

  // const handleDeepLink = async url => {
  //   console.log(12345, url);
  //   const route = decodeURIComponent(url);
  //   let rawURL = route;

  //   if (Platform.OS === 'ios') {
  //     let dynamicLink = await firebase.links().getInitialLink();
  //     if (dynamicLink) {
  //       rawURL = dynamicLink;
  //     } else {
  //       if (rawURL && rawURL.includes('kizuner-app.inapps.technology')) {
  //         let dynamicLinkManual = getInitialLinkManunal(url);
  //         if (dynamicLinkManual) {
  //           rawURL = dynamicLinkManual;
  //         }
  //       }
  //     }
  //   }
  //   rawURL = rawURL.replace(/(^\w+:|^)\/\//, '');
  //   handleNavigateScreen(rawURL);
  // };

  // const getInitialLinkManunal = url => {
  //   let rawURL = '';
  //   let splitURL = url.split('&');
  //   if (splitURL.length > 0) {
  //     rawURL = splitURL[0];
  //   }

  //   if (rawURL) {
  //     splitURL = rawURL.split('link=');
  //     if (splitURL.length === 2) {
  //       rawURL = splitURL[1];
  //     }
  //   }

  //   return rawURL;
  // };

  // const navigate = async url => {
  //   const route = decodeURIComponent(url);
  //   let rawURL = route;

  //   if (Platform.OS === 'ios') {
  //     let dynamicLink = await firebase.links().getInitialLink();
  //     if (dynamicLink) {
  //       rawURL = dynamicLink;
  //     } else {
  //       if (rawURL && rawURL.includes('kizuner-app.inapps.technology')) {
  //         let dynamicLinkManual = getInitialLinkManunal(url);
  //         if (dynamicLinkManual) {
  //           rawURL = dynamicLinkManual;
  //         }
  //       }
  //     }
  //   }
  //   rawURL = rawURL.replace(/(^\w+:|^)\/\//, '');
  //   handleNavigateScreen(rawURL);
  // };

  // const handleNavigateScreen = url => {
  //   if (!isAuth) {
  //     NavigationService.navigate('Login');
  //     return;
  //   }
  //   if (url) {
  //     const id = url?.split('?id=')[1];
  //     if (url.includes('hangout')) {
  //       id &&
  //         NavigationService.push('HangoutDetail', {
  //           hangoutId: id,
  //         });
  //     } else if (url.includes('status')) {
  //       id &&
  //         NavigationService.push('StatusDetail', {
  //           statusId: id,
  //         });
  //     } else if (url.includes('help')) {
  //       id &&
  //         NavigationService.push('HelpDetail', {
  //           helpId: id,
  //         });
  //     }
  //     return;
  //   }
  // };

  return null;
}
