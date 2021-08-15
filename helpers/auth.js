import Cookies from "js-cookie";

export const setCookie = (key, value) => {
  if (process.browser) {
    Cookies.set(key, value, {
      expires: 1,
    });
  }
};

export const removeCookie = (key) => {
  if (process.browser) {
    Cookies.remove(key);
  }
};

export const getCookie = (key) => {
  if (process.browser) {
    return Cookies.get(key);
  }

  return null;
};

export const setLocalStorage = (key, value) => {
  if (process.browser) {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

export const removeLocalStorage = (key) => {
  if (process.browser) {
    localStorage.removeItem(key);
  }
};

export const getLocalStorage = (key) => {
  if (process.browser) {
    return JSON.parse(localStorage.getItem(key));
  }

  return null;
};

export const authenticate = (res, next) => {
  setCookie("auth_tok", res.token);
  setLocalStorage("user", res.user);
  next();
};

export const isAuth = () => {
  if (process.browser) {
    if (getCookie("auth_tok") && getLocalStorage("user")) {
      return getLocalStorage("user");
    } else {
      return false;
    }
  }
};
