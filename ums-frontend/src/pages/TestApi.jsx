import { useEffect } from "react";
import axiosClient from "../api/axiosClient";

function TestApi() {
  useEffect(() => {
    axiosClient.get("/users")
      .then(res => console.log(res.data))
      .catch(err => console.error(err));
  }, []);

  return <h1>Test API</h1>;
}

export default TestApi;