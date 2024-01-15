 #!/bin/bash
# Redis CLI 설치 스크립트

# gcc 설치
sudo yum install -y gcc

# Redis 다운로드 및 설치
wget http://download.redis.io/redis-stable.tar.gz
tar xvzf redis-stable.tar.gz
cd redis-stable
make

# Redis CLI 실행
src/redis-cli -c -h bloodtrail-cluster.on3gz0.ng.0001.apn2.cache.amazonaws.com -p 6379