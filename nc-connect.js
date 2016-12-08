#!/usr/bin/env node
'use strict';
const net = require('net');
console.log = console.error;

function show_usage() {
  console.log('Connect to server and show incoming data, send input to server.');
  console.log('Usage:');
  console.log('  nc-connect.js [host:]port');
  console.log('Note:');
  console.log('  IPv6 address must be wrapped by square brackets, e.g. [::1]:8080');
}

function main(args) {
  if (args.length !== 1 || args[0] === '--help') return show_usage();

  let [host, port] = split_host_port(args[0]);
  if (!port) return show_usage();
  if (port != split_host_port.port_s) return console.log('invalid port: ' + split_host_port.port_s);

  console.log('Using parameters ' + JSON.stringify({host, port}, null, '    '));

  const con = net.connect({host, port}, () =>
    console.log(`Connected to [${con.remoteAddress}]:${ con.remotePort} source [${con.localAddress}]:${ con.localPort}`));

  process.stdin.pipe(con);
  con.pipe(process.stdout);

  con.on('end', () => console.log('EOF'));
  con.on('close', () => (console.log('closed'), process.exit(0)));
  con.on('error', e => console.log('' + e));
}

function split_host_port(combo) {
  let m = combo.match(/^(\d+)$|^\[([^\]]*)\]:?(.*)$|^([^:]*):([^:]*)$|^(.*)$/);
  return [(m[2] || m[4] || m[6] || '').replace(/^\*$/, ''), (split_host_port.port_s = (m[1] || m[3] || m[5] || '')) & 0xffff];
}

main(process.argv.slice(2)); //nodejs args is start from the 3rd.
