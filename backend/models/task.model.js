// models/task.model.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    dueDate: Date,
    status: {
        type: String,
        default: 'pending',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    completed: {
        type: Boolean,
        default: false,
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // Liên kết với model User
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        default: null
    },
    priority: {
        type: Number,
        default: 4
    },
},{ timestamps: true });

module.exports = mongoose.model('Task', taskSchema);