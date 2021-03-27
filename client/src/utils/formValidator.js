export const required = (value) =>
  !value || (value && value.trim() === '') ? 'Required' : undefined;

export const email = (value) =>
  value &&
  !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    value
  )
    ? 'Invalid email address'
    : undefined;

export const minLength = (min) => (value) =>
  value && value.length < min
    ? `Must be at least ${min} characters `
    : undefined;
