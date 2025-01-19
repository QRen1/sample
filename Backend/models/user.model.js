const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdOn: { type: Date, default: Date.now },
  cart: [
    {
      // Array to store cart items for each user
      itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
        required: true,
      }, // Reference to the service or product
      quantity: { type: Number, default: 1 },
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
