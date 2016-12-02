# nc.js
A simplified nc(netcat)

## Why i made it
- On Windows, nc/ncat/socat.exe can not be trusted because they are not signed. 
- I want a prototype so can be easily modified to do more works such as dump, analyse data.
- I want to see connection info CLEARLY which almost not provided by nc/ncat/socat.
- I want the TCP server send data to all clients (like broadcast)
- I don't want to remember complicated arguments for socat, and also nc which are distribution-dependent.

## Usage
(You can install it by `npm install -g nc.js`)

- TCP Server
    ```
    nc-listen.js [localAddress:]port
    ```
    - Listen at a port, wait for connection from clients.
    - Data from standard input will be **send to all clients (like broadcast)**.
    - Data from clients will be output to standard output.

- TCP Client
    ```
    nc-connect.js [host:]port
    ```
    - Connect to server
    - Data from standard input will be send to server.
    - Data from server will be output to standard output. 

## Samples:

- TCP-Server
    ```
    $ nc-listen.js 8888
    Using parameters {
        "localAddress": "",
        "localPort": 8888
    }
    Listening at [::]:8888
    [[::ffff:127.0.0.1]:64212] Connected from [::ffff:127.0.0.1]:64212
    ... data ...
    [[::ffff:127.0.0.1]:64212] EOF
    [[::ffff:127.0.0.1]:64212] closed
    ```
    Do not worry about the log of listening at `::`(all IPv6 interfaces),
    **as far as i'v tested, on Windows and Mac OS X, listening at `::` will cause 
    all IPv4 interfaces being listened either.(called dual-stack).**
    
    More:
    ```
    $ nc-listen.js a.b.c:8888
    $ nc-listen.js [2001:db8:a0b:12f0::1]:8888
    ```

- TCP-Client
    ```
    $ nc-connect.js 8888
    Using parameters {
        "host": "",
        "port": 8888
    }
    Connected to 127.0.0.1:8888 source 127.0.0.1:64212
    ...
    EOF
    closed

    $ nc-connect.js a.b.c:8888
    $ nc-connect.js [2001:db8:a0b:12f0::1]:8888
    ```
