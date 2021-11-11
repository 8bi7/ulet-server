export interface Message {
  author: string;
  message: string;
}

interface App {
  [key: string]: {
    host: {
      idk: any;
    };
    clients: {
      client_1: any;
    };
  };
}

export enum IOEvents {
  CONNECTION = "connection",
  DISCONNECT = "disconnect",
  MESSAGE = "message",
  ERROR = "error",
  GROUPS_GET = "groups:get",
  GROUPS_GET_RESPONSE = "groups:get_response",
  GROUPS_POST = "groups:post",
  CREATE_ROOM = "create:room",
  JOIN_ROOM = "join:room",
  BUTTON_PRESS = "button:press",
  GROUP_CHANGESTATE = "group:changeState",
  HOST_DISCONNECT = "host:disconnect",
}
