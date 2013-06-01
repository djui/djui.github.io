https://groups.google.com/forum/?fromgroups=#!topic/nodejs/xRPK2kiksBE
https://groups.google.com/forum/?fromgroups=#!topic/nodejs/3goMctEnUpQ
http://blog.coolaj86.com/articles/debugging-v8-and-node-js-on-arm.html
https://groups.google.com/forum/?fromgroups=#!topic/nodejs-dev/4GNA_tQr4rs
http://fastr.github.io/articles/cross-compiling-node.js-for-arm.html
http://fastr.github.io/articles/Node.js-on-OpenEmbedded.html

To build Erlang for the AppleTV 2 you need to have the following requirements:

 * OS X 10.6 (maybe lower, maybe higher works too)
 * Developer Tools (XCode, etc.)

Go and get 'Erlang Embedded' from 'https://github.com/esl/erlang-embedded' and run './EmbErl.sh -H arm-apple-darwin'. The default version of Erlang/OTP that will be packaged at the moment is R13B04 (This can be changed to any other release, but is not tested yet). It will download the standard source package from the official Erlang site. Then it will unpack the source tar.gz file. Then it will configure the build for cross compilation. It will compile for an "arm apple darwin" host. Then it will configure the bootstrap build system. It configures the build with the following flags:

 * '--prefix=/usr/local': The final installation path
 * '--build=i386-apple-darwin10.6.0': The current build system platform
 * '--host=arm-apple-darwin': The target host specification
 * '--disable-hipe': Disables the high speed optimization emulator
 * '--disable-threads': Disables the use of kernel threads
 * '--disable-smp': Disables the multicore functionality
 * '--disable-megaco-flex-scanner-lineno': Disables Megaco
 * '--disable-megaco-reentrant-flex-scanner': Disables Megaco
 * '--disable-dynamic-ssl-lib': Disables the use of SSL
 * '--without-termcap': Excludes ?
 * '--without-javac': Excludes the java port bindings
 * '--without-ssl': Excludes SSL
 * 'CFLAGS=-O2 -DSMALL_MEMORY': Compile with optimization level 2 and optimize for small memory footprint
 * 'ERL_TOP=/Users/uwe/dev/erlang-embedded/otp_src_R13B04': Specify the path for the to be used Erlang system
 * 'build_alias=i386-apple-darwin10.6.0': An alias for the current build system platform
 * 'host_alias=arm-apple-darwin': An alias for the target host specification
 * '--cache-file=/dev/null': Don't use a cache file during compilation
 * '--srcdir=/Users/uwe/dev/erlang-embedded/otp_src_R13B04/lib': Include some source files
 * '--srcdir=/Users/uwe/dev/erlang-embedded/otp_src_R13B04/lib/snmp/': Include some source files

The default included applications are:

 * 'stdlib'
 * 'erts'
 * 'kernel'

Not included are:

 * appmon         : Not listed in keep file
 * asn1           : Not listed in keep file
 * common_test    : Not listed in keep file
 * compiler       : Not listed in keep file
 * cosEvent       : Not listed in keep file
 * cosEventDomain : Not listed in keep file
 * cosFileTransfer: Not listed in keep file
 * cosNotification: Not listed in keep file
 * cosProperty    : Not listed in keep file
 * cosTime        : Not listed in keep file
 * cosTransactions: Not listed in keep file
 * crypto         : User gave --without-ssl option
 * debugger       : Not listed in keep file
 * dialyzer       : Not listed in keep file
 * docbuilder     : Not listed in keep file
 * edoc           : Not listed in keep file
 * erl_docgen     : Not listed in keep file
 * erl_interface  : Not listed in keep file
 * et             : Not listed in keep file
 * eunit          : Not listed in keep file
 * gs             : Not listed in keep file
 * hipe           : Not listed in keep file
 * ic             : Not listed in keep file
 * inets          : Not listed in keep file
 * inviso         : Not listed in keep file
 * jinterface     : Not listed in keep file
 * megaco         : Not listed in keep file
 * mnesia         : Not listed in keep file
 * observer       : Not listed in keep file
 * odbc           : Dont know where to search for odbc (setting erl_xcomp_sysroot will help)
 * os_mon         : Not listed in keep file
 * otp_mibs       : Not listed in keep file
 * parsetools     : Not listed in keep file
 * percept        : Not listed in keep file
 * pman           : Not listed in keep file
 * public_key     : Not listed in keep file
 * reltool        : Not listed in keep file
 * runtime_tools  : Not listed in keep file
 * sasl           : Not listed in keep file
 * snmp           : Not listed in keep file                                                 
 * ssh            : User gave --without-ssl option
 * ssl            : User gave --without-ssl option
 * syntax_tools   : Not listed in keep file
 * tcl/tk         : it won't find a prebuilt tcl/tk in tcl/binaries/arm_apple_darwin.tar.gz; Not listed in keep file
 * test_server    : Not listed in keep file
 * toolbar        : Not listed in keep file
 * tools          : Not listed in keep file
 * tv             : Not listed in keep file
 * typer          : Not listed in keep file
 * webtool        : Not listed in keep file
 * wx             : Not supported for cross-compilation; Not listed in keep file
 * xmerl          : Not listed in keep file

Then it configures the cross host system for 'arm-apple-darwin'. Then it creates the bootstrap and builds the bundle. Then it cleans up the build by removing prebuilt files in 'stdlib', 'erts', 'kernel'. Then it creates the release. Then it tries to run the install script if it exists to setup paths and executables. This fails because no install script exists with:

    ./EmbErl.sh: line 159: ./Install: No such file or directory
    rm: Install: No such file or directory

The it strips the 'erts' binaries. This fails because of:

    ./EmbErl.sh: line 171: arm-angstrom-linux-gnueabi-strip: command not found

Not sure why it tries to work in a 'arm-angstrom-linux-gnueabi' environment here in the end. But I assume these errors are neglectable. Then it removes the source code, documentation, and examples. Then it creates a tarball called 'EmbErl_H-arm-apple-darwin.tgz' which is 61.7 mb in size. An optimized version could be build with './EmbErl.sh -s -c -C -o 1 -H arm-apple-darwin'. Following a list of various optimization flags:

 * 'EmbErl_H-arm-apple-darwin.tgz': 61.7 mb
 * 'EmbErl_sH-arm-apple-darwin.tgz': ?.? mb
 * 'EmbErl_cH-arm-apple-darwin.tgz': ?.? mb
 * 'EmbErl_CH-arm-apple-darwin.tgz': ?.? mb
 * 'EmbErl_O1H-arm-apple-darwin.tgz': ?.? mb
