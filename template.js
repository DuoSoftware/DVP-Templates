/**
 * Created by Pawan on 7/12/2016.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var fileSchema = mongoose.Schema(
    {
        subject: { type: String},
        content : { type: String}

    }

);
var templateSchema = mongoose.Schema(
    {
        name      : { type: String},
        filetype : { type: String,enum:["html","text"],default:"text", required:true},
        content : fileSchema,
        company: { type: Number, require:true},
        tenant: { type: Number, require:true},
        styles: [fileSchema]
    });



templateSchema.index({ company: 1, tenant: 1,name: 1}, { unique: true });
var Template = mongoose.model('template', templateSchema);
module.exports.Template = Template;
