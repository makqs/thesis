export const fetchWrapper = async (method, path, token, body) => {
  const requestOptions = {
    method
  };

  if (body != null) {
    requestOptions.body = JSON.stringify(body);
  }

  // TODO: add tokens for login
  if (token != null) {
    requestOptions.headers.Authorization = `Bearer ${token}`;
  }

  return new Promise((resolve) => {
    // TODO: add backend port to config file
    fetch(`http://127.0.0.1:5000/${path}`, requestOptions).then((response) => {
      response
        .json()
        .then((data) => {
          if (response.ok) {
            resolve(data);
          } else {
            console.log(data.error);
          }
        })
        .catch(() => console.log("look idk"));
    });

    // fetch(`http://localhost:5000/${path}`, requestOptions).then((response) => {
    //   response.json().then((data) => {
    //     console.log(data);
    //   });
    // });
  });
};

export default fetchWrapper;
