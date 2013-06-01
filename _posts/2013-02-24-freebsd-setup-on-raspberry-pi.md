# Running FreeBSD on Raspberry Pi

The most up-to-date version of
[FreeBSD on Raspberry Pi](http://shell.peach.ne.jp/aoyama/archives/2357/comment-page-1#comment-9942)
I could find is from [@yasnari](https://twitter.com/yasnari), a Japanese
developer, who provides roughly bi-weekly `tar.gz`s of the current
[FreeBSD 10-CURRENT](https://wiki.freebsd.org/WhatsNew/FreeBSD10) version, which
in turn has added support for the Raspberry Pi in release 10[^1]. The
[installation process](http://shell.peach.ne.jp/aoyama/archives/2357/comment-page-1#comment-9942)
is described in Japanese so I have made a translation here with slight
modifications.

## Installation

1. Download a disk image from
[peach.ne.jp](http://www.peach.ne.jp/archives/rpi/).

        $ wget http://www.peach.ne.jp/archives/rpi/freebsd-pi-clang-20130223.img.gz

2. Transfer the disk image onto a SD card (replace `/dev/disk2` with your device
identifier for the SD card reader):

        # gunzip -c freebsd-pi-clang-20130223.img.gz | dd of=/dev/disk2 bs=1m

3. Plug the card, the HDMI cable, and a keyboard into the Raspberry Pi and then
plug in the power cable to boot up the OS.

4. The login credentials (*pi*/*raspberry* and *root*/*raspberry*) are
publically known, so you should change them right away.

        # passwd
        # passwd pi

5. Done

## Configuration

You might want to use DHCP to retrieve your IP lease:

    # echo 'ifconfig_ue0="NOSYNCDHCP"' >> /etc/rc.conf
    
Set correct timezone:

    # cp /usr/share/zoneinfo/Europe/Stockholm /etc/localtime
    
You might want to resize your partition(s) to use the full SD Card space.

    # gpart resize -i 2 mmcsd0s2
    # shutdown -r now
    # growfs mmcsd0s2a

## Packages

Raspberry Pi is an ARM platform and the FreeBSD 10-CURRENT version uses
[Clang](http://clang.llvm.org/) for compiling the system. So many packages are
not yet checked and patched to support ARM and/or Clang. Thus, we currently need to
configure a special [package site](http://kernelnomicon.org/?p=261). Thus,
consider the following steps in flux until FreeBSD 10-RELEASE is out.

Either install `portmaster` (which since ~mid 2012 can use `pkgng`)...

    # portsnap fetch update                                       
    # make -C /usr/ports/ports-mgmt/portmaster install clean      
    # portmaster -aD
   
...or Install `pkg` using its own bootstrap `pkg-static`:
              
    # fetch http://wd1cks.org/RPi/packages/Latest/pkg.txz    
    # tar xf pkg.txz --strip-components=4 /usr/local/sbin/pkg-static
    # ./pkg-static add ./pkg.txz
    # echo "WITH_PKGNG=yes" >> /etc/make.conf
    # pkg2ng
    # echo "PACKAGESITE: http://people.freebsd.org/~gonzo/arm/pkg/" >> /usr/local/etc/pkg.conf
    # ln -s /usr/local/lib/libpkg.so.0 /usr/lib/libpkg.so.0
    # pkg update

And then we can install packages using the standard `pkg install` command.

    # pkg install mg

Or if you want to use ports, using portmaster:

    # make -C /usr/ports/ports-mgmt/portmaster install clean
    # make -C /usr/ports/editor/mg install clean

A list of currently 105 ported and supported packages can be viewed at the
[arm pkg list](http://people.freebsd.org/~gonzo/arm/pkg/). **Note** that this
repository site will varnish in the future and you can use the FreeBSD default

If you IP address chances, you can install a dyndns client:

    # make -C /usr/ports/dns/ddclient install clean
    # echo "use=if, if=eu0" >> /usr/local/etc/ddclient.conf
    # echo "ssl=yes" >> /usr/local/etc/ddclient.conf
    # echo "login=your_username" >> /usr/local/etc/ddclient.conf
    # echo "password=*******" >> /usr/local/etc/ddclient.conf
    # echo "your_domain.dyndns.org" >> /usr/local/etc/ddclient.conf
    # echo "ddclient_enable=YES" >> /etc/rc.conf
    # /usr/local/etc/rc.d/ddclient start

[^1]: The *ABI* name is `freebsd:10:arm:32:el:oabi:softfp`.
