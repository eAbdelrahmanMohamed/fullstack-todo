import React from "react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import Joi from "joi";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { register } from "../redux/authSlice";
import { AppDispatch } from "../redux/store"; // Import AppDispatch

// Define types for form values
interface FormValues {
  email: string;
  password: string;
}

// Define validation schema with Joi
const schema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).required().messages({
    "string.base": "Email is required",
    "string.email": "Invalid email address",
  }),
  password: Joi.string().min(6).required().messages({
    "string.base": "Password is required",
    "string.min": "Password must be at least 6 characters",
  }),
});

// Validate function for Formik
const validate = (values: FormValues) => {
  const errors: Partial<FormValues> = {};

  const { error: emailError } = schema.extract("email").validate(values.email);
  if (emailError) errors.email = emailError.details[0].message;

  const { error: passwordError } = schema.extract("password").validate(values.password);
  if (passwordError) errors.password = passwordError.details[0].message;

  return errors;
};

const RegisterPage = () => {
    const dispatch = useDispatch<AppDispatch>(); // Type the dispatch here
    const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center h-screen bg-gray-200">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4 text-center">Register</h2>
        <Formik
          initialValues={{ email: "", password: "" }}
          validate={validate}
          onSubmit={async (values: FormValues, { setSubmitting, setErrors }: FormikHelpers<FormValues>) => {
            try {
              // unwrap() to handle async errors
              await dispatch(register(values)).unwrap();
              navigate("/login");
            } catch (errMessage: any) {
              setErrors({ email: errMessage, password: errMessage });
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {() => (
            <Form className="flex flex-col">
              <Field
                type="email"
                name="email"
                placeholder="Email"
                className="p-2 border rounded mb-2"
              />
              <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />

              <Field
                type="password"
                name="password"
                placeholder="Password"
                className="p-2 border rounded mb-2"
              />
              <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />

              <button type="submit" className="bg-blue-500 text-white p-2 rounded mt-2">
                Register
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default RegisterPage;
