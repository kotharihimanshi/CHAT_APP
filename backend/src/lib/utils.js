import jwt from 'jsonwebtoken';

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "11d"
  });

  res.cookie("jwt", token, {
    maxAge: 11 * 24 * 60 * 60 * 1000, // 11 days
    httpOnly: true,
    sameSite: "lax",  // ✅ Works for both dev and prod unless you're doing cross-site requests
    secure: false,  // ✅ Secure only in prod (HTTPS)
  });

  return token;
};
