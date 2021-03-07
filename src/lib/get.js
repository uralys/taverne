const get = (path, obj) =>
  !path
    ? obj
    : path.split('.').reduce((object, subpath) => (object || {})[subpath], obj);

export default get;
