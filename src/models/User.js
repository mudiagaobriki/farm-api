import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const { Schema } = mongoose;

const userSchema = new Schema(
    {
        email: { type: String, unique: true },
        username: { type: String, unique: true },
        phone: { type: String, unique: true },
        password: { type: String },
        loginToken: { type: String },
        type: { type: String, default: "user" },
        status: { type: String },
        profile: { type: Schema.Types.ObjectId, ref: "Profile" },
        emailVerifiedAt: { type: Date },
        verified: { type: Boolean, default: false },
        phoneVerified: { type: Boolean },
        is2faEnabled: { type: Boolean, default: false },
        typeOf2fa: { type: String },
        otpCode: { type: String },
        pin: { type: String },
        isDeleted: { type: Boolean, default: false },
    },
    {
        collection: "users",
        versionKey: false,
    }
);

userSchema.plugin(mongoosePaginate);

const User = mongoose.model("User", userSchema);

export default User;
