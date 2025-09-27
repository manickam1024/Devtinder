const mongoose = require("mongoose");

const connectionSchema = new mongoose.Schema(
  {
    fromid: { type: mongoose.Schema.Types.ObjectId, required: true },
    toid: { type: mongoose.Schema.Types.ObjectId, required: true },
    status: { type: String },
  },
  { timestamps: true },
);

connectionSchema.pre("save", async function (next) {
  // this can be done at api level itself ,but you u give request from other api u need to validate or rewrite again
  try {
    const document = this;

    const res = document.status === "intrested" || "notIntrested";

    res &&
      (async () => {
        if (document.fromid.toString() === document.toid.toString()) {
          // checks if from and to is equal
          // or .equals()
          const err = new Error(
            "cannot send request to yourself msg from:  connectionschema pre hook",
          );
          return next(err); // stops save
        }

        const exists = await Connection.findOne({
          $or: [
            { fromid: document.fromid, toid: document.toid }, // if request exists already from sender side
            { fromid: document.toid, toid: document.fromid }, // if request exists already from recevier side
          ],
        });

        if (exists) {
          const err = new Error(
            "Duplicate request msg from: connectionschema pre hook",
          );
          return next(err); // stops save
        }

        next();
      });
  } catch (err) {
    console.log("error at connectionSchema.js");

    next(err); // unexpected errors
  }
});

const Connection = mongoose.model("Connection", connectionSchema);
module.exports = Connection;
