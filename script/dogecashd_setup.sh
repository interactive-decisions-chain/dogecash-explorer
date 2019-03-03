#!/bin/bash
# Download latest node and install.
dogeclink=`curl -s https://api.github.com/repos/dogecash/dogecash/releases/latest | grep browser_download_url | grep dogecash.zip | cut -d '"' -f 4`
mkdir -p /tmp/dogecash
cd /tmp/dogecash
curl -Lo dogecash.zip $dogeclink
apt install zip unzip

unzip dogecash.zip
cd dogecash

sudo mv .* /usr/local/bin
cd
rm -rf /tmp/dogecash
mkdir ~/.dogecash

# Setup configuration for node.
rpcuser=$(head /dev/urandom | tr -dc A-Za-z0-9 | head -c 13 ; echo '')
rpcpassword=$(head /dev/urandom | tr -dc A-Za-z0-9 | head -c 32 ; echo '')
cat >~/.dogecash/dogecash.conf <<EOL
rpcuser=$rpcuser
rpcpassword=$rpcpassword
daemon=1
txindex=1
EOL

# Start node.
dogecashd
