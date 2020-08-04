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

export const referralFormSchema = yup.object().shape({
  refereeFirstName: yup
    .string()
    .required("Their first name is required.")
    .max(150,"Name must be at most 150 characters long.")
    .min(2,"Name must be at least 2 characters long."),
  refereeLastName: yup
    .string()
    .required("Their last name is required.")
    .max(150,"Name must be at most 150 characters long.")
    .min(2,"Name must be at least 2 characters long."),
  refereePhone: yup
    .string()
    .required("Their phone number is required."),
  refereeEmail: yup
    .string()
    .email("Please enter a valid email.")      
    .max(150,"Email must be at most 150 characters long.")
    .min(2,"Email must be at least 2 characters long."),
  relation: yup
    .string()
    .max(400,"Field can be at most 400 characters long.")
    .min(2,"Field must be at least 2 characters long."),
  referrerFirstName: yup
    .string()
    .max(150,"Name must be at most 150 characters long.")
    .min(2,"Name must be at least 2 characters long."),
  referrerLastName: yup
    .string()
    .max(150,"Name must be at most 150 characters long.")
    .min(2,"Name must be at least 2 characters long."),
  referrerPhone: yup
    .string()
    .required("Your phone number is required."),
  referrerEmail: yup
    .string()
    .email("Please enter a valid email.")
    .max(150,"Email must be at most 150 characters long.")
    .min(2,"Email must be at least 2 characters long."),
  salesRep: yup
    .string()
    .max(100,"Sales rep can be at most 100 characters long.")
    .min(2,"Sales rep must be at least 2 characters long."),
})


export const solarQuoteFormSchema = yup.object().shape({
  firstName: yup
    .string()
    .required("Your first name is required.")
    .max(150,"Name must be at most 150 characters long.")
    .min(2,"Name must be at least 2 characters long."),
  lastName: yup
    .string()
    .required("Your last name is required.")
    .max(150,"Name must be at most 150 characters long.")
    .min(2,"Name must be at least 2 characters long."),
  phone: yup
    .string()
    .required("Your phone number is required."),
  email: yup
    .string()
    .email("Please enter a valid email.")      
    .max(150,"Email must be at most 150 characters long.")
    .min(2,"Email must be at least 2 characters long."),
  zip: yup
    .string()
    .max(10, "ZIP should be less than 10 digits."),
  business: yup
    .string()
    .max(150,"Field can be at most 400 characters long.")
    .min(2,"Field must be at least 2 characters long."),
  averageBill: yup.string(),
  shaded: yup.string(),
  solarReasons: yup.string(),
  billUrl: yup.string().url("Not a valid URL. Example: https://www.website.com"),
  password: yup
    .string()
    .max(50,"Too long")
    .min(8,"Too short"),
  confirmPassword: yup
    .string()
    .max(50,"Too long")
    .min(8,"Too short")
})

export const logInSchema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter an valid email")
    .required("Email is required."),
  password: yup
    .string()
    .required("Password is required.")
    .max(50, "Too long")
    .min(6, "Too short")
});