/**
 * Created by Pawan on 7/13/2016.
 */
module.exports = {
  DB: {
    Type: "postgres",
    User: "",
    Password: "",
    Port: 5432,
    Host: "",
    Database: "",
  },

  Redis: {
    mode: "instance", //instance, cluster, sentinel
    ip: "",
    port: 6389,
    user: "",
    password: "",
    sentinels: {
      hosts: "",
      port: 16389,
      name: "redis-cluster",
    },
  },

  Security: {
    mode: "instance", //instance, cluster, sentinel
    ip: "",
    port: 6389,
    user: "",
    password: "",
    sentinels: {
      hosts: "",
      port: 16389,
      name: "redis-cluster",
    },
  },

  Host: {
    resource: "cluster",
    vdomain: "localhost",
    domain: "localhost",
    port: "3638",
    version: "1.0.0.0",
  },

  LBServer: {
    ip: "localhost",
    port: "3434",
  },

  Mongo: {
    ip: "",
    port: "27017",
    dbname: "",
    password: "",
    user: "",
    replicaset: "",
    type: "mongodb+srv",
  },
};
