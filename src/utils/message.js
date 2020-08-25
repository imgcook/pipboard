import { Message } from '@alifd/next';

export function messageSuccess (message) {
  Message.success(message);
}

export function messageError (message, title = 'error') {
  Message.show({
    type: 'error',
    title,
    content: message,
    hasMask: true,
  });
}

export function messageWarning (message, title = 'warning') {
  Message.show({
    type: 'warning',
    title,
    content: message,
    hasMask: true,
  });
}

export function messageLoading (message, title = 'loading') {
  Message.show({
    type: 'loading',
    title,
    content: message,
    hasMask: true,
    duration: 0,
  });
}

export function messageHide () {
  Message.hide();
}
