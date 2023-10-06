import {useEffect} from 'react';
import Echo from 'laravel-echo';
import socketio from 'socket.io-client';
import {useSelector, useDispatch} from 'react-redux';

import {SOCKET_HOST} from 'utils/constants';
import {
  newFeedFromSocket,
  newMessageFromSocket,
  listChatRoom,
  seenChatRoom,
  //
  getListLeaderBoardRegional,
  getListLeaderBoardCountry,
  getListLeaderBoardGlobal,
  getUserInfo,
  toggleIsShowTrophyModal,
} from 'actions';

export const echo = new Echo({
  broadcaster: 'socket.io',
  host: SOCKET_HOST,
  client: socketio,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: Infinity,
});

export default function useSocket() {
  const accessToken = useSelector((state) => state.auth.accessToken);
  const isAuth = useSelector((state) => state.auth.isAuth);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const dispatch = useDispatch();
  const {roomDetail, typeChat} = useSelector((state) => state.chat);

  useEffect(() => {
    echo.connector.options.auth.headers['Authorization'] =
      'Bearer ' + accessToken;
  }, [accessToken]);

  function handleNewFeed() {
    dispatch(newFeedFromSocket());
  }

  function handleLoadReward() {
    dispatch(getListLeaderBoardRegional('regional'));
    dispatch(getListLeaderBoardCountry('country'));
    dispatch(getListLeaderBoardGlobal('global'));
  }

  function handleNewMessage(event) {
    dispatch(newMessageFromSocket(event.data));
    if (event?.data?.room_id === roomDetail?.id) {
      dispatch(
        seenChatRoom({roomId: event?.data?.room_id, userId: userInfo?.id}),
      );
    }
  }

  function handleReloadMessage() {
    dispatch(listChatRoom({page: 1, reset: true, type: typeChat}));
  }

  function handleReloadLeaderboard(event) {
    //console.log(event);
    dispatch(getUserInfo());
    if (event?.data?.is_up) {
      setTimeout(() => {
        dispatch(toggleIsShowTrophyModal(true));
      }, 1500);
    }
    return;
  }

  useEffect(() => {
    if (isAuth) {
      echo.private(`user.${userInfo?.id}`).listen('.reward', handleLoadReward);
      echo.private(`user.${userInfo?.id}`).listen('.timeline', handleNewFeed);
      echo.private(`user.${userInfo?.id}`).listen('.chat', handleNewMessage);
      echo
        .private(`user.${userInfo?.id}`)
        .listen('.added_point', handleReloadLeaderboard);
      echo
        .private(`user.${userInfo?.id}`)
        .listen('.chat.reload', handleReloadMessage);
    }

    return () => {
      echo.private(`user.${userInfo?.id}`).stopListening('.reward');
      echo.private(`user.${userInfo?.id}`).stopListening('.timeline');
      echo.private(`user.${userInfo?.id}`).stopListening('.chat');
      echo.private(`user.${userInfo?.id}`).stopListening('.chat.reload');
      echo.private(`user.${userInfo?.id}`).stopListening('.added_point');
    };
  }, [isAuth, userInfo, roomDetail]);

  return echo;
}
