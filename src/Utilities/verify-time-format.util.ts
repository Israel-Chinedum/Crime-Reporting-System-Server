class VerifyTimeFormat {
  isTimeFormat(value: string) {
    const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s(AM|PM)$/;
    if (!timeRegex.test(value)) {
      return false;
    }
    return true;
  }
}

export const verifyTimeFormat = new VerifyTimeFormat();
