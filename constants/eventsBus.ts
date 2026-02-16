type Callback = () => void;
const listeners = new Set<Callback>();

export const EventBus = {
  emitOpenSettings: () => {
    listeners.forEach((callback: Callback) => callback());
  },
  onOpenSettings: (callback: Callback) => {
    listeners.add(callback);
    return () => {
      listeners.delete(callback);
    };
  },
};
