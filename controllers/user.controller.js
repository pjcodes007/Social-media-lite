import User from "../models/user.model.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

export const signUp = async (req, res) => {
    try {
        const { username, email, password, dob } = req.body;

        if (!username || !email || !password || !dob) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const userExists = await User.findOne({ $or: [{ email }, { username }] });

        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            dob
        });

        return res.status(201).json({
            username: newUser.username,
            email: newUser.email,
            dob: newUser.dob,
            token: generateToken(newUser._id)
        });

    } catch (err) {
        console.error(err);
        return res.status(400).json({ message: "Registration unsuccessful ❌", error: err.message });
    }
}

export const Login = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if ((!username && !email) || !password) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const user = await User.findOne({ $or: [{ email }, { username }] });

        if (!user) {
            return res.status(400).json({ message: 'User not found ❌' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Incorrect password ❌' });
        }

        return res.status(200).json({
            message: "Login Successful ✅",
            token: generateToken(user._id),
            user: {
                id: user._id,
                username : User.username,
                email : User.email,
            }
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Login unsuccessful ❌", error: err.message });
    }
}


export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.username    = req.body.username    || user.username;
    user.bio         = req.body.bio         || user.bio;
    user.avatar      = req.body.avatar      || user.avatar;
    user.email       = req.body.email       || user.email;
    user.access      = req.body.access      || user.access;

    if (req.body.password && req.body.password.length >= 6) {
      user.password = await bcrypt.hash(req.body.password, 10);
    }

    await user.save();

    res.json({
      message: "Profile updated",
      user: {
        _id:         user._id,
        username:    user.username,
        email:       user.email,
        dob:         user.dob,
        access:      user.access,
        avatar:      user.avatar,
        bio:         user.bio,
        followers:   user.followers,
        following:   user.following,
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Profile update failed", error: error.message });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: "Invalid user ID" });
  }
};


export const followUserByUsername = async (req, res) => {
  try {


    const target = await User.findOne({ username: req.params.username });
    if (!target) return res.status(404).json({ message: "User not found" });

    const current = await User.findById(req.user.id);

    if (!target.followers.includes(current.id)) {
      target.followers.push(current.id);
      await target.save();
    }
    if (!current.following.includes(target.id)) {
      current.following.push(target.id);
      await current.save();
    }
    res.json({ message: "User followed" });
  } catch (error) {
    res.status(500).json({ message: "Follow failed", error: error.message });
  }
};

export const unfollowUserByUsername = async (req, res) => {
  try {

    const target = await User.findOne({ username: req.params.username });
    if (!target) return res.status(404).json({ message: "User not found" });

    const current = await User.findById(req.user.id);

    target.followers = target.followers.filter(
      (id) => id.toString() !== current.id.toString()
    );
    await target.save();

    current.following = current.following.filter(
      (id) => id.toString() !== target.id.toString()
    );
    await current.save();

    res.json({ message: "User unfollowed" });
  } catch (error) {
    res.status(500).json({ message: "Unfollow failed", error: error.message });
  }
};
