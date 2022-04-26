export const __auth_token_key__ = "auth_token";
export const __auth_refresh_token_key__ = "refresh_token";
export const __expires__key__ = "expires";

const setToken = (key, value) => {
  localStorage.setItem(key, value);
};

const getToken = (key) => localStorage.getItem(key);

const setAuthToken = (token, expires,refreshToken) => {
  setToken(__auth_token_key__, token);
  setToken(__expires__key__, expires);
  setToken(__auth_refresh_token_key__, refreshToken);
};

const inspectTokenValidity = () => {
  const token = getToken(__auth_token_key__);
  const validTime = Number(getToken(__expires__key__));
  return token ? validTime >= Date.now() : false;
};

const clearAuthToken = () => {
  localStorage.removeItem(__auth_token_key__);
  localStorage.removeItem(__expires__key__);
  localStorage.removeItem(__auth_refresh_token_key__);
  localStorage.removeItem("cache_tabs");
  localStorage.removeItem("user_info");
};

export {
  setToken,
  getToken,
  setAuthToken,
  inspectTokenValidity,
  clearAuthToken,
};
