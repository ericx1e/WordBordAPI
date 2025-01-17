const mongoose = require('mongoose')
const Filter = require('bad-words')

const schema = new mongoose.Schema({
    name: { type: String, required: true },
    score: { type: Number, required: true },
    createdAt: { type: Date, expires: '86400', default: Date.now }
})

schema.pre('save', function (next) {
    let _this = this
    _this.name = _this.name.trim()
    let filter = new Filter()
    if (filter.isProfane(_this.name) || _this.name.length > 6 || _this.name.length == 0) {
        next(new Error("Name not allowed."))
    } else next()
})

module.exports = mongoose.model('Score', schema)