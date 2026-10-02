export const errorHandler = (err, req, res, next) => { 

  //expected errors
  if ((err.isOperational)) {
    return res.status(err.statusCode).json({ success: false, message: err.message });
  }  
  
  //unexpected errors
  console.error(err);
  return res.status(500).json({ success: false, message: "Oops something went wrong" });

}
