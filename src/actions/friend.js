import NavigationService from 'navigation/service';

import {CREATE_CHAT_ROOM_RELATED_USER} from './types';
import {generateThunkAction} from './utilities';

export const createChatRelatedUser = ({members}, callback) =>
  generateThunkAction({
    actionType: CREATE_CHAT_ROOM_RELATED_USER,
    apiOptions: {
      endpoint: '/chats/rooms',
      method: 'POST',
      data: {members: members && members?.length > 1 ? members : members[0]},
    },
    callback: {
      success: (payload, dispatch) => {
        dispatch(joinChatRoomById(payload?.data?.id));
        dispatch(seenChatRoom({roomId: payload?.data?.id}));
        NavigationService.goBack();
        NavigationService.navigate('ChatRoomBot', {data: payload});
      },
    },
  })();
