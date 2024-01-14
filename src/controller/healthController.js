export const healthCheck = (req, res, next) => {
  res.send("HELLO, I'm Healthy! NODE_ENV = " + process.env.NODE_ENV);
};
