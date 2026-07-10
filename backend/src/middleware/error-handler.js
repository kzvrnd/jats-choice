export const errorHandler = (err, req, res, next) => {
  console.error(err); 

  //expected errors
  if ((err.isOperational)) {
    return res.status(err.statusCode).json({ success: false, message: err.message });
  }  
  
  //unexpected errors
  return res.status(500).json({ success: false, message: "Oops something went wrong" });

}
