#!/usr/bin/env node
'use strict';
const net = require('net');
console.log = console.error;

function show_usage() {
  console.log('Listen at a local port and show incoming data, send input to all clients.');
  console.log('Usage:');
  console.log('  nc-listen.js [localAddress:]port');
  console.log('Note:');
  console.log('  IPv6 address must be wrapped by square brackets, e.g. [::1]:8080');
}

function main(args) {
  if (!args.length || args[0] === '--help') return show_usage();

  let [localAddress, localPort] = split_host_port(args[0]);
  console.log('Using parameters ' + JSON.stringify({localAddress, localPort}, null, '    '));

  net.createServer(function (con) {
    const tag = `[[${con.remoteAddress}]:${ con.remotePort}] `;
    console.log(`Connected from [${con.remoteAddress}]:${ con.remotePort}`);

    process.stdin.pipe(con);
    con.pipe(process.stdout);

    con.on('end', () => console.log(tag + 'EOF'));
    con.on('close', () => console.log(tag + 'closed'));
    con.on('error', e => console.log(tag + e));

  }).listen({host: localAddress, port: localPort}, function () {
    console.log(`Listening at [${this.address().address}]:${ this.address().port}`);
    process.stdin.on('close', () => this.close());
    process.stdin.on('data', buf => buf); //For windows OS: just trigger reading from stdin
  }).on('error', e => console.log('' + e));
}

function split_host_port(combo) {
  let m = combo.match(/^(\d+)$|^\[([^\]]*)\]:?(.*)$|^([^:]*):([^:]*)$|^(.*)$/);
  return [(m[2] || m[4] || m[6] || '').replace(/^\*$/, ''), (m[1] || m[3] || m[5] || '') & 0xffff];
}

main(process.argv.slice(2)); //nodejs args is start from the 3rd.
