/**
 * Created by Pawan on 7/12/2016.
 */
var dusty = require('dustjs-linkedin');
var juice = require('juice');
var TemplateHandler = require('./TemplateHandler.js');
var config= require('config');
var util=require('util');
var restify = require('restify');
var jwt = require('restify-jwt');
var secret = require('dvp-common/Authentication/Secret.js');
var authorization = require('dvp-common/Authentication/Authorization.js');
var port = config.Host.port || 3000;
var version=config.Host.version;



var RestServer = restify.createServer({
    name: "myapp",
    version: '1.0.0'
},function(req,res)
{

});

RestServer.use(restify.CORS());
RestServer.use(restify.fullResponse());
RestServer.pre(restify.pre.userAgentConnection());


restify.CORS.ALLOW_HEADERS.push('authorization');

RestServer.use(jwt({secret: secret.Secret}));


//Server listen
RestServer.listen(port, function () {
    console.log('%s listening at %s', RestServer.name, RestServer.url);


});
//Enable request body parsing(access)
RestServer.use(restify.bodyParser());
RestServer.use(restify.acceptParser(RestServer.acceptable));
RestServer.use(restify.queryParser());



dusty.config.whitespace = true;


var mongoip=config.Mongo.ip;
var mongoport=config.Mongo.port;
var mongodb=config.Mongo.dbname;
var mongouser=config.Mongo.user;
var mongopass = config.Mongo.password;



var mongoose = require('mongoose');
var connectionstring = '';
mongoip = mongoip.split(',');
if(util.isArray(mongoip)){

    mongoip.forEach(function(item){
        connectionstring += util.format('%s:%d,',item,mongoport)
    });

    connectionstring = connectionstring.substring(0, connectionstring.length - 1);
    connectionstring = util.format('mongodb://%s:%s@%s/%s',mongouser,mongopass,connectionstring,mongodbase);

    if(mongoreplicaset){
        connectionstring = util.format('%s?replicaSet=%s',connectionstring,mongoreplicaset) ;
        console.log("connectionstring ...   "+connectionstring);
    }
}else{

    connectionstring = util.format('mongodb://%s:%s@%s:%d/%s',mongouser,mongopass,mongoip,mongoport,mongodbase);
    console.log("connectionstring ...   "+connectionstring);
}


mongoose.connection.on('error', function (err) {
    throw new Error(err);
});

mongoose.connection.on('disconnected', function() {
    throw new Error('Could not connect to database');
});

mongoose.connection.once('open', function() {
    console.log("Connected to db");
});


mongoose.connect(connectionstring);


RestServer.post('/DVP/API/'+version+'/RenderService/Template/:id/Styles',authorization({resource:"template", action:"write"}), TemplateHandler.AddTemplateStyles);
RestServer.put('/DVP/API/'+version+'/RenderService/Template/:id/AllStyles',authorization({resource:"template", action:"write"}), TemplateHandler.UpdateAllStyleContent);
RestServer.del('/DVP/API/'+version+'/RenderService/Template/:id/Style/:sid',authorization({resource:"template", action:"delete"}), TemplateHandler.RemoveStyle);
RestServer.del('/DVP/API/'+version+'/RenderService/Template/:id/Styles',authorization({resource:"template", action:"delete"}), TemplateHandler.RemoveAllStyles);
RestServer.put('/DVP/API/'+version+'/RenderService/Template/:id/Style/:sid',authorization({resource:"template", action:"write"}), TemplateHandler.UpdateStyleContent);
RestServer.post('/DVP/API/'+version+'/RenderService/Template/:id/Style',authorization({resource:"template", action:"write"}), TemplateHandler.AddStyleToTemplate);

RestServer.post('/DVP/API/'+version+'/RenderService/Template',authorization({resource:"template", action:"write"}),TemplateHandler.CreateTemplate);
RestServer.post('/DVP/API/'+version+'/RenderService/RenderTemplate/:template',authorization({resource:"template", action:"write"}),TemplateHandler.RenderTemplate);
RestServer.get('/DVP/API/'+version+'/RenderService/Templates',authorization({resource:"template", action:"read"}),TemplateHandler.PickAllTemplates);
RestServer.get('/DVP/API/'+version+'/RenderService/Template/:id',authorization({resource:"template", action:"read"}),TemplateHandler.PickTemplateById);
RestServer.del('/DVP/API/'+version+'/RenderService/Template/:template',authorization({resource:"template", action:"write"}), TemplateHandler.RemoveTemplate);
RestServer.put('/DVP/API/'+version+'/RenderService/Template/:id',authorization({resource:"template", action:"write"}),TemplateHandler.UpdateTemplateContent);
RestServer.post('/DVP/API/'+version+'/RenderService/Template/:id/Content',authorization({resource:"template", action:"write"}),TemplateHandler.UpdateTemplateMainContent);

