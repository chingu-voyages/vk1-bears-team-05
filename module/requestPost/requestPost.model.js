import mongoose from "mongoose";

const schema = mongoose.Schema;

var requestPostSchema = new schema({
  profileId: {
    type: schema.Types.ObjectId,
    required: true,
    ref: 'profile'
  },
  title: {
    type: String,
    required: true
  },
  story: {
    type: String,
    required: true
  },
  photo: {
    type: String,
    required: true
  },
  bloodType: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  closingDate: {
    type: Date,
    required: true
  },
  hospital: {
    type: String,
    required: true
  },
  status: {
    type: Boolean,
    required: true
  },
  referenceNumber: {
    type: String,
    required: true
  }
});


const requestPostModel = mongoose.model("requestPost", requestPostSchema);
export { requestPostModel };
