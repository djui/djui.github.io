# FreeBSD "Brain-recoverer"

This document helps to configure a FreeBSD from scratch after a long time me
having probably forgotten everything.

## Installation

0. Location

        $ pushd /tmp

1. Download image

This is for FreeBSD 9.1. Boot-only is fine, if you have internet
connection. i386 is fine, or amd64.

        $ wget ftp://ftp.freebsd.org/pub/FreeBSD/releases/i386/i386/ISO-IMAGES/9.1/FreeBSD-9.1-RELEASE-i386-bootonly.iso

2. Verify checksum

        $ wget ftp://ftp.freebsd.org/pub/FreeBSD/releases/i386/i386/ISO-IMAGES/9.1/CHECKSUM.SHA256
        $ shasum -a 256 -c CHECKSUM.SHA256 FreeBSD-9.1-RELEASE-i386-bootonly.iso

3. Virtual Machine

When installing FreeBSD on a virtual machine (e.g. VirtualBox) currently at
least 2.3GB are required.

4. FreeBSD Installer

  [Welcome]: Install
  [Keymap Selection]: No
  [Distribution Select]: [*] ports
  [Network Configuration]: [*] IPv4 [*] DHCP [*] IPv6 [*] SLAAC
  [Partitioning]: Guided
  [Partition]: Entire Disk
  [Partition Editor]: [Finish] [Commit]
  [Fetching Distribution] ...
  [Timezone Configuration] ...
  [System Configuration]: [*] sshd [ ] moused [*] ntpd [*] powerd
  ]Dumpdev Configuration]: No
  [Add User Accounts] Yes
  [Final Configuration] Exit

## Setup

1. Allow user right for user super (if not configured already during OS installation)

        # pw group mod wheel -m uwe

2. Install packages

Minimum port set for: shell, editing, downloading, terminal sessions, compiling,
port&package management, and version controlling (replacing `pkg` with `pkgng`).
  
Either install `portmaster` (which since ~mid 2012 can use `pkgng`)...
  
        # portsnap fetch update
        # make -C /usr/ports/ports-mgmt/portmaster install clean
        # portmaster -aD

...or Install `pkg` using its own bootstrap `pkg-static`:

        # pkg

Use `pkgng` as default package manager and migrate ports:

        # echo "WITH_PKGNG=yes" >> /etc/make.conf
        # pkg2ng

Configure `pkg` and upgrade (if you are not using portmaster):

        # # echo 'PACKAGESITE: http://pkg.freebsd.org/${ABI}/latest' >> /usr/local/etc/pkg.conf
        # # echo 'PACKAGESITE: http://pkgbeta.freebsd.org/${ABI}/latest' >> /usr/local/etc/pkg.conf
        # echo 'PACKAGESITE: http://mirror.exonetric.net/pub/pkgng/${ABI}/latest' >> /usr/local/etc/pkg.conf
        # pkg update -f
        # pkg upgrade

Install packages

        # pkg install mg emacs-nox11 zsh mosh-1.2.3_1 curl wget w3m-m17n tmux autotools gmake git

Why `pkg(ng)`? [pkgng](https://github.com/pkgng/pkgng) seems it will become the
new package manager for FreeBSD in 2013; currently in beta since 2012. It's
database is sqlite based, the configurations are written in YAML and the
transport is using http(s) next to ftp.

## Configuration

1. Disable remote root logins on the server

        # sed -i -e "s/#PermitRootLogin yes/PermitRootLogin no/g" /etc/ssh/sshd_config

2. Enable password-less login

        $ ssh-keygen -t ecdsa -b 521 -f $HOME/.ssh/vps
        $ ssh-copy-id -i $HOME/.ssh/vps.pub uw.io

3. Set zsh as default shell

        # chsh -s zsh
        # chsh -s zsh ec2-user

4. Set character set to UTF-8

        # echo "me:\\" >> ~/.login_conf
        # echo "  :charset=UTF-8:\\" >> ~/.login_conf
        # echo "  :lang=en_US.UTF-8:\\" >> ~/.login_conf
        # echo "  :setenv=LC_COLLATE=C:" >> ~/.login_conf

5. Set timezone and correct time (if neccessary)

        # cp /usr/share/zoneinfo/Europe/Stockholm /etc/localtime
        # ntpdate pool.ntp.org

6. Nice prompt

        # echo 'PS1="%~"' >> ~/.zshrc
        # echo 'case `id -u` in' >> ~/.zshrc
        # echo '  0) PS1="%B${PS1}%F{red}#%f%b ";;' >> ~/.zshrc
        # echo '  *) PS1="%B${PS1}$%b ";;' >> ~/.zshrc
        # echo 'esac' >> ~/.zshrc

7. Use LLVM/CLang instead of GCC

        # echo "CC=clang" >> /etc/make.conf
        # echo "CXX=clang++" >> /etc/make.conf
        # echo "CPP=clang-cpp" >> /etc/make.conf

8. Done

## Backup

* pkg info | cut -d " " -f 1 > pkg_list.txt
* /etc/rc.conf
* ~/.zshrc
* ~/.login_conf
* ~/.tmux
* ~/.emacs
* emacs --eval "(message \"%s\" package-activated-list)"
