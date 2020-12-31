const connectStore = (store, onStoreUpdate) => {
  if (!store || !store.subscribe || !store.unsubscribe) {
    throw new Error(
      '🔴 cannot connect this store. Are your `props` properly overloaded using `withStore` ?'
    );
  }

  // initialize the subscriber with current store state
  onStoreUpdate(store.getState());

  // register to next store state updates
  store.subscribe(onStoreUpdate);

  return () => {
    store.unsubscribe(onStoreUpdate);
  };
};

export default connectStore;
