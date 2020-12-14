import mongoose from "mongoose";

const schema = mongoose.Schema;

const userSchema = new schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: false
  },
  lastName: {
    type: String,
    required: false
  },
  mobileNumber: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  activation_key: {
    type: String,
    required: false
  },
  is_active: {
    type: Boolean,
    default: false
  }

});

const userModel = mongoose.model("user", userSchema);
export { userModel };