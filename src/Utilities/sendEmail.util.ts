import { InternalServerErrorException } from '@nestjs/common';
import nodemailer from 'nodemailer';

export const sendMail = async ({
  otp,
  email,
  successMsg,
  errMsg,
}: {
  otp: string;
  email: string;
  successMsg: string;
  errMsg: string;
}) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'mytechstudio081@gmail.com',
      pass: 'pooe hnka ehsk mirk',
    },
  });

  try {
    await transporter.sendMail({
      from: 'mytechstudio081@gmail.com',
      to: email,
      subject: 'FPOG CRIME REPORTING SYSTEM',
      text: `Your OTP is: ${otp}`,
    });

    return { message: successMsg };
  } catch (error) {
    console.log(error);
    throw new InternalServerErrorException(errMsg);
  }
};
