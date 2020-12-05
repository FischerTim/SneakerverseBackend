const mongoose = require("mongoose");
const ressources = require("../../resource/constant");

const ressourcesConnection = ressources.connections;
const ressourcesCredentials = ressources.credentials;

let connectionURl = ressourcesConnection.connectionUrl;
connectionURl = connectionURl.replace(
    ressourcesConnection.constInConnectionUrl.USERNAME,
    ressourcesCredentials.MongoDBUser.Username
);
connectionURl = connectionURl.replace(
    ressourcesConnection.constInConnectionUrl.PASSWORD,
    ressourcesCredentials.MongoDBUser.Password
);
connectionURl = connectionURl.replace(
    ressourcesConnection.constInConnectionUrl.DATABASE,
    ressourcesConnection.database
);

mongoose.connect(connectionURl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

module.exports = mongoose;
