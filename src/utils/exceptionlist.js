const connectionSchema = require("../schema/connectionSchema");

const exceptionList = async (req, res) => {
  try {
    userid = req.user._id;
    const exceptionList = [];

    // getting all the users
    const connections = await connectionSchema.find({
      // this fetchs all the connections ,here $or is used because the the request might be sent from either of users and aceepted
      $or: [{ fromid: userid }, { toid: userid }],
    });

    // here im just the following pushing cases to the expectionList to
    //request intrested
    //request not intrested
    //request accepted
    //requested rejected

    //ill exclude only the request i received because it can be feeded again

    connections.map((p) => {
      // here i map because to push users tht comes in cases.
      if (p.fromid.equals(userid)) {
        //to find the users
        exceptionList.push(p.toid);
      } else {
        if (p.status !== "interested") {
          // The purpose of if condition is it should not put the person who sent me connection to exception list
          exceptionList.push(p.fromid);
        }
      }
    });

    exceptionList.push(userid); // i need to add even myself to the exceptionlist

    return exceptionList;
  } catch (err) {
    console.log("error from" + __filename + err);
    res.status(400).send(err);
  }
};

module.exports = exceptionList;
