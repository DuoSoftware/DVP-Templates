/**
 * Created by Pawan on 5/23/2017.
 */
var mongoose = require("mongoose");
var ChatTemplate = require("dvp-mongomodels/model/ChatTemplates").ChatTemplate;
var User = require("dvp-mongomodels/model/User");
var logger = require("dvp-common-lite/LogHandler/CommonLogHandler.js").logger;
var messageFormatter = require("dvp-common-lite/CommonMessageGenerator/ClientMessageJsonFormatter.js");
var Template = require("dvp-mongomodels/model/Template");
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
mongoose.set("debug", true);

function CreateChatTemplate(req, res) {
  logger.debug("DVP-LiteTicket.CreateTagCategory Internal method ");

  var company = parseInt(req.user.company);
  var tenant = parseInt(req.user.tenant);

  var jsonString;

  if (req.body.content) {
    try {
      User.findOne(
        { username: req.user.iss, company: company, tenant: tenant },
        function (err, user) {
          if (err) {
            jsonString = messageFormatter.FormatMessage(
              err,
              "Error in searching user",
              false,
              undefined
            );
            res.end(jsonString);
          } else if (user) {
            var chatTemplateCategory = ChatTemplate({
              company: company,
              tenant: tenant,
              owner: user.id,
              content: req.body.content,
              isCommon: req.body.isCommon,
            });

            chatTemplateCategory.save(function (errTemp, resTemp) {
              if (errTemp) {
                jsonString = messageFormatter.FormatMessage(
                  errTemp,
                  "Error in creating chat templates",
                  false,
                  undefined
                );
              } else {
                jsonString = messageFormatter.FormatMessage(
                  undefined,
                  "Chat template created successfully",
                  true,
                  resTemp
                );
              }

              res.end(jsonString);
            });
          } else {
            jsonString = messageFormatter.FormatMessage(
              new Error("No user found"),
              "No user found",
              false,
              undefined
            );
            res.end(jsonString);
          }
        }
      );
    } catch (e) {
      jsonString = messageFormatter.FormatMessage(
        e,
        "Exception found",
        false,
        undefined
      );
      res.end(jsonString);
    }
  } else {
    jsonString = messageFormatter.FormatMessage(
      new Error("No content found"),
      "No content found",
      false,
      undefined
    );
    res.end(jsonString);
  }
}

function PickAvailableChatTemplates(req, res) {
  logger.debug("DVP-LiteTicket.PickAvailableChatTemplates Internal method ");
  var jsonString;
  var company = parseInt(req.user.company);
  var tenant = parseInt(req.user.tenant);

  User.findOne(
    { username: req.user.iss, company: company, tenant: tenant },
    function (err, user) {
      if (err) {
        jsonString = messageFormatter.FormatMessage(
          err,
          "Error in searching user",
          false,
          undefined
        );
        res.end(jsonString);
      } else if (user) {
        var queryObj = {
          company: company,
          tenant: tenant,
          $or: [{ owner: user.id }, { isCommon: true }],
        };

        ChatTemplate.find(queryObj, function (errTemp, resTemp) {
          if (errTemp) {
            jsonString = messageFormatter.FormatMessage(
              errTemp,
              "Error in searching chat templates",
              false,
              undefined
            );
            res.end(jsonString);
          } else if (resTemp) {
            jsonString = messageFormatter.FormatMessage(
              undefined,
              "Chat templates found",
              true,
              resTemp
            );
            res.end(jsonString);
          } else {
            jsonString = messageFormatter.FormatMessage(
              undefined,
              "No chat templates found",
              true,
              resTemp
            );
            res.end(jsonString);
          }
        });
      } else {
        jsonString = messageFormatter.FormatMessage(
          new Error("No user found"),
          "No user found",
          false,
          undefined
        );
        res.end(jsonString);
      }
    }
  );
}

function PickMyChatTemplates(req, res) {
  logger.debug("DVP-LiteTicket.PickMyChatTemplates Internal method ");
  var jsonString;
  var company = parseInt(req.user.company);
  var tenant = parseInt(req.user.tenant);

  User.findOne(
    { username: req.user.iss, company: company, tenant: tenant },
    function (err, user) {
      if (err) {
        jsonString = messageFormatter.FormatMessage(
          err,
          "Error in searching user",
          false,
          undefined
        );
        res.end(jsonString);
      } else if (user) {
        var queryObj = {
          company: company,
          tenant: tenant,
          owner: user.id,
        };

        ChatTemplate.find(queryObj, function (errTemp, resTemp) {
          if (errTemp) {
            jsonString = messageFormatter.FormatMessage(
              errTemp,
              "Error in searching chat templates",
              false,
              undefined
            );
            res.end(jsonString);
          } else if (resTemp) {
            jsonString = messageFormatter.FormatMessage(
              undefined,
              "Chat templates found",
              true,
              resTemp
            );
            res.end(jsonString);
          } else {
            jsonString = messageFormatter.FormatMessage(
              undefined,
              "No chat templates found",
              true,
              resTemp
            );
            res.end(jsonString);
          }
        });
      } else {
        jsonString = messageFormatter.FormatMessage(
          new Error("No user found"),
          "No user found",
          false,
          undefined
        );
        res.end(jsonString);
      }
    }
  );
}

function PickAllChatTemplates(req, res) {
  logger.debug("DVP-LiteTicket.PickAllChatTemplates Internal method ");
  var jsonString;
  var company = parseInt(req.user.company);
  var tenant = parseInt(req.user.tenant);

  User.findOne(
    { username: req.user.iss, company: company, tenant: tenant },
    function (err, user) {
      if (err) {
        jsonString = messageFormatter.FormatMessage(
          err,
          "Error in searching user",
          false,
          undefined
        );
        res.end(jsonString);
      } else if (user) {
        var queryObj = {
          company: company,
          tenant: tenant,
        };

        ChatTemplate.find(queryObj, function (errTemp, resTemp) {
          if (errTemp) {
            jsonString = messageFormatter.FormatMessage(
              errTemp,
              "Error in chat templates",
              false,
              undefined
            );
            res.end(jsonString);
          } else resTemp;
          {
            jsonString = messageFormatter.FormatMessage(
              undefined,
              "Chat templates found",
              true,
              resTemp
            );
            res.end(jsonString);
          }
        });
      } else {
        jsonString = messageFormatter.FormatMessage(
          new Error("No user found"),
          "No user found",
          false,
          undefined
        );
        res.end(jsonString);
      }
    }
  );
}

function UpdateChatTemplate(req, res) {
  logger.debug("DVP-LiteTicket.PickAllChatTemplates Internal method ");
  var jsonString;
  var company = parseInt(req.user.company);
  var tenant = parseInt(req.user.tenant);

  if (req.params.id) {
    if (req.body.content) {
      User.findOne(
        { username: req.user.iss, company: company, tenant: tenant },
        function (err, user) {
          if (err) {
            jsonString = messageFormatter.FormatMessage(
              err,
              "Error in searching user",
              false,
              undefined
            );
            res.end(jsonString);
          } else if (user) {
            var queryObj = {
              company: company,
              tenant: tenant,
              owner: user.id,
              _id: req.params.id,
            };

            ChatTemplate.findOneAndUpdate(
              queryObj,
              { $set: { content: req.body.content } },
              function (errTemp, resTemp) {
                if (errTemp) {
                  jsonString = messageFormatter.FormatMessage(
                    errTemp,
                    "Error in searching chat templates",
                    false,
                    undefined
                  );
                  res.end(jsonString);
                } else if (resTemp) {
                  jsonString = messageFormatter.FormatMessage(
                    undefined,
                    "Chat templates found",
                    true,
                    resTemp
                  );
                  res.end(jsonString);
                } else {
                  jsonString = messageFormatter.FormatMessage(
                    undefined,
                    "No chat templates found",
                    true,
                    resTemp
                  );
                  res.end(jsonString);
                }
              }
            );
          } else {
            jsonString = messageFormatter.FormatMessage(
              new Error("No user found"),
              "No user found",
              false,
              undefined
            );
            res.end(jsonString);
          }
        }
      );
    } else {
      jsonString = messageFormatter.FormatMessage(
        new Error("No content found"),
        "No content found",
        false,
        undefined
      );
      res.end(jsonString);
    }
  } else {
    jsonString = messageFormatter.FormatMessage(
      new Error("No template id found"),
      "No template id found",
      false,
      undefined
    );
    res.end(jsonString);
  }
}
function DeleteChatTemplate(req, res) {
  logger.debug("DVP-LiteTicket.PickAllChatTemplates Internal method ");
  var jsonString;
  var company = parseInt(req.user.company);
  var tenant = parseInt(req.user.tenant);

  if (req.params.id) {
    User.findOne(
      { username: req.user.iss, company: company, tenant: tenant },
      function (err, user) {
        if (err) {
          jsonString = messageFormatter.FormatMessage(
            err,
            "Error in searching user",
            false,
            undefined
          );
          res.end(jsonString);
        } else if (user) {
          var queryObj = {
            company: company,
            tenant: tenant,
            owner: user.id,
            _id: req.params.id,
          };

          ChatTemplate.findOneAndRemove(queryObj, function (errTemp, resTemp) {
            if (errTemp) {
              jsonString = messageFormatter.FormatMessage(
                errTemp,
                "Error in searching chat templates",
                false,
                undefined
              );
              res.end(jsonString);
            } else if (resTemp) {
              jsonString = messageFormatter.FormatMessage(
                undefined,
                "Chat templates found",
                true,
                resTemp
              );
              res.end(jsonString);
            } else {
              jsonString = messageFormatter.FormatMessage(
                undefined,
                "No chat templates found",
                true,
                resTemp
              );
              res.end(jsonString);
            }
          });
        } else {
          jsonString = messageFormatter.FormatMessage(
            new Error("No user found"),
            "No user found",
            false,
            undefined
          );
          res.end(jsonString);
        }
      }
    );
  } else {
    jsonString = messageFormatter.FormatMessage(
      new Error("No template id found"),
      "No template id found",
      false,
      undefined
    );
    res.end(jsonString);
  }
}

module.exports.CreateChatTemplate = CreateChatTemplate;
module.exports.PickAvailableChatTemplates = PickAvailableChatTemplates;
module.exports.PickAllChatTemplates = PickAllChatTemplates;
module.exports.UpdateChatTemplate = UpdateChatTemplate;
module.exports.DeleteChatTemplate = DeleteChatTemplate;
module.exports.PickMyChatTemplates = PickMyChatTemplates;
