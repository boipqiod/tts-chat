import {ChatManager} from "$lib/server/ChatManager";

export const load = async () => {
  return {
    messages: ChatManager.instance.getMessages().map(({user, message}) => ({name: user, message}))
  };
};