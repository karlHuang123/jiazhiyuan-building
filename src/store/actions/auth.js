import { setUserToken, resetUser } from "./user";
import { reqLogin, reqLogout } from "@/api/login";
import { setToken, removeToken } from "@/utils/auth";
import { message } from "antd";
export const login = (username, password) => (dispatch) => {
  return new Promise((resolve, reject) => {
    reqLogin({ mobile: username.trim(), password: password })
      .then((response) => {
        const { data } = response;
        if (data && data.status === 'OK') {
          const token = data.data.token;
          dispatch(setUserToken(token));
          setToken(token);
          resolve(data.data);
        } else {
          const msg = data.errorMsg;
          message.error(data.errorMsg)
          reject(msg);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const logout = (token) => (dispatch) => {
  return new Promise((resolve, reject) => {
    reqLogout(token)
      .then((response) => {
        const { data } = response;
        if (data.status === 0) {
          dispatch(resetUser());
          removeToken();
          resolve(data);
        } else {
          const msg = data.message;
          reject(msg);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};
