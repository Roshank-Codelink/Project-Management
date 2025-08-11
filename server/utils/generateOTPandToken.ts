const jwt = require('jsonwebtoken');

export const generateOTPandToken = async (
  Userdata: object,
  PrivateKey: string,
  ExpireTime: string
) => {
  let OTP = Math.floor(Math.random() * 900000) + 100000;

  const token: string = jwt.sign({ Userdata, OTP }, PrivateKey, {
    expiresIn: ExpireTime,
  });

  return { OTP, token };
};
