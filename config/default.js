/**
 * Created by Pawan on 7/13/2016.
 */
module.exports = {
    "DB": {
        "Type":"postgres",
        "User":"duo",
        "Password":"DuoS123",
        "Port":5432,
        "Host":"localhost",
        "Database":"dvpdb"
    },


    "Redis":
  {
    "mode":"instance",//instance, cluster, sentinel
    "ip": "45.55.142.207",
    "port": 6389,
    "user": "duo",
    "password": "DuoS123",
    "sentinels":{
      "hosts": "138.197.90.92,45.55.205.92,138.197.90.92",
      "port":16389,
      "name":"redis-cluster"
    }

  },


    "Security":
    {
        "mode":"instance",//instance, cluster, sentinel
        "ip": "45.55.142.207",
        "port": 6389,
        "user": "duo",
        "password": "DuoS123",
        "sentinels":{
            "hosts": "138.197.90.92,45.55.205.92,138.197.90.92",
            "port":16389,
            "name":"redis-cluster"
        }
    },


    "Host":
    {
        "resource": "cluster",
        "vdomain": "localhost",
        "domain": "localhost",
        "port": "3638",
        "version": "1.0.0.0"
    },

    "LBServer" : {

        "ip": "localhost",
        "port": "3434"

    },


    "Mongo":
    {
        "ip":"104.236.231.11",
        "port":"27017",
        "dbname":"dvpdb",
        "password":"DuoS123",
        "user":"duo",
        "replicaset" :"104.236.231.11"
    }

    /*,

    "Services" : {
        "accessToken":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdWtpdGhhIiwianRpIjoiMTdmZTE4M2QtM2QyNC00NjQwLTg1NTgtNWFkNGQ5YzVlMzE1Iiwic3ViIjoiNTZhOWU3NTlmYjA3MTkwN2EwMDAwMDAxMjVkOWU4MGI1YzdjNGY5ODQ2NmY5MjExNzk2ZWJmNDMiLCJleHAiOjE4OTMzMDI3NTMsInRlbmFudCI6LTEsImNvbXBhbnkiOi0xLCJzY29wZSI6W3sicmVzb3VyY2UiOiJhbGwiLCJhY3Rpb25zIjoiYWxsIn1dLCJpYXQiOjE0NjEyOTkxNTN9.YiocvxO_cVDzH5r67-ulcDdBkjjJJDir2AeSe3jGYeA",
        "resourceServiceHost": "resourceservice.104.131.67.21.xip.io",
        "resourceServicePort": "8831",
        "resourceServiceVersion": "1.0.0.0",
        "sipuserendpointserviceHost": "sipuserendpointservice.104.131.67.21.xip.io",
        "sipuserendpointservicePort": "8831",
        "sipuserendpointserviceVersion": "1.0.0.0",
        "clusterconfigserviceHost": "clusterconfig.104.131.67.21.xip.io",
        "clusterconfigservicePort": "8831",
        "clusterconfigserviceVersion": "1.0.0.0"
    }
*/


};
