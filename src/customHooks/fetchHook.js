import React, { useEffect, useState } from "react";

const useFetch = () => {
  const [state, setState] = useState([]);

  const extractDataFromApi = (
    url = "",
    headers = "",
    payload = "",
    method = "POST"
  ) => {
    fetch(url, {
      headers: headers,
      method: method,
    }).then((res) => setState(res));
  };

  return [state, extractDataFromApi];
};

export default useFetch;
