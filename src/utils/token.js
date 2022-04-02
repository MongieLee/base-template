export const __auth_token_key__ = "auth_token";
export const __expires__key__ = "expires";

const setToken = (key, value) => {
  localStorage.setItem(key, value);
};

const getToken = (key) => localStorage.getItem(key);

const setAuthToken = (token, expires) => {
  setToken(__auth_token_key__, token);
  setToken(__expires__key__, expires);
};

const inspectTokenValidity = () => {
  const token = getToken(__auth_token_key__);
  const validTime = Number(getToken(__expires__key__));
  return token ? validTime >= Date.now() : false;
};

const clearAuthToken = () => {
  localStorage.removeItem(__auth_token_key__);
  localStorage.removeItem(__expires__key__);
};

export {
  setToken,
  getToken,
  setAuthToken,
  inspectTokenValidity,
  clearAuthToken,
};
