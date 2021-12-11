import React from "react";
import { useForm } from "react-hook-form";

const CALC_API =
  "https://ufrhomrfoj.execute-api.us-east-1.amazonaws.com/dev/contribute";

const BasicForm = () => {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    callApi(data);
  };

  function callApi(data) {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "E6SthwosRd3B0Fpp2k6xo4wU1ToaVXWq1dwyodSg",
      },
      body: JSON.stringify(data),
    };
    try {
      fetch(CALC_API, requestOptions)
        .then((res) => res.json())
        .then((data) => {
          setDats(data);
          setLoaded(true);
          setLoading(false);
        });
    } catch (error) {}
  }

  return (
    <div className="App">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-control">
          <label>Name</label>
          <input type="text" name="fullName" ref={register} />
        </div>
        <div className="form-control">
          <label>Email</label>
          <input type="text" name="email" ref={register} />
        </div>
        <div className="form-control">
          <label>Phone</label>
          <input type="text" name="phone" ref={register} />
        </div>
        <div className="form-control">
          <label>Message</label>
          <input type="text" name="message" ref={register} />
        </div>
        <div className="form-control">
          <label>File</label>
          <input ref={register} type="file" name="picture" />
        </div>
        <div className="form-control">
          <label></label>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default BasicForm;
