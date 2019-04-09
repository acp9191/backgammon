#!/bin/bash

export MIX_ENV=prod
export PORT=4799

echo "Stopping old copy of app, if any..."

_build/prod/rel/backgammon-2/bin/backgammon-2 stop || true

echo "Starting app..."

# Start to run in background from shell.
#_build/prod/rel/memory/bin/memory start

# Foreground for testing and for systemd
_build/prod/rel/backgammon-2/bin/backgammon-2 foreground

