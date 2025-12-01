// Specify BASE_URL for the API
export const BASE_URL = "https://api.nomoreparties.co";

//REGISTER function
// accepts necessary data as arguments and sends POST req to given endpoint
export const register = (username, email, password) => {
  return fetch(`${BASE_URL}/auth/local/register`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, email, password }),
  }).then((res) => {
    return res.ok ? res.json() : Promise.reject(`Error: ${res.status}`);
  });
};

//AUTHORIZE (login) function
//accepts the necessary data as parameters
export const authorize = (identifier, password) => {
  return fetch(`${BASE_URL}/auth/local`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },

    //parameters are wrapped in an object, converted to a JSON
    // string, and sent in the body of the request
    body: JSON.stringify({ identifier, password }),
  }).then((res) => {
    return res.ok ? res.json() : Promise.reject(`Error: ${res.status}`);
  });
};
