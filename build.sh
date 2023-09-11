rm -Rf website
mkdir website
node src/build.js
cp -R src/html/* website