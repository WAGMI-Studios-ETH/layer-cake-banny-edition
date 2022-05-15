#!/bin/env bash

function generate_test_folder_with_files() {
    cd .cache
    mkdir ipfs_test && cd ipfs_test
    seq -w 1 10000 | xargs -n1 -I% sh -c 'dd if=/dev/urandom of=%.json bs=$(shuf -i1-1000 -n1) count=1024'
}

generate_test_folder_with_files