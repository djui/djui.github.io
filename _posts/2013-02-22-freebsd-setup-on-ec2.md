# Running on AWS EC2

[FreeBSD on EC2](http://www.daemonology.net/freebsd-on-ec2/) in version 9.1 is
made available by Colin Percival, FreeBSD Security Officer, author of TarSnap.

1. Adjust security group to allow incoming TCP connections on port 22 (SSH) from
your IP address.

        # pkg install openjdk6-jre-b27_2
        # export JAVA_HOME=/usr/local/openjdk6/
        # echo "fdesc   /dev/fd         fdescfs         rw      0       0" >> /etc/fstab
        # echo "proc    /proc           procfs          rw      0       0" >> /etc/fstab
    
        $ wget http://s3.amazonaws.com/ec2-downloads/ec2-api-tools.zip
        $ unzip ec2-api-tools.zip
        $ cd ec2-api-tools
        $ export EC2_HOME=$(pwd)
        $ export EC2_URL=https://ec2.eu-west-1b.amazonaws.com
        $ export AWS_ACCESS_KEY=~/.ssh/cert_pk-XXX.pem
        $ export AWS_SECRET_KEY=~/.ssh/cert-XXX.pem
        $ bin/ec2-authorize default -P tcp -p 22
        $ bin/ec2-authorize default -P udp -p 60000-61000
    
2. Get known_host fingerprint (optional)

        $ bin/ec2-get-console-output <instance_id> | grep "^ec2: .*ecdsa"

3. Login

        $ mosh --ssh="-i ~/.ssh/ec2" ec2-user@ec2-XXX.eu-west-1.compute.amazonaws.com

    or:

        $ ssh -i ~/.ssh/ec2 ec2-user@ec2-XXX.eu-west-1.compute.amazonaws.com

4. Disable crash dump email to original AMI author

    As the AMI author state himself in `/root/ec2-bits/etc/rc.conf`:

    > # Report panics and backtraces to the AMI author.  It is unlikely but
    > # possible that this will leak some sensitive information about the
    > # system, so this should probably be disabled in production.

    So let's do this:

        # sed -i -e 's/panicmail_enable="YES"/panicmail_enable="NO/' /etc/rc.conf

5. Set/Change password and install sudo

        $ passwd
        $ su -
        # passwd

        # pkg install sudo
        # visudo

6. If swap space is required, create a swap file or repartition to add a swap
partition (optional)

        # swapfile=/var/tmp/swap0
        # swapsize=512 # mb
        # dd if=/dev/zero of=$swapfile bs=1m count=$swapsize
        # chmod 0600 $swapfile
        # echo "swapfile=\"$swapfile\"" >> /etc/rc.conf
        # /etc/rc.d/addswap start

7. Done
