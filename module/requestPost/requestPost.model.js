import mongoose from "mongoose";

const schema = mongoose.Schema;

var requestPostSchema = new schema({
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
    required: false
  },
  bloodType: {
    type: String,
    required: false
  },
  amount: {
    type: String,
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
    required: true ,
    default : "true"
  },
  referenceNumber: {
    type: String,
    required: false ,
    default : "123456789"
  },
  userId: {
    type: schema.Types.ObjectId,
    required: true,
    ref: 'user'
  }
});


const requestPostModel = mongoose.model("requestPost", requestPostSchema);
export { requestPostModel };
