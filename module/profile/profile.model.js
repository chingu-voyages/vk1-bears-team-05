import mongoose from "mongoose";

const schema = mongoose.Schema;

const profileSchema = new schema({

  userId: {
    type: schema.Types.ObjectId,
    required: true,
    ref: 'user'
  },
  photo: {
    type: String,
    required: true
  },
  userAbout: {
    type: String,
    required: true
  },
  bloodType: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  lastTimeDonated: {
    type: String,
    required: true
  }
});


const profileModel = mongoose.model("profile", profileSchema);
export { profileModel };
