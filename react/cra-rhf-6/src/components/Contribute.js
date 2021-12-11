import React, { useState } from "react";
import { useHistory } from "react-router-dom";
// import { useData } from "./DataContext";
import Typography from "@material-ui/core/Typography";
import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers";
import { PrimaryButton } from "./PrimaryButton";
import { MainContainer } from "./MainContainer";
import { Form } from "./Form";
import { Input } from "./Input";
import { InputTwo } from "./InputTwo";
import * as yup from "yup";

const CALC_API =
  "https://ufrhomrfoj.execute-api.us-east-1.amazonaws.com/dev/contribute";

const schema = yup.object().shape({
  firstName: yup
    .string()
    .matches(/^([^0-9]*)$/, "First name should not contain numbers")
    .required("First name is a required field"),
  lastName: yup
    .string()
    .matches(/^([^0-9]*)$/, "Last name should not contain numbers")
    .required("Last name is a required field"),
});

export const Contribute = () => {
  // const { setValues, data } = useData();
  const history = useHistory();
  const { register, handleSubmit, errors } = useForm({
    mode: "onBlur",
    validationSchema: schema,
  });
  const [dats, setDats] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = (data) => {
    console.log("form values", data);
    //setButtonClicked(false);
    //setLoading(true);
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
    <MainContainer>
      <Typography component="h2" variant="h5">
        Contribute
      </Typography>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Input
          ref={register}
          id="fullName"
          type="text"
          label="Full Name"
          name="fullName"
          error={!!errors.firstName}
          helperText={errors?.firstName?.message}
        />
        <Input
          ref={register}
          id="email"
          type="text"
          label="Email"
          name="email"
          error={!!errors.firstName}
          helperText={errors?.firstName?.message}
        />
        <Input
          ref={register}
          id="phone"
          type="text"
          label="Phone"
          name="phone"
          error={!!errors.firstName}
          helperText={errors?.firstName?.message}
        />
        <Input
          ref={register}
          id="message"
          type="text"
          label="Message"
          name="message"
          error={!!errors.firstName}
          helperText={errors?.firstName?.message}
        />
        <PrimaryButton>Next</PrimaryButton>
      </Form>
    </MainContainer>
  );
};
