
const dummydata = [{
  username: "Data",
  password: "hunter2"
},
{
  username: "Data1",
  password: "hunter2"
},
{
  username: "Data2",
  password: "hunter2"
},
]



export const login = (req, res) => {
  
  const { username, password } = req.body;

  const user = dummydata.find((u) => u.username === username);

  if (!user) { 
    return res.status(404).json({message: "user not found"});
  }

  if (user.password !== password) {
    return res.status(401).json({ message: "Invalid credentials"});
  }

  return res.status(200).json({ message: "Login success"});
};

export const logout = (req, res) => {
  return res.status(200).json({ message: "Logout succesful"});
}

export const signup = (req, res) => {
  // Move real data from user-controller to here.
  return res.status(200).json({ message: "Signup success"});
}