const mongoose = require("mongoose");

const borrowSchema = new mongoose.Schema(
  {
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },

    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },

    message: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["requested", "approved", "rejected", "returned"],
      default: "requested",
    },

    dueDate: {
      type: Date,
    },

    returnDate: {
      type: Date,
    },
  },
  { timestamps: true },
);

const BorrowRequest = mongoose.model("BorrowREQ", borrowtSchema);

module.exports = BorrowRequest;
