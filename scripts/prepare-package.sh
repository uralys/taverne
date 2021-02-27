
echo '☢️  preparing package...'
cp readme.md dist/.
cp license dist/.
cp package.json dist/.
cp -r src/middlewares dist/.
rm -rf dist/meta
