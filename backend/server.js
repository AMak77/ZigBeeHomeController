const express = require('express');
const http = require("http");
const mongoose = require('mongoose');
const mqtt = require('mqtt');

var user_count = 0;

const {
    MONGODB_URL = "mongodb://localhost:27017/UserDB?replicaSet=rs0",
    SERVER_HOST = "192.168.1.194",
    SERVER_PORT = 8000
} = process.env;

const app = express();
const server = http.createServer(app);

const sio = require("socket.io")(server);

mongoose.set('useFindAndModify', false);

const Devices = require("./models/Devices");
const Measurements = require("./models/Measurements");
const Divisions = require("./models/Divisions");
const Graphics = require("./models/Graphics");
const Scenes = require("./models/Scenes");



sio.on("connection", (socket) => {
    user_count++;
    console.log("New client connected! User Count:", user_count);
   
    socket.on("GETDEVICES", () => {
      // console.log("Devices Enviados");
      Devices.find()
        .sort({ _id: -1 })
          .then(data => {
            sio.to(socket.id).emit("Devices", data);
          })
    })

    socket.on("GETMEASUREMENTS", () => {
      // console.log("Measurements Enviados");
      Measurements.find()
        .sort({ _id: -1 })
        .then(data => {
            sio.to(socket.id).emit("Measurements", data);
        })
    })

    socket.on("GETDIVISIONS", () => {
      // console.log("Divisions Enviados");
      Divisions.find()
        .sort({ _id: -1 })
        .then(data => {
            sio.to(socket.id).emit("Divisions", data);
        })
    })

    socket.on("GETGRAPHICS", () => {
      Graphics.find()
        .sort({ _id: -1 })
        .then(data => {
            sio.to(socket.id).emit("ListGraphics", data);
        })
    })

    socket.on("GETSCENES", () => {
      Scenes.find()
        .sort({_id: -1})
        .then(data => {
            sio.to(socket.id).emit("Scenes", data);
        })
    })

    socket.on("UpdateDeviceDivision", (msg) => {
      if(msg.ieeeAddr && msg.division){
        // console.log(msg);
        Devices.findOneAndUpdate({ieeeAddr: msg.ieeeAddr}, {division: msg.division}, function(err) {
          if(err) console.log(err);
        } )
      }
    })

    socket.on("state", (msg) => {
      console.log(msg);
      if(msg.device_id && msg.state){
        client.publish("zigbee2mqtt/" + msg.device_id + "/set", msg.state);
      }
    })
    socket.on("brightness", (msg) => {
      if(msg.device_id && msg.brightness > -1){
        client.publish("zigbee2mqtt/"+ msg.device_id +"/set", "{\"state\":\"on\",\"brightness\":"+msg.brightness+"}");
      }
    })
    socket.on("color_temp", (msg) => {
      if(msg.device_id && msg.color_temp > -1){
        client.publish("zigbee2mqtt/"+ msg.device_id +"/set", "{\"state\":\"on\",\"color_temp\":"+msg.color_temp+"}");
      }
    })
    socket.on("ColorPicker", (msg) => {
      if(msg.device_id && msg.color){
        client.publish("zigbee2mqtt/"+ msg.device_id +"/set", "{\n\t\"color\":{\n\t\t\"hex\": \""+ msg.color +"\"\n\t}\n}");
      }
    })
    socket.on("NewDivision", (msg) => {
      if(msg.name){
        const NewDivision = new Divisions ({
          name: msg.name
        })
        NewDivision.save()
          .then(data => {
              console.log(data);
          })
          .catch(err => {
                  console.log(err);
                  throw err;
          });
      }
    })
    socket.on("DeleteDivision", (msg) => {
      if(msg.name){
        Divisions.deleteOne({name: msg.name}, function(err) {
          if(err) console.log(err);
        } )
      }
    })
    socket.on("EditDivision", (msg) => {
      if(msg.old_name && msg.name){
        Divisions.findOneAndUpdate({name: msg.old_name}, {name: msg.name}, function(err) {
          if(err) console.log(err);
        } )
      }
    })
    socket.on("DeleteDevice", (msg) => {
      if(msg.ieeeAddr){
        client.publish("zigbee2mqtt/bridge/config/force_remove", msg.ieeeAddr);
      }
    })
    socket.on("EditDevice", (msg) => {
      if(msg.old_name && msg.name){
        Devices.findOneAndUpdate({friendly_name: msg.old_name}, {friendly_name: msg.name}, function(err) {
          if(err) console.log(err);
        } )
      }
    })

    socket.on("NewGraphic", (msg) => {
      if(msg.device && msg.parameter){
        const NewGraphic = new Graphics ({
          device: msg.device,
          parameter: msg.parameter
        })
        NewGraphic.save()
          .then(data => {
              console.log(data);
          })
          .catch(err => {
                  console.log(err);
                  throw err;
          });
      }
    })

    socket.on("DeleteGraphic", (msg) => {
      console.log(msg);
      if(msg.device && msg.parameter){
        Graphics.deleteOne({device: msg.device, parameter: msg.parameter}, function(err) {
          if(err) console.log(err);
        } )
      }
    })

    socket.on("NewScene", (msg) => {
      // console.log(msg);
      // if(msg.sensor && msg.conditionParameter){
        const NewScene = new Scenes ({
          sensor: msg.sensor,
          conditionParameter: msg.conditionParameter,
          conditionOperator: msg.conditionOperator,
          conditionState: msg.conditionState,
          atuator: msg.atuator,
          thenParameter: msg.thenParameter,
          thenState: msg.thenState,
          date: msg.date,
          state: true
        })
        NewScene.save()
          .then(data => {
              console.log(data);
          })
          .catch(err => {
                  console.log(err);
                  throw err;
          });
      // }
    })

    socket.on("DeleteScene", (msg) => {
      console.log(msg);
      if(msg._id){
        Scenes.deleteOne({_id: msg._id}, function(err) {
          if(err) console.log(err);
        } )
      }
    })

    socket.on("SceneStatus", (msg) => {
      console.log(msg);
      if(msg._id){
        Scenes.findOneAndUpdate({_id: msg._id}, {state: msg.state}, function(err) {
          if(err) console.log(err);
        } )
      }
    })

    socket.on("disconnect", () => {
	user_count--;
        console.log("Client disconnected. User Count:", user_count);
    })
})

	
Devices.watch().on("change", () => {
  Devices.find()
    .sort({ _id: -1 })
      .then(data => {
        sio.sockets.emit("Devices", data);
      })
})

Measurements.watch().on("change", () => {
  Measurements.find()
      .sort({ _id: -1 })
      .then(data => {
        sio.sockets.emit("Measurements", data);
      })
})

Divisions.watch().on("change", () => {
  Divisions.find()
    .sort({ _id: -1 })
      .then(data => {
        sio.sockets.emit("Divisions", data);
      })
})

Graphics.watch().on("change", () => {
  Graphics.find()
    .sort({ _id: -1 })
      .then(data => {
        sio.sockets.emit("ListGraphics", data);
      })
})

Scenes.watch().on("change", () => {
  Scenes.find()
    .sort({ _id: -1 })
      .then(data => {
        sio.sockets.emit("Scenes", data);
      })
})





var client = mqtt.connect("mqtt://192.168.1.194:1883");

client.on("connect", () => {
    client.subscribe("#");
})

client.on("message", (topic, message) => {
    if (topic === 'zigbee2mqtt/bridge/state'){
        console.log(`status ZIGBEE2MQTT: ${message}`);
      }
      else if (topic === 'zigbee2mqtt/bridge/config'){
        context = JSON.parse(message);
        console.log('Coordinator:', context['coordinator'].type);
      }
      else if(topic === 'zigbee2mqtt/bridge/config/devices'){
        context = JSON.parse(message);
        context.forEach(async (i) => {
            client.subscribe(`zigbee2mqtt/${i.ieeeAddr}`);
            console.log(`SUBSCRITO zigbee2mqtt/${i.ieeeAddr}`);
            const device = await Devices.findOne({ieeeAddr: i.ieeeAddr});
            if(!device){
                const new_device = await new Devices({
                    ieeeAddr: i.ieeeAddr,
                    type: i.type,
                    networkAddress: i.networkAddress,
                    friendly_name: i.ieeeAddr,
                    model: i.model,
                    vendor: i.vendor,
                    description: i.description,
                    friendly_name: i.friendly_name,
                    manufacturerID: i.manufacturerID,
                    manufacturerName: i.manufacturerName,
                    powerSource: i.powerSource,
                    modelID: i.modelID,
                    hardwareVersion: i.hardwareVersion,
                    softwareBuildID: i.softwareBuildID,
                    dateCode: i.dateCode,
                    lastSeen: i.lastSeen
                })

                new_device.save()
                .then(data => {
                    console.log(data);
                })
                .catch(err => {
                    console.log(err);
                    throw err;
                });
            }
        })
      }
      else if(topic === 'zigbee2mqtt/bridge/log'){
        context = JSON.parse(message);
        if (context['type'] === 'device_connected'){
          // console.log(context['type']);
          const new_device = new Devices({
            ieeeAddr: context['message'].friendly_name
          })

          new_device.save()
          .then(data => {
            //   console.log(data);
          })
          .catch(err => {
              console.log(err);
              throw err;
          });

          console.log(`${context['message'].friendly_name} -> A criar base de dados e a sincronizar dispositivo...`);
        }
        else if (context['type'] === 'pairing' && context['meta'].supported === true){
          Devices.findOneAndUpdate({ieeeAddr: context['meta'].friendly_name},{$set:{
            model: context['meta'].model,
            friendly_name: context['meta'].friendly_name,
            vendor: context['meta'].vendor,
            description: context['meta'].description
          }}, {new: true}, (err, doc) => {
            if (err) console.log("something wrong");
            console.log(doc);
          });
          console.log(`${context['meta'].friendly_name} -> Sincronizado com sucesso e db atualizada...`);
          client.publish(`zigbee2mqtt/${context['meta'].friendly_name}/get`);
        }
        else if (context['type'] === 'device_force_removed'){
          let id = context['message'];
          client.unsubscribe(`zigbee2mqtt/${id}`);
          Devices.deleteOne({ ieeeAddr: `${id}` }, function (err) {
            if (err) return handleError(err);
          });
          console.log(`${id} -> db eliminada e não subscrito`);
        }
      }

      Devices.find().then(data => data.forEach(i => {
        if(topic === 'zigbee2mqtt/' + i.ieeeAddr){
          context = JSON.parse(message);
          console.log(`topic zigbee2mqtt/${i.ieeeAddr}`);
          const new_measurement =  new Measurements({
            device_id: i.ieeeAddr,
            state: context['state'],
            brightness: context['brightness'],
            color_temp: context['color_temp'],
            linkquality: context['linkquality'],
            battery: context['battery'],
            voltage: context['voltage'],
            power: context['power'],
            current: context['current'],
            consumption: context['consumption'],
            temperature: context['temperature'],
            humidity: context['humidity'],
            pressure: context['pressure'],
            color: context['color'],
            occupancy: context['occupancy'],
            date: new Date()
          })
          new_measurement.save()
            .then(data => {
                console.log(data);
            })
            .catch(err => {
                    console.log(err);
                    throw err;
            });
        }
      }));
})


mongoose.connect(MONGODB_URL, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log("[MONGODB] Connected to mongodb...")
    })

server.listen(SERVER_PORT, SERVER_HOST, ()=>{
    console.log(`[SERVER] Running at ${SERVER_HOST}:${SERVER_PORT}`);
})
