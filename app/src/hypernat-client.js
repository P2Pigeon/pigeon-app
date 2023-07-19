#!/usr/bin/env node

require('dotenv').config();

const Keychain = require('keypear');
const DHT = require("@hyperswarm/dht");
const pump = require("pump");
var net = require("net");
const udp = require('dgram');
const argv = require('yargs').argv;

const options = {
    "schema": [
        {
            "mode": "client",
            "proto": process.env.PROTO || "tcp",
            "port": process.env.PORT || '3000',
            "publicKey": process.env.PEER || argv.peer
        }    
    ]
}

const { base58_to_binary, binary_to_base58 } = require('base58-js')
const relay = async () => {
    const node = new DHT({});
    await node.ready();
    return {
        tcp: {
            client: async (publicKey, port) => {
                var server = net.createServer({allowHalfOpen: true},function (local) {
                    console.log('Connecting to tcp', port);
                    const socket = node.connect(publicKey, { reusableSocket: true });
                    pump(local, socket, local);
                });
                server.listen(port, "127.0.0.1");
                console.log('Listening for local connections on tcp', port);
            }
        },
        udp: {
            client: async (publicKey, port) => {
                console.log('Connecting to udp', port);
                const conn = await node.connect(publicKey);
                await new Promise(res => conn.on('open', res));
                console.log('connection open');
                var server = udp.createSocket('udp4');
                let inport;
                server.on('message', async (buf, rinfo) => {
                    if (!inport) {
                        console.log('setting port', rinfo);
                        inport = rinfo.port;
                    }
                    conn.rawStream.send(buf);
                })
                conn.rawStream.on('message', (buf) => {
                    server.send(buf, inport);
                })
                server.bind(port);
                console.log('UDP stream ready, listening for packets on ', port);
            }
        }
    }
}

const schema = options.schema;

const modes = {
    client: async (settings) => {
        const {proto, port, publicKey} = settings;
        const keys = new Keychain(base58_to_binary(publicKey));
        const key = keys.get(proto+port).publicKey;
        const rel = await relay();
        return (rel)[proto].client(key, port);
    }
}
const run = async () => {
    console.log('\033[31;1mHyperNAT client starting ...\033[0m');
    console.log('\033[32;1mPEER:\033[0m', argv.peer)
    for (forwarder of schema) {
        await modes[forwarder.mode](forwarder);
    }

}
run()

