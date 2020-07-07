import * as yup from "yup";

export const contactFormSchema = yup.object().shape({
    email: yup
      .string()
      .email("Please enter a valid email.")
      .required("Email is required.")      
      .max(150,"Email must be at most 150 characters long.")
      .min(2,"Email must be at least 2 characters long."),
    name: yup
      .string()
      .required("Your name is required.")
      .max(150,"Name must be at most 150 characters long.")
      .min(2,"Name must be at least 2 characters long."),
    body: yup
      .string()
      .required("A message body is required.")
      .max(30000,"Body must be at most 30000 characters long.")
      .min(10,"Body must be at least 10 characters long."),
})