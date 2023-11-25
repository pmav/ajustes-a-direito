#!/bin/bash

#
# Usage: "sh tools/redis-delete.sh 123" to delete 123 redis keys at random
#

for n in $(seq $1); do
  redis-cli del $(redis-cli randomkey) > /dev/null
done
