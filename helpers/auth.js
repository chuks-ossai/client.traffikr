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

export const getCookie = (key, req) =>
  process.browser ? getBrowserCookie(key) : getServerCookie(key, req);

export const getBrowserCookie = (key) => Cookies.get(key);

export const getServerCookie = (key, req) => {
  if (!req.headers.cookie) {
    return undefined;
  }

  const token = req.headers.cookie
    .split(";")
    .find((c) => c.startsWith(`${key}=`));
  if (!token) {
    return undefined;
  }
  const tokenValue = token.split("=")[1];
  return tokenValue;
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

export const logout = (next) => {
  removeCookie("auth_tok");
  removeLocalStorage("user");
  next();
};
