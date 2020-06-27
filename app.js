/**
 * Created by Pawan on 7/12/2016.
 */
var dusty = require("dustjs-linkedin");
var config = require("config");
var restify = require("restify");
var jwt = require("restify-jwt");
var secret = require("dvp-common-lite/Authentication/Secret.js");
var authorization = require("dvp-common-lite/Authentication/Authorization.js");
var port = config.Host.port || 3000;
var version = config.Host.version;

var TemplateHandler = require("./TemplateHandler.js");
var ChatTemplateHandler = require("./ChatTemplateHandler.js");

var RestServer = restify.createServer(
  {
    name: "myapp",
    version: "1.0.0",
  },
  function (req, res) {}
);

RestServer.use(restify.CORS());
RestServer.use(restify.fullResponse());
RestServer.pre(restify.pre.userAgentConnection());

restify.CORS.ALLOW_HEADERS.push("authorization");

RestServer.use(jwt({ secret: secret.Secret }));

//Server listen
RestServer.listen(port, function () {
  console.log("%s listening at %s", RestServer.name, RestServer.url);
});
//Enable request body parsing(access)
RestServer.use(restify.bodyParser());
RestServer.use(restify.acceptParser(RestServer.acceptable));
RestServer.use(restify.queryParser());

dusty.config.whitespace = true;

var util = require("util");
RestServer.post(
  "/DVP/API/" + version + "/RenderService/Template/:id/Styles",
  authorization({ resource: "template", action: "write" }),
  TemplateHandler.AddTemplateStyles
);
RestServer.put(
  "/DVP/API/" + version + "/RenderService/Template/:id/AllStyles",
  authorization({ resource: "template", action: "write" }),
  TemplateHandler.UpdateAllStyleContent
);
RestServer.del(
  "/DVP/API/" + version + "/RenderService/Template/:id/Style/:sid",
  authorization({ resource: "template", action: "delete" }),
  TemplateHandler.RemoveStyle
);
RestServer.del(
  "/DVP/API/" + version + "/RenderService/Template/:id/Styles",
  authorization({ resource: "template", action: "delete" }),
  TemplateHandler.RemoveAllStyles
);
RestServer.put(
  "/DVP/API/" + version + "/RenderService/Template/:id/Style/:sid",
  authorization({ resource: "template", action: "write" }),
  TemplateHandler.UpdateStyleContent
);
RestServer.post(
  "/DVP/API/" + version + "/RenderService/Template/:id/Style",
  authorization({ resource: "template", action: "write" }),
  TemplateHandler.AddStyleToTemplate
);

RestServer.post(
  "/DVP/API/" + version + "/RenderService/Template",
  authorization({ resource: "template", action: "write" }),
  TemplateHandler.CreateTemplate
);
RestServer.post(
  "/DVP/API/" + version + "/RenderService/RenderTemplate/:template",
  authorization({ resource: "template", action: "write" }),
  TemplateHandler.RenderTemplate
);
RestServer.get(
  "/DVP/API/" + version + "/RenderService/Templates",
  authorization({ resource: "ticket", action: "read" }),
  TemplateHandler.PickAllTemplates
);
RestServer.get(
  "/DVP/API/" + version + "/RenderService/Template/:id",
  authorization({ resource: "template", action: "read" }),
  TemplateHandler.PickTemplateById
);
RestServer.del(
  "/DVP/API/" + version + "/RenderService/Template/:template",
  authorization({ resource: "template", action: "write" }),
  TemplateHandler.RemoveTemplate
);
RestServer.put(
  "/DVP/API/" + version + "/RenderService/Template/:id",
  authorization({ resource: "template", action: "write" }),
  TemplateHandler.UpdateTemplateContent
);
RestServer.post(
  "/DVP/API/" + version + "/RenderService/Template/:id/Content",
  authorization({ resource: "template", action: "write" }),
  TemplateHandler.UpdateTemplateMainContent
);
RestServer.get(
  "/DVP/API/" + version + "/RenderService/TemplateByType/:filetype",
  authorization({ resource: "template", action: "write" }),
  TemplateHandler.PickAllTemplates
);

RestServer.post(
  "/DVP/API/" + version + "/TemplateService/ChatTemplate",
  authorization({ resource: "template", action: "write" }),
  ChatTemplateHandler.CreateChatTemplate
);
RestServer.get(
  "/DVP/API/" + version + "/TemplateService/AvailableChatTemplates",
  authorization({ resource: "template", action: "read" }),
  ChatTemplateHandler.PickAvailableChatTemplates
);
RestServer.get(
  "/DVP/API/" + version + "/TemplateService/ChatTemplates",
  authorization({ resource: "template", action: "read" }),
  ChatTemplateHandler.PickAllChatTemplates
);
RestServer.get(
  "/DVP/API/" + version + "/TemplateService/MyChatTemplates",
  authorization({ resource: "template", action: "read" }),
  ChatTemplateHandler.PickMyChatTemplates
);
RestServer.put(
  "/DVP/API/" + version + "/TemplateService/ChatTemplate/:id",
  authorization({ resource: "template", action: "write" }),
  ChatTemplateHandler.UpdateChatTemplate
);
RestServer.del(
  "/DVP/API/" + version + "/TemplateService/ChatTemplate/:id",
  authorization({ resource: "template", action: "delete" }),
  ChatTemplateHandler.DeleteChatTemplate
);
