const { Schema } = require('mongoose');
const { emailStatus, emailType } = require('../../enums.js');


// Setup an Email Model
const emailSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: Object.values(emailStatus),
    default: emailStatus.pending
  },
  email_type: {
    type: String,
    enum: Object.values(emailType),
    required: true
  },
  content: {
    type: {
      resetLink: {
        type: String,
        default: ''
      },
      userAgents: {
        os: {
          type: String,
          default: ''
        },
        browser: {
          type: String,
          default: ''
        }
      }
    }
  }
}, { timestamps: true });


module.exports = emailSchema;
