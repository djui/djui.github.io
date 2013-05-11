---
layout:  post
title:   Simulating net-splits in Erlang
tags:    [erlang, distributed systems, beam, testing]
date:    2011-03-18 16:47
---
{% include JB/setup %}

This article presents various methods of cut off communication channels between
Erlang nodes and highlights benefits and disadvantages between these
methods. All solutions mentioned try not to affect the behaviour of an Erlang
node, but rather the communication (channels) between nodes. Furthermore, the
described test methods are constructed for situations were multi-machine tests
are not applicable or desirable.

<!-- more -->

# Introduction

When designing distributed systems, simulation and testing is
beneficial. Besides unit-tests, behaviour tests when the network topology
changes is essential and interesting. One form of unintended network topology
changes is *network partitioning*, which is also called *net-split* when referring
to two specific network partitions.

For Erlang systems a net-split has usually only impact on communication
behaviour, as message passing is affected. Interfering communication can be
simulated either by node failures, which involves node crashes or nodes not
responding, or network changes. Testing a crashed-node scenario is rather easy
and many ways for doing so can be imagined. For simulating the behaviour of a
net-split, one doesn't want to kill a node, as most probably then one also wants
to test behaviour after the net-split is resolved ("net-merge").

Note: Erlang *VM* and *node* are used interchangeable in this article. Erlang
shell commands start with `>`, OS shell commands start with `$`. All experiment
tests rely on the integrity of `net_adm:ping/1` and `net_kernel:monitor_nodes/2`.

# Background

Erlang nodes communicate between each other using TCP connections. When a new
node is initiated, it selects a random port (around 52300) and registers itself at
the
[*Erlang Port Mapper Daemon* (EPMD)](http://www.erlang.org/doc/man/epmd.html). The
*EPMD* by default is using the port 4369 for incoming connections. When a node
wants to communicate with another node it asks the EPMD for the port of the
other node. To communicate with a node on another machine the initiating node
contacts the EPMD on the other machine. To resolve the address of the other
machine Erlang is relying on the OS routing strategies. When a node could be
found, the initiating node picks a random port and tries to establish a TCP
connection between the randomly chosen outbound port and the resolved incoming
port from the other node. After a connection is established, both nodes can use
the communication channel bi-directional (It is important to remember this
behaviour when it comes to blocking communication between nodes). Once a node
knows about another node's port, it caches this information and does not rely on
the EPMD anymore. If a node is restarted (deliberately or crashed) it picks a
new random available port.

The following figure shows three nodes *N1*, *N2*, and *N3* with their incoming
connection TCP port 52383, 52236, 52275. Communication is ongoing between *N1*
and *N2*, *N1* and *N2* where the nodes have picked random ports *R1*, *R2*,
*R3*, and *R4*.

             ,-------------------> 52236 ,----.
             |                           | N2 |
             v  ,------------------> R3  `----'
            R1  |
     ,----.     v
     | N1 | 52383
     `----'     ^
            R2  |
             ^  `------------------> R4  ,----.
             |                           | N3 |
             `-------------------> 52275 `----'
             
When asking EPMD for the ports, it reports:

```console
$ epmd -names
epmd: up and running on port 4369 with data:
name n1 at port 52328
name n2 at port 52236
name n3 at port 52275
```

Note, four ports are unpredictable from outside the Erlang nodes and only one
half of the communication channel pairs is needed.

Erlang has many ways to detect if a node is unreachable, e.g. *Net-Ticks* which
is done automatically by nodes, *Links* (bi-drectional) and *Monitors*
(uni-directional) which has to be set explicitly. Nodes send Net-ticks (also
called *Heartbeats*) to nodes they know of. An important constant in this is the
`net_tick_timeout` which by default is set to `60` and means a heartbeat is send
out every 60/4 seconds. A node is categorized as failed when four times in
continuous sequence no heartbeat signal was replied. Links or Monitors can be
actively used by having a process on a node monitoring another process on
another node and then receiving a `{'DOWN', Ref, process, Pid, Reason}` message
with the process id from the failing process (deliberately left, crashed,
etc.). This is only applicable for processes, not for the whole node. Another
method is to use the build-in function `net_kernel:monitor_nodes/2` which allows
to set the type of nodes to monitor as well as receiving the reason for why a
node went down:

```erl
1> net_kernel:monitor_nodes(true, [{node_type, visible}, nodedown_reason]).
```

Possible reasons can be:

* `connection_setup_failed`
* `no_network`
* `net_kernel_terminated`
* `shutdown`
* `connection_closed`
* `disconnect`
* `net_tick_timeout`
* `send_net_tick_failed`
* `get_status_failed`

A hypotheses could be that different node failures should imply different
monitor results. But it turns out that almost all node failures are reported
with the same reason, namly `connection_closed` and it does not matter if the
network interface gets removed, the network cable is unplugged[^1], the node
gets crashed, halted, or the `net_kernel` process gets killed. The only
exception is if the nodes VM is halted (frozen by the OS), then the monitor
result is `net_tick_timeout`. This might be a OS related result, so that certain
Linux or BSD versions behave differently.

# Net-split simulation

To produce a programmatic net-split scenario one has to consider many variants,
like OS (BSD or Linux?), privileges (sudo allowed?), physical location of nodes
(single or multi machines?) and node amount (two or more nodes?).

A valid simulated net-split event is achieved iff (if and only if) the node in
focus retrieves a nodedown message with the reason `net_tick_timeout`. Only then
no mechanism was able to correctly reason about the other nodes' liveness.

## Effectless methods

### Change cookie

communicating with another node requires the same cookie string being used on
both nodes. This is meant as a (weak) security feature but also filters out
unintended communication between nodes and is non-destructive.

```erl
1> erlang:set_cookie(node(), foo).
```

The result of this method is rather interesting. changing the cookie while the
system is running, does not effect the communication with already known nodes.

### Block or kill EPMD

Blocking or killing the EPMD does not effect communication between known
nodes. The EPMD is only needed for port discovering which is not needed once a
node talked to another node.

## Destructive methods

If only a destructive behaviour of communication between two nodes needs to be
tested and it would be allowed to stop one of them, the following methods could
be used.

### Crash VM

Crashing a VM can be done from within the VM or outside of the OS process id is
known (the VM always knows it's own OS process id).

From outside:

```erlang
$ kill -9 $PID
```

...or from within:

```erl
1> os:cmd("kill -9 " ++ os:getpid()).
```

This method is destructive which is most likely not preferred. But worse, it does
not simulate a real net-split. One can see this by the timing of messages an
alive node receives:

```erlang
{connection_closed} %% immediately sent
```

### Kill or stop VM

Killing the VM is done either manually by pressing <kbd>C-c C-c</kbd> when being
inside an Erlang shell of the particularly node, or programmatically by:

```erl
1> erlang:halt().
```

An orderly shutdown of the node is achieved programmatically by:

```erl
1> init:stop().
```

Both results in:

```erlang
{connection_closed} %% immediately sent
```

## Temporary methods

### Halt VM

If only a temporary behaviour of communication between two nodes needs to be
tested and it would be allowed to stop one of them, halting could be
used. Halting or suspending the Erlang VM OS process is done either manually
pressing <kbd>C-z</kbd> if in a terminal, or programmatically by:

```erl
1> os:cmd("kill -STOP " ++ os:getpid()).
```

This successfully results in:

```erl
{net_tick_timeout} %% Sent approx. 60 secs. after command execution
```

The emitted nodedown reason is the preferred one. But the node can't continue
during the communication stop.

### Kill net_kernel

The
[`net_kernel` (Erlang Networking Kernel)](http://www.erlang.org/doc/man/net_kernel.html)
is a system process where one of its purposes is to provide monitoring of the
network. Killing the process stops the distributed Erlang functionality, among
others prohibits communicating with other nodes.

```erl
1> timer:kill_after(0, whereis(net_kernel)).
```

This results in:

```erl
{connection_closed} %% immediately sent
```

### Block ports

A more promising method is to use firewalls (IP table). Although this method is
transparent to the Erlang nodes, it in most cases requires *sudo* privileges.

Setting up a firewall rule to block[^2] access to a node's incoming port is
trivial to set up. But because the sending port of another communicating port is
chosen randomly and an established communication channel can be used
bi-directional, setting up a complete set of rules to suppress communication is
non-trivial. Assume the scenario given in the figure before, then the firewall
rules can only be set up in a way to block incoming traffic on both nodes
symmetrically. So imagine one wants to set up rules to simulate a net-split
around *N1*.

Example for BSD:

```console
$ sudo ipfw add deny tcp from any 52236 to any
$ sudo ipfw add deny tcp from any to any dst-port 52236
$ sudo ipfw add deny tcp from any 52328 to any
$ sudo ipfw add deny tcp from any to any dst-port 52328

$ sudo ipfw show
00100      0        0 deny tcp from any 52328 to any
00200      0        0 deny tcp from any to any dst-port 52328
00300      0        0 deny tcp from any 52236 to any
00400      0        0 deny tcp from any to any dst-port 52236
65535      0        0 allow ip from any to any

:
:

$ sudo ipfw delete 100
$ sudo ipfw delete 200
$ sudo ipfw delete 300
$ sudo ipfw delete 400
```

Example for Linux:

```console
$ sudo iptables -I INPUT --proto tcp --dport 52236 -j REJECT
$ sudo iptables -I INPUT --proto tcp --sport 52236 -j REJECT
$ sudo iptables -I INPUT --proto tcp --dport 52328 -j REJECT
$ sudo iptables -I INPUT --proto tcp --sport 52328 -j REJECT

$ sudo iptables -S
-P INPUT ACCEPT
-P FORWARD ACCEPT
-P OUTPUT ACCEPT
-A INPUT -s 127.0.1.1/32 -j DROP
-A INPUT -d 127.0.1.1/32 -j DROP

:
:

$ sudo iptables -F
```

So setting up this set of rules, *N1* will not be completely disconnected from
the other nodes, because the connection from *R2* to 52275 will be used
bi-directional.

            ,--------||---------- 52236 ,----.
            |                           | N2 |
               ,-----||------------ R3  `----'
           R1  |                              
    ,----.      
    | N1 | 52383
    `----'      
           R2  |
            ^  `-----||------------ R4  ,----.
            |                           | N3 |
            `-------------------> 52275 `----'
            
If one would add another rule to also block the last open connection, one out of
two connection from the connection pair between *N2* and *N3* is blocked, which
implies that *N2* and *N3* can only communicate with each other if the
connection is establish by *N2*, what might not always be the case.

            ,--------||---------- 52236 ,----. R5 <------.
            |                           | N2 |           |
               ,-----||------------ R3  `----' 52236 --. |
           R1  |                                       | |
    ,----.                                             | |
    | N1 | 52383                                       = |
    `----'                                             | |
           R2  |                                       | |
               `-----||------------ R4  ,----. R6 -----' |
            |                           | N3 |           |
            `--------||---------- 52275 `----' 52275 <---'
            
### Block interfaces

The most promising method is to use firewalls and having each node run on a its
own network interface. Starting a node on its own interface does not require
sudo privileges.

```console
$ erl -name 'n1@127.0.1.1'
:
$ erl -name 'n2@127.0.1.2'
```

Now each can be set it its own network partition by setting the firewalls rules
that block traffic from and to this network interface.

```console
$ sudo iptables -I INPUT --destination 127.0.1.1 -j DROP
$ sudo iptables -I INPUT --source 127.0.1.1 -j DROP

$ sudo iptables -S
-P INPUT ACCEPT
-P FORWARD ACCEPT
-P OUTPUT ACCEPT
-A INPUT -s 127.0.1.1/32 -j DROP
-A INPUT -d 127.0.1.1/32 -j DROP

:
:

$ sudo iptables -F
```

This results in nodedown messages after a timeout with the appreciated reason
`net_tick_timeout`.

# Conclusions

Many methods can be used to come close to a real net-split
scenario. Establishing a repeatable, non destructive testing routine that does
not require multi-machine setups, is applicable. Depending on your needs for
your testing, your hardware and software environment and the distributed
application you develop, you have to pick the appropriate method. The most
promising method is to run each node on a separate local network interface and
using ip firewalls to block communication to this network interface.

[^1]: Interestingly enough, removing the network cable immediately triggers a
nodedown monitor message. Speculatively reasoning could explain this by having
the network interface immediately reporting the cable disconnect to the OS to
which event the Erlang VM subscribes to.

[^2]: To block means to discard packets and not trying to send an ICMP with
unreachable notice.
