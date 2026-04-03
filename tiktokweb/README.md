# TikTok Web - Login Form

## Project Description
This project is a simple web application created using Next.js and React. The main goal of this assignment was to build a login form and understand how form handling works in a React application. React Hook Form was used to manage form inputs, perform validation, and handle form submission. A loading state was also added to improve the user experience when the form is submitted.

## Features
- Login form with email and password fields
- Form validation using React Hook Form
- Error messages displayed when inputs are invalid
- Form submission handling
- Loading state to prevent multiple submissions

## Technologies Used
- Next.js
- React
- React Hook Form
- JavaScript

## Form Validation
The form checks whether the required fields are filled before allowing submission.  
Both the email and password fields must be entered. If any field is empty, an error message will appear to inform the user.

## Loading State
When the user submits the form:
- The login button is temporarily disabled
- A loading message appears
- After a short delay, a success message is displayed

This helps prevent the user from submitting the form multiple times.

## How to Run the Project
1. First install the project dependencies:
