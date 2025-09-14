const mongoose = require("mongoose");
const {Schema} = mongoose;

const RepositorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        default: "",
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    stars: {
      type: Number,
      default: 0,
    },
    content: [{
        type: String,
    }],
    visibility:{
        type: Boolean,
    },
    issues: [{
        type: Schema.Types.ObjectId,
        ref: "Issue",}]

});

const Repository = mongoose.model("Repository", RepositorySchema);

module.exports = Repository;