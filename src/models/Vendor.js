import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const { Schema } = mongoose;

const vendorSchema = new Schema({
    category: { type: String },
    vendorNo: { type: String },
    officialEmail: { type: String },
    officialNumber: { type: String },
    status: { type: String },
    profile: { type: Schema.Types.ObjectId, ref: "Profile" },
    services: [{ type: Schema.Types.ObjectId, ref: "Service" }],
    verified: { type: Boolean, default: false },
}, {
    collection: "demo_vendors",
    versionKey: false
});

vendorSchema.plugin(mongoosePaginate);

const Vendor = mongoose.model("Vendor", vendorSchema);

export default Vendor;
