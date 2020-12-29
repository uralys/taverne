const connectStore = (store, setComponentProps) => () => {
  if (!store || !store.subscribe) {
    throw new Error(
      '🔴 cannot connect this store. Check if your `props` are properly composed with `withStore` '
    );
  }
  // const mapStateToProps = (storeState, action) => {
  const mapStateToProps = storeState => {
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
