export const validate = (value, type) => {
  var check = false;
  switch (type) {
    case "email":
      check = value
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
      break;
    case "password":
      check = value.match(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
      );
      break;
    case "confirmation":
      check = user.password === user.password_confirmation;
      break;
    case "phone":
      check = user.phone.match(/(84|0[3|5|7|8|9])+([0-9]{8})\b/);
      break;
    case "full_name":
      check = user.full_name.match(/^.{6,}$/);
      break;
  }
  return !check;
};

export const validateAll = () => {
  return user.id
    ? user.full_name &&
        user.email &&
        user.address &&
        user.phone &&
        !(
          validate(user.email, "email") &&
          validate(user.phone, "phone") &&
          validate(user.full_name, "full_name")
        )
    : user.full_name &&
        user.email &&
        user.password &&
        user.password_confirmation &&
        user.address &&
        user.phone &&
        !(
          validate(user.email, "email") &&
          validate(user.password, "password") &&
          validate(user.password_confirmation, "confirmation") &&
          validate(user.full_name, "full_name") &&
          validate(user.phone, "phone")
        );
};
