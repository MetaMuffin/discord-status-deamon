

DISCORDROOTNAME='discord'
if [ "$1" == 'canary' ]; then
    DISCORDROOTNAME='discordcanary';
    echo 'Patching canary version'
fi

FILE=$(ls -1 ~/.config/$DISCORDROOTNAME/0.*/modules/discord_voice/index.js | head -n 1)
TMPFILE=$(mktemp)
APATH="$(dirname $PWD/$0)"
{ echo "require(\"../../../../../../../../../../../../../../../../..$APATH/mod\")"; cat $FILE; } > $TMPFILE
mv $FILE $FILE-backup
mv $TMPFILE $FILE
echo "If there is no error above, this might even had worked!"
