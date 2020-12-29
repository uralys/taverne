const connectStore = (store, setComponentProps) => () => {
  if (!store || !store.subscribe) {
    console.log('bump');
    throw new Error(
      '🔴 cannot connect this store. Check if your `props` are properly composed with `withStore` '
    );
  }
  const mapStateToProps = (storeState, action) => {
    setComponentProps({
      ...storeState
    });
  };

  store.subscribe(mapStateToProps);

  return () => {
    store.unsubscribe(mapStateToProps);
  };
};

// -----------------------------------------------------------------------------

export default connectStore;
