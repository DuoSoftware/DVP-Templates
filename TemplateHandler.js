/**
 * Created by Pawan on 7/13/2016.
 */
var mongoose = require("mongoose");
var Template = require("./template.js").Template;
var dust = require("dustjs-linkedin");
var juice = require("juice");
var logger = require("dvp-common-lite/LogHandler/CommonLogHandler.js").logger;
var messageFormatter = require("dvp-common-lite/CommonMessageGenerator/ClientMessageJsonFormatter.js");
var async = require("async");

function CreateTemplate(req, res) {
  var styles = [];
  var jsonString;
  var company = parseInt(req.user.company);
  var tenant = parseInt(req.user.tenant);
  var fileType = req.body.FileType;

  if (fileType == "html") {
    for (var i = 0; i < req.body.StyleFiles.length; i++) {
      styles.push({ content: req.body.StyleFiles[i] });
    }
  }

  var TemplateObject = Template({
    name: req.body.TemplateName,
    filetype: req.body.FileType,
    content: {
      content: req.body.TemplateContent,
      subject: req.body.TemplateSubject,
    },
    company: company,
    tenant: tenant,
    styles: styles,
  });

  TemplateObject.save(function (errSave, resSave) {
    if (errSave) {
      jsonString = messageFormatter.FormatMessage(
        errSave,
        "Template saving failed",
        false,
        undefined
      );
    } else {
      jsonString = messageFormatter.FormatMessage(
        undefined,
        "Template saving succeded",
        true,
        resSave
      );
    }
    res.end(jsonString);
  });

  /*for(var i=0;i<req.body.StyleFiles.length;i++)
     {

     if(i==req.body.StyleFiles.length-1)
     {
     var TemplateObject = Template
     ({
     name      : req.body.TemplateName,
     filetype : req.body.FileType,
     content : {content:req.body.TemplateContent},
     company: company,
     tenant: tenant,
     styles: styles
     });

     TemplateObject.save(function (errSave,resSave) {
     if(errSave)
     {
     jsonString=messageFormatter.FormatMessage(errSave, "Template saving failed", false, undefined);

     }
     else
     {
     jsonString=messageFormatter.FormatMessage(undefined, "Template saving succeded", true, resSave);

     }
     res.end(jsonString);
     });
     }
     }
     */

  /* var TemplateSample = Template({
     name:tempName,
     filetype:tempType,
     content:content
     });

     TemplateSample.save(function (errNewCategory, resNewCategory) {
     if(errNewCategory)
     {
     // jsonString=messageFormatter.FormatMessage(errNewCategory, "Tag category creation failed", false, undefined);
     }
     else
     {
     //jsonString=messageFormatter.FormatMessage(undefined, "Tag category creation succeeded", true, resNewCategory);
     }
     console.log("Error "+errNewCategory);
     console.log("Response "+resNewCategory);


     });*/
}

function RenderTemplate(req, res) {
  console.log("Rendering starts");
  var HtmlTemplate = req.params.template;
  var jsonString;
  var company = parseInt(req.user.company);
  var tenant = parseInt(req.user.tenant);
  console.log(req.body);

  PickTemplate(HtmlTemplate, company, tenant, function (
    errPickTemp,
    resPickTemp
  ) {
    if (errPickTemp) {
      jsonString = messageFormatter.FormatMessage(
        errPickTemp,
        "Template rendering failed",
        false,
        undefined
      );
      res.end(jsonString);
    } else {
      if (resPickTemp) {
        var compiled = dust.compile(resPickTemp.content.content, "hello");
        dust.loadSource(compiled);
        dust.render("hello", req.body.Parameters, function (
          errRendered,
          outRendered
        ) {
          if (errRendered) {
            console.log("Rendering Done");
            jsonString = messageFormatter.FormatMessage(
              errRendered,
              "Template rendering failed",
              false,
              undefined
            );
            res.end(jsonString);
          } else {
            // res.end(outRendered);
            console.log(resPickTemp.styles.length);

            var renderedTemplate = "";
            var juiceOptions = {
              applyStyleTags: true,
            };

            if (resPickTemp.styles.length > 0) {
              for (var i = 0; i < resPickTemp.styles.length; i++) {
                if (i == 0) {
                  renderedTemplate = outRendered;
                }

                console.log(resPickTemp.styles[i].content);

                renderedTemplate = juice.inlineContent(
                  renderedTemplate,
                  resPickTemp.styles[i].content,
                  juiceOptions
                );
                if (i == resPickTemp.styles.length - 1) {
                  //  jsonString=messageFormatter.FormatMessage(undefined, "Template rendering succeeded", true, renderedTemplate.toString());
                  console.log("HTML Rendering Done");
                  res.end(renderedTemplate);
                }
              }
            } else {
              console.log(" Rendering Done");
              jsonString = messageFormatter.FormatMessage(
                undefined,
                "Rendering succeeded",
                true,
                outRendered
              );
              console.log(jsonString);
              res.end(outRendered);
            }
          }
        });
      } else {
        console.log("Rendering Done");
        jsonString = messageFormatter.FormatMessage(
          new Error("Invalid template name"),
          "Invalid template name",
          fales,
          undefined
        );
        res.end(jsonString);
      }
    }
  });
}

function PickTemplateById(req, res) {
  var jsonString;
  var company = parseInt(req.user.company);
  var tenant = parseInt(req.user.tenant);
  Template.findOne(
    { _id: req.params.id, company: company, tenant: tenant },
    function (errPickTemplate, resPickTemplate) {
      if (errPickTemplate) {
        jsonString = messageFormatter.FormatMessage(
          errPickTemplate,
          "Template picking failed",
          false,
          undefined
        );
      } else {
        if (resPickTemplate) {
          jsonString = messageFormatter.FormatMessage(
            undefined,
            "Template picking succeeded",
            true,
            resPickTemplate
          );
        } else {
          jsonString = messageFormatter.FormatMessage(
            new Error("No template found"),
            "Template picking failed",
            false,
            undefined
          );
        }
      }
      res.end(jsonString);
    }
  );
}

function PickTemplate(template, company, tenant, callback) {
  Template.findOne(
    { name: template, company: company, tenant: tenant },
    function (errPickTemplate, resPickTemplate) {
      callback(errPickTemplate, resPickTemplate);
    }
  );
}

function PickAllTemplates(req, res) {
  logger.debug("DVP-LiteTicket.PickAllTemplates Internal method ");
  var jsonString;
  var company = parseInt(req.user.company);
  var tenant = parseInt(req.user.tenant);
  Template.find({ company: company, tenant: tenant }, function (
    errPickTemplate,
    resPickTemplate
  ) {
    if (errPickTemplate) {
      jsonString = messageFormatter.FormatMessage(
        errPickTemplate,
        "Template picking failed",
        false,
        undefined
      );
    } else {
      if (resPickTemplate.length > 0) {
        jsonString = messageFormatter.FormatMessage(
          undefined,
          "Template picking succeeded",
          true,
          resPickTemplate
        );
      } else {
        jsonString = messageFormatter.FormatMessage(
          new Error("No template found"),
          "No template found",
          false,
          undefined
        );
      }
    }
    res.end(jsonString);
  });
}

function PickTemplatesByFileType(req, res) {
  logger.debug("DVP-LiteTicket.PickTemplatesByFileType Internal method ");
  var jsonString;
  var company = parseInt(req.user.company);
  var tenant = parseInt(req.user.tenant);
  Template.find(
    { company: company, tenant: tenant, filetype: req.params.filetype },
    function (errPickTemplate, resPickTemplate) {
      if (errPickTemplate) {
        jsonString = messageFormatter.FormatMessage(
          errPickTemplate,
          "Template picking failed",
          false,
          undefined
        );
      } else {
        if (resPickTemplate.length > 0) {
          jsonString = messageFormatter.FormatMessage(
            undefined,
            "Template picking succeeded",
            true,
            resPickTemplate
          );
        } else {
          jsonString = messageFormatter.FormatMessage(
            new Error("No template found"),
            "No template found",
            false,
            undefined
          );
        }
      }
      res.end(jsonString);
    }
  );
}

function RemoveTemplate(req, res) {
  var jsonString;
  var company = parseInt(req.user.company);
  var tenant = parseInt(req.user.tenant);
  Template.findOneAndRemove(
    { name: req.params.template, company: company, tenant: tenant },
    function (errRemove, resRemove) {
      if (errRemove) {
        jsonString = messageFormatter.FormatMessage(
          errRemove,
          "Template deletion failed",
          false,
          undefined
        );
      } else {
        jsonString = messageFormatter.FormatMessage(
          undefined,
          "Template deletion succeeded",
          true,
          resRemove
        );
      }
      res.end(jsonString);
    }
  );
}

function UpdateTemplateContent(req, res) {
  var jsonString;
  var company = parseInt(req.user.company);
  var tenant = parseInt(req.user.tenant);
  Template.findOne(
    { _id: req.params.id, company: company, tenant: tenant },
    function (errTemp, resTemp) {
      if (errTemp) {
        jsonString = messageFormatter.FormatMessage(
          errTemp,
          "Template selection failed",
          false,
          undefined
        );
        res.end(jsonString);
      } else {
        if (resTemp) {
          if (req.body.TemplateContent) {
            resTemp.content = { content: req.body.TemplateContent };
          }
          if (req.body.TemplateSubject) {
            resTemp.content.subject = req.body.TemplateSubject;
          }

          if (req.body.FileType) {
            resTemp.filetype = req.body.FileType;
          }

          Template.findOneAndUpdate(
            { _id: req.params.id, company: company, tenant: tenant },
            resTemp,
            function (errUpdate, resUpdate) {
              if (errUpdate) {
                jsonString = messageFormatter.FormatMessage(
                  errUpdate,
                  "Template update failed",
                  false,
                  undefined
                );
                res.end(jsonString);
              } else {
                jsonString = messageFormatter.FormatMessage(
                  undefined,
                  "Template update succeeded",
                  true,
                  resUpdate
                );
                res.end(jsonString);
              }
            }
          );
        } else {
          jsonString = messageFormatter.FormatMessage(
            new Error("Template not found"),
            "Template not found",
            false,
            undefined
          );
          res.end(jsonString);
        }
      }
    }
  );
}

function UpdateTemplateMainContent(req, res) {
  var jsonString;
  var company = parseInt(req.user.company);
  var tenant = parseInt(req.user.tenant);
  Template.findOne(
    { _id: req.params.id, company: company, tenant: tenant },
    function (errTemp, resTemp) {
      if (errTemp) {
        jsonString = messageFormatter.FormatMessage(
          errTemp,
          "Template selection failed",
          false,
          undefined
        );
        res.end(jsonString);
      } else {
        if (resTemp) {
          if (req.body.TemplateContent) {
            resTemp.content = { content: req.body.TemplateContent };
          }

          if (req.body.FileType) {
            resTemp.filetype = req.body.FileType;
          }

          Template.findOneAndUpdate(
            { _id: req.params.id, company: company, tenant: tenant },
            resTemp,
            function (errUpdate, resUpdate) {
              if (errUpdate) {
                jsonString = messageFormatter.FormatMessage(
                  errUpdate,
                  "Template update failed",
                  false,
                  undefined
                );
                res.end(jsonString);
              } else {
                jsonString = messageFormatter.FormatMessage(
                  undefined,
                  "Template update succeeded",
                  true,
                  resUpdate
                );
                res.end(jsonString);
              }
            }
          );
        } else {
          jsonString = messageFormatter.FormatMessage(
            new Error("Template not found"),
            "Template not found",
            false,
            undefined
          );
          res.end(jsonString);
        }
      }
    }
  );
}

function AddTemplateStyles(req, res) {
  var jsonString;
  var stylesObj = [];
  var company = parseInt(req.user.company);
  var tenant = parseInt(req.user.tenant);

  for (var i = 0; i < req.body.StyleFiles.length; i++) {
    stylesObj.push({ content: req.body.StyleFiles[i] });
    if (i == req.body.StyleFiles.length - 1) {
      console.log(stylesObj);
      Template.findOneAndUpdate(
        { _id: req.params.id, company: company, tenant: tenant },
        { $addToSet: { styles: { $each: stylesObj } } },
        function (errUpdate, resUpdate) {
          if (errUpdate) {
            jsonString = messageFormatter.FormatMessage(
              errUpdate,
              "Styles replacing failed",
              false,
              undefined
            );
            res.end(jsonString);
          } else {
            jsonString = messageFormatter.FormatMessage(
              undefined,
              "Styles replacing doe",
              true,
              resUpdate
            );
            res.end(jsonString);
          }
        }
      );
    }
  }
}

function UpdateStyleContent(req, res) {
  var jsonString;
  var styleId = req.params.sid;
  var tempId = req.params.id;
  var company = parseInt(req.user.company);
  var tenant = parseInt(req.user.tenant);

  Template.findOneAndUpdate(
    { _id: tempId, company: company, tenant: tenant, "styles._id": styleId },
    {
      $set: {
        "styles.$.content": req.body.StyleContent,
      },
    },
    function (errStyle, resStyle) {
      if (errStyle) {
        jsonString = messageFormatter.FormatMessage(
          errStyle,
          "Styles searching failed",
          false,
          undefined
        );
        res.end(jsonString);
      } else {
        if (!resStyle) {
          jsonString = messageFormatter.FormatMessage(
            new Error("No style found"),
            "No style found",
            false,
            resStyle
          );
          res.end(jsonString);
        } else {
          jsonString = messageFormatter.FormatMessage(
            undefined,
            "Styles searching succeeded",
            true,
            resStyle
          );
          res.end(jsonString);
        }
      }
    }
  );
}

function UpdateAllStyleContent(req, res) {
  var jsonString;
  var styleData = req.body.Styles;
  var tempId = req.params.id;
  var company = parseInt(req.user.company);
  var tenant = parseInt(req.user.tenant);

  var updateArray = [];

  styleData.forEach(function (styleItem) {
    if (styleItem) {
      updateArray.push(function createContact(callback) {
        Template.findOneAndUpdate(
          {
            _id: tempId,
            company: company,
            tenant: tenant,
            "styles._id": styleItem._id,
          },
          {
            $set: {
              "styles.$.content": styleItem.content,
            },
          },
          function (errStyle, resStyle) {
            if (errStyle) {
              console.log("Error in updating : " + errStyle);
              callback(errStyle, undefined);
            } else {
              if (!resStyle) {
                console.log(
                  "Error in updating : " + new Error("No style found")
                );
                jsonString = messageFormatter.FormatMessage(
                  new Error("No style found"),
                  "No style found",
                  false,
                  resStyle
                );
                callback(new Error("No style found"), undefined);
              } else {
                console.log("Success: " + resStyle);
                callback(undefined, resStyle);
              }
            }
          }
        );
      });
    }
  });

  async.parallel(updateArray, function (err, allResp) {
    if (err) {
      jsonString = messageFormatter.FormatMessage(
        err,
        "No style updated",
        false,
        undefined
      );
      res.end(jsonString);
    } else {
      jsonString = messageFormatter.FormatMessage(
        undefined,
        "styles updated successfully",
        true,
        allResp
      );
      res.end(jsonString);
    }
  });
}

function RemoveStyle(req, res) {
  var jsonString;
  var styleId = req.params.sid;
  var tempId = req.params.id;
  var company = parseInt(req.user.company);
  var tenant = parseInt(req.user.tenant);

  Template.update(
    { _id: tempId, company: company, tenant: tenant },
    {
      $pull: {
        styles: {
          _id: styleId,
        },
      },
    },
    function (errRemove, resRemove) {
      if (errRemove) {
        jsonString = messageFormatter.FormatMessage(
          errRemove,
          "Styles deletion failed",
          false,
          undefined
        );
        res.end(jsonString);
      } else {
        jsonString = messageFormatter.FormatMessage(
          undefined,
          "Styles deletion succeeded",
          true,
          resRemove
        );
        res.end(jsonString);
      }
    }
  );
}

function RemoveAllStyles(req, res) {
  var jsonString;
  var styleIds = req.body.styleIdArray;
  var tempId = req.params.id;
  var company = parseInt(req.user.company);
  var tenant = parseInt(req.user.tenant);

  Template.update(
    { _id: tempId, company: company, tenant: tenant },
    {
      $pullAll: {
        styles: {
          _id: styleIds,
        },
      },
    },
    function (errRemove, resRemove) {
      if (errRemove) {
        jsonString = messageFormatter.FormatMessage(
          errRemove,
          "Styles deletion failed",
          false,
          undefined
        );
        res.end(jsonString);
      } else {
        jsonString = messageFormatter.FormatMessage(
          undefined,
          "Styles deletion succeeded",
          true,
          resRemove
        );
        res.end(jsonString);
      }
    }
  );
}

function AddStyleToTemplate(req, res) {
  var jsonString;
  var company = parseInt(req.user.company);
  var tenant = parseInt(req.user.tenant);
  var styleData = [{ content: req.body.StyleFile }];
  Template.update(
    { _id: req.params.id, company: company, tenant: tenant },
    { $addToSet: { styles: { $each: styleData } } },
    function (errStyle, resStyle) {
      if (errStyle) {
        jsonString = messageFormatter.FormatMessage(
          errStyle,
          "Styles adding failed",
          false,
          undefined
        );
        res.end(jsonString);
      } else {
        jsonString = messageFormatter.FormatMessage(
          undefined,
          "Styles adding succeeded",
          true,
          resStyle
        );
        res.end(jsonString);
      }
    }
  );
}

module.exports.CreateTemplate = CreateTemplate;
module.exports.RenderTemplate = RenderTemplate;
module.exports.RemoveTemplate = RemoveTemplate;
module.exports.UpdateTemplateContent = UpdateTemplateContent;
module.exports.PickTemplateById = PickTemplateById;
module.exports.UpdateTemplateMainContent = UpdateTemplateMainContent;
module.exports.AddTemplateStyles = AddTemplateStyles;
module.exports.UpdateStyleContent = UpdateStyleContent;
module.exports.RemoveStyle = RemoveStyle;
module.exports.PickAllTemplates = PickAllTemplates;
module.exports.AddStyleToTemplate = AddStyleToTemplate;
module.exports.RemoveAllStyles = RemoveAllStyles;
module.exports.UpdateAllStyleContent = UpdateAllStyleContent;
module.exports.PickTemplatesByFileType = PickTemplatesByFileType;
