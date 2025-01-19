const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const staffSchema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  status: {
    type: String,
    enum: ["admin", "staff", "none"],
    default: "none",
  },
  createdOn: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Staff", staffSchema);
