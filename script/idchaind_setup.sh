#!/bin/bash
# Download latest node and install.
idchainclink=`curl -s https://api.github.com/repos/interactive-decisions-chain/idc-core/releases/latest | grep browser_download_url | grep node | cut -d '"' -f 4`
mkdir -p /tmp/idchain
cd /tmp/idchain
curl -Lo idchain.tar.gz $idchainclink
sudo add-apt-repository -y ppa:bitcoin/bitcoin
apt-get update
apt install -y zip unzip build-essential libtool autotools-dev automake pkg-config libssl-dev libevent-dev bsdmainutils libboost-all-dev
apt install -y libminiupnpc-dev libzmq3-dev
apt install -y libdb4.8-dev libdb4.8++-dev

tar -xzf idchain.tar.gz
rm idchain.tar.gz

sudo mv ./* /usr/local/bin
cd
rm -rf /tmp/idchain
mkdir ~/.idchain

# Setup configuration for node.
rpcuser=$(head /dev/urandom | tr -dc A-Za-z0-9 | head -c 13 ; echo '')
rpcpassword=$(head /dev/urandom | tr -dc A-Za-z0-9 | head -c 32 ; echo '')
cat >~/.idchain/idchain.conf <<EOL
rpcuser=$rpcuser
rpcpassword=$rpcpassword
daemon=1
txindex=1
EOL

# Start node.
idchaind
