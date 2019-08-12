#!/usr/bin/env bash

rm -r fixed
rm -r vsix.tmp
rm azurerm-vscode-tools-0.6.1-alphalangserv.vsix.fixed

unzip azurerm-vscode-tools-0.6.1-alphalangserv.vsix -d vsix.tmp
chmod +x vsix.tmp/extension/assets/scripts/*.sh

pushd vsix.tmp
zip -r ../fixed.zip *
popd
unzip fixed.zip -d fixed

rm -r ./vsix.tmp
mv azurerm-vscode-tools-0.6.1-alphalangserv.vsix azurerm-vscode-tools-0.6.1-alphalangserv.vsix.orig
mv fixed.zip azurerm-vscode-tools-0.6.1-alphalangserv.vsix
