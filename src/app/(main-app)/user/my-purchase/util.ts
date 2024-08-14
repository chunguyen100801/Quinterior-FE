import { MessageOfStatus } from 'src/constants/purchase';

export const getMessageStatus = (key: string) => {
  const message = MessageOfStatus.find((tab) => tab.key === key);
  return message
    ? {
        message: message.message,
        color: message.color,
        status: message.status,
      }
    : {
        message: '',
        color: '',
      };
};
