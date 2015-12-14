#!/usr/bin/env bash
SRC_DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
BUILD_DIR=lambda
ZIP=$SRC_DIR/dominos-alexa-skill.zip

if [ -d "$BUILD_DIR" ]; then
    rm $BUILD_DIR/index.js
    rm $BUILD_DIR/AlexaSkill.js
    rm $BUILD_DIR/helper.js
else
    mkdir $BUILD_DIR
    npm install --prefix $BUILD_DIR
fi

rm $ZIP
cp $SRC_DIR/index.js $BUILD_DIR
cp $SRC_DIR/AlexaSkill.js $BUILD_DIR
cp $SRC_DIR/helper.js $BUILD_DIR
cd $BUILD_DIR && zip -r $ZIP ./* && cd $SRC_DIR