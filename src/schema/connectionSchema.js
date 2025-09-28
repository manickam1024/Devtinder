const mongoose = require("mongoose");

const connectionSchema = new mongoose.Schema(
  {
    fromid: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
    toid: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
    toname: {
      type: String,
      required: true,
    },
    status: { type: String },
  },
  { timestamps: true }
);

connectionSchema.pre("save", async function (next) {
  const document = this;

  if (document.status === "interested" || document.status === "notInterested") {
    if (document.fromid.toString() === document.toid.toString()) {
      const err = new Error("Cannot send request to yourself");
      return next(err); // ✅ exits here, no further code runs
    } else {
      const exists = await Connection.findOne({
        $or: [
          { fromid: document.fromid, toid: document.toid },
          { fromid: document.toid, toid: document.fromid },
        ],
      });

      if (exists) {
        const err = new Error("Duplicate request");
        return next(err); // ✅ exits here too
      } else {
        next(); // ✅ called only once
      }
    }
  }
});

const Connection = mongoose.model("Connection", connectionSchema);
module.exports = Connection;
