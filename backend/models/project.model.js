const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    color: {
        type: String,
        default: 'Charcoal'
    },
    layout: {
        type: String,
        default: 'list'
    },
    isFavorite: {
        type: Boolean,
        default: false
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);