echo '☢️  preparing package...'
mkdir dist.package
cp -r dist/cjs dist.package/.
cp -r dist/esm dist.package/.
cp -r src/middlewares dist.package/.
cp -r src/hooks dist.package/.
cp readme.md dist.package/.
cp license dist.package/.
cp package.json dist.package/.
echo '☢️  dist.package ready.'
