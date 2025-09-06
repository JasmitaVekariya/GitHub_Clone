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
    content: [{
        type: String,
    },],
    visibility:{
        type: Boolean,
    },
    issues: [{
        type: Schema.Types.ObjectId,
        ref: "Issue",
    }],
    // Timestamp:true

});

const Repository = mongoose.model("Repository", RepositorySchema);

module.exports = Repository;