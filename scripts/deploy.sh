#!/bin/bash

echo CPK=$CPK
echo CSK=$CSK

if [ $CPK == "" ]; then
	echo "EnvVar not set: CPK"
	echo "Set CPK to the Clerk Publishable Key"
	exit 1
fi

if [ $CSK == "" ]; then
	echo "EnvVar not set: CSK"
	echo "Set CSK to the Clerk Secret Key"
	exit 1
fi

fly deploy --build-secret CPK=$CPK --build-secret CSK=$CSK $1
