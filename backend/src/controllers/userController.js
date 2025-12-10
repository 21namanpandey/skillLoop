const User = require("../models/User");

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-passwordHash");
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

exports.updateMe = async (req, res) => {
  try {
    const { bio, location, walletAddress, skillsOffer, skillsNeed } = req.body;

    const updateData = {};
    if (bio !== undefined) updateData.bio = bio;
    if (location !== undefined) updateData.location = location;
    if (walletAddress !== undefined) updateData.walletAddress = walletAddress;
    if (skillsOffer !== undefined) updateData.skillsOffer = skillsOffer;
    if (skillsNeed !== undefined) updateData.skillsNeed = skillsNeed;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    ).select("-passwordHash");

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-passwordHash -email")
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error("Get user by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("name bio location skillsOffer totalHoursProvided totalSessions rating")
      .lean();

    res.json({
      success: true,
      users
    });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

exports.getServices = async (req, res) => {
  try {
    const { category, search, mode } = req.query;
    const currentUserId = req.user?.id;
    
    let query = User.find({ 'skillsOffer.0': { $exists: true } });
    
    // Apply filters
    if (category) {
      query = query.where('skillsOffer.category').equals(category);
    }
    
    if (search) {
      query = query.where('skillsOffer.serviceName').regex(new RegExp(search, 'i'));
    }
    
    if (mode) {
      query = query.where('skillsOffer.mode').equals(mode);
    }
    
    const users = await query
      .select("name bio location skillsOffer totalHoursProvided totalSessions rating _id")
      .lean();
    
    const filteredUsers = currentUserId 
      ? users.filter(user => user._id.toString() !== currentUserId)
      : users;
    
    const services = filteredUsers.flatMap(user => 
      user.skillsOffer.map(service => ({
        service,
        provider: {
          id: user._id,
          name: user.name,
          bio: user.bio,
          location: user.location,
          totalHoursProvided: user.totalHoursProvided,
          totalSessions: user.totalSessions,
          rating: user.rating
        }
      }))
    );
    
    res.json({
      success: true,
      services,
      total: services.length
    });
  } catch (error) {
    console.error("Get services error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};