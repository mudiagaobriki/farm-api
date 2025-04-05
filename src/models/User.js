const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true },
    password: { type: String },
    loginToken: { type: String },
    type: { type: String },
    status: { type: String },
    profile: { type: mongoose.Schema.Types.ObjectId, ref: "Profile" },
    emailVerifiedAt: { type: Date },
    verified: { type: Boolean, default: false },
    phoneVerified: { type: Boolean },
    isDeleted: { type: Boolean, default: false },
  },
  {
    collection: "demo_users",
    versionKey: false,
  }
);

userSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("User", userSchema);
