import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";

export const getUsersforSidebar = async (req, res) => {
  try {
    const loggedinUserId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: loggedinUserId } }).select("-password");
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersforSidebar", error.message);
    res.status(500).json({ error: "internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("error in getMessages controller", error.message);
    res.status(500).json({ error: "internal server error" });
  }
};

export const sendMessages = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    // ✅ Emit message using socket.io
    const io = req.app.get("io");
    io.emit("newMessage", newMessage); // broadcast to all clients

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("❌ Error in sendMessages:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
