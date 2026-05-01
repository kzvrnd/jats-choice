export const errorHandler = (err, req, res, next) => {
  console.error(err); 

  const statusCode = err.statusCode || 500;
  //res.status(statusCode).json({ error: err.message || "Something went wrong" });
  const message = err.message || "Internal server error";

  res.status(statusCode).json({ success: false, message: message });

}