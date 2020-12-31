const connectStore = (store, onStoreUpdate, options = {}) => {
  if (!store || !store.subscribe || !store.unsubscribe) {
    throw new Error(
      '🔴 cannot connect this store. Are your `props` properly overloaded using `withStore` ?'
    );
  }

  console.log(`✅ [hookstores] connectStore`, options);
  const {byPassInitialUpdate = false} = options;

  if (!byPassInitialUpdate) {
    onStoreUpdate(store.getState());
  }

  store.subscribe(onStoreUpdate);

  return () => {
    store.unsubscribe(onStoreUpdate);
  };
};

export default connectStore;
