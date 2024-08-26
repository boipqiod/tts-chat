import {ChatManager} from "$lib/server/ChatManager";
import {json, type RequestHandler} from "@sveltejs/kit";

export const GET: RequestHandler = async () => {
  return json({
    messages: ChatManager.instance.getMessages()
  })
};
