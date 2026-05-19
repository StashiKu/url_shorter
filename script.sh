#!/bin/bash
echo "starting script..."
mkdir -p output
echo "hello from script" > output/message.txt
cat output/message.txt


# ============ Questions ===========

# mddir -p
# if grep -q "hello" a.txt; then echo "found"; fi
# if [-f "output/message.txt"]
# uses: actions/checkout@v4
