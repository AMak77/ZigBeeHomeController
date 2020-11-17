const socket = require('socket.io-client')('http://192.168.1.194:8000');
const mongoose = require("mongoose");

const Scenes = require("./models/Scenes");
const Measurements = require("./models/Measurements");

const tzoffset = (new Date()).getTimezoneOffset() * 60000;

const {
    // **[A]**
    MONGODB_URL = "mongodb://localhost:27017/UserDB?replicaSet=rs0"
} = process.env;

mongoose.connect(MONGODB_URL, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log("[MONGODB] SCENES_CLIENT Connected to mongodb...")
    })

Measurements.watch().on("change", () => {
       Measurements.find()
            .sort({_id: -1})
            .limit(1)
            .then(DATAFROMLASTDEVICE => {
                const LastDevice = DATAFROMLASTDEVICE.map(device => device.device_id);
                const LastDeviceString = LastDevice.toString();
                Scenes.find()
                    .then(scenes => {
                        scenes.map(scene => scene.sensor === LastDeviceString && scene.state ? (
                            console.log('Device with Scene as Sensor'),
                            Measurements.findOne({device_id: scene.atuator}, null, {sort:{_id: -1}}, function(err, dataFromAtuator){
                                if(err) throw err;
                                if(dataFromAtuator[scene.thenParameter] !== scene.thenState){
                                    console.log('Com alteração');
                                   if(scene.conditionOperator === '==='){
                                       DATAFROMLASTDEVICE.map(device => {
                                           if(device[scene.conditionParameter] === scene.conditionState){
                                                if(scene.thenParameter === 'state'){
                                                    socket.emit("state", {device_id: scene.atuator, state: scene.thenState});
                                                } else if (scene.thenParameter === 'brightness'){
                                                    socket.emit("brightness", {device_id: scene.atuator, brightness: scene.thenState});
                                                } else if(scene.thenParameter === 'color_temp'){
                                                     socket.emit("color_temp", {device_id: scene.atuator, color_temp: scene.thenState});
                                                }
                                           }
                                           
                                       })
                                   }
                                   if(scene.conditionOperator === '!=='){
                                       DATAFROMLASTDEVICE.map(device => {
                                           if(device[scene.conditionParameter] !== scene.conditionState){
                                                if(scene.thenParameter === 'state'){
                                                    socket.emit("state", {device_id: scene.atuator, state: scene.thenState});
                                                } else if (scene.thenParameter === 'brightness'){
                                                    socket.emit("brightness", {device_id: scene.atuator, brightness: scene.thenState});
                                                } else if(scene.thenParameter === 'color_temp'){
                                                    socket.emit("color_temp", {device_id: scene.atuator, color_temp: scene.thenState});
                                                }
                                           }
                                       })
                                   }
                                   if(scene.conditionOperator === '<'){
                                    DATAFROMLASTDEVICE.map(device => {
                                        if(device[scene.conditionParameter] < scene.conditionState){
                                             if(scene.thenParameter === 'state'){
                                                 socket.emit("state", {device_id: scene.atuator, state: scene.thenState});
                                             } else if (scene.thenParameter === 'brightness'){
                                                 socket.emit("brightness", {device_id: scene.atuator, brightness: scene.thenState});
                                             } else if(scene.thenParameter === 'color_temp'){
                                                 socket.emit("color_temp", {device_id: scene.atuator, color_temp: scene.thenState});
                                             }
                                        }
                                    })
                                    }
                                    if(scene.conditionOperator === '>'){
                                        DATAFROMLASTDEVICE.map(device => {
                                            if(device[scene.conditionParameter] > scene.conditionState){
                                                 if(scene.thenParameter === 'state'){
                                                     socket.emit("state", {device_id: scene.atuator, state: scene.thenState});
                                                 } else if (scene.thenParameter === 'brightness'){
                                                     socket.emit("brightness", {device_id: scene.atuator, brightness: scene.thenState});
                                                 } else if(scene.thenParameter === 'color_temp'){
                                                     socket.emit("color_temp", {device_id: scene.atuator, color_temp: scene.thenState});
                                                 }
                                            }
                                        })
                                        }
                                } else {
                                    console.log('Sem alteração');
                                }
                            })
                        ): false)
                    })
            })
})

setInterval(() => {
    const datenow = new Date(Date.now() - tzoffset).toISOString().slice(0, -5);
    Scenes.find()
        .then(data => {
            data.map(scene => scene.date && scene.date === datenow && scene.state === true ? (
                console.log("agora"),
                Measurements.findOne({device_id: scene.atuator}, null, {sort:{_id: -1}}, function(err, dataFromAtuator){
                    if(err) throw err;
                    if(dataFromAtuator[scene.thenParameter] !== scene.thenState){
                        console.log('Com alteração');
                        if(scene.thenParameter === 'state'){
                            socket.emit("state", {device_id: scene.atuator, state: scene.thenState});
                        } else if (scene.thenParameter === 'brightness'){
                            socket.emit("brightness", {device_id: scene.atuator, brightness: scene.thenState});
                        } else if(scene.thenParameter === 'color_temp'){
                             socket.emit("color_temp", {device_id: scene.atuator, color_temp: scene.thenState});
                        }
                    } else {
                        console.log('Sem alteração');
                    }
                }),
                Scenes.findOneAndDelete({_id: scene._id }, function (err, docs) { 
                    if (err){ 
                        console.log(err) 
                    } 
                    else{ 
                        console.log("Deleted Scene : ", docs); 
                    } 
                })       
                ) : false)
        })
}, 1000)
