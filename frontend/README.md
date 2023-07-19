### Step 1: Proxy Configuration File (proxy.config.json)

Create `proxy.config.json` file.
The `proxy.config.json` file is used to configure the settings for a proxy server. This file contains a JSON object with various properties that define how the proxy server operates. Below is an example of the structure and possible contents of a `proxy.config.json` file:
- `/api`: This is the path or URL pattern to match for incoming requests. In this case, any request that starts with /api will be redirected to the specified target server.
- `target`: The URL of the target server to which requests should be forwarded.
- `secure`: Boolean value indicating whether the proxy server should verify SSL certificates for HTTPS requests. (Default: true)
- `changeOrigin`: Boolean value indicating whether the `Origin` header should be changed to match the target server. (Default: false)
- `logLevel`: The log level for the proxy server's logging. Possible values "debug", "info", "warn", and "error". (Default: "info")

Note: You need to restart application on every change to `proxy.config.json` file.

```json
{
  "/api": {
    "target": "https://localhost:8443",
    "secure": false,
    "changeOrigin": false,
    "logLevel": "debug"
  }
}
```

### Step 2: Integrate Proxy Configuration in `angular.json`
1. Open the `angular.json` file in the root directory of your Angular application.
2. Locate the `"architect"` section in the `angular.json` file.
3. Inside `"architect"`, find the `"serve"` configuration object. It should look like this:

```json
{
  "projects": {
    "frontend": {
      "architect": {
        "serve": {
          "builder": "@angular-devkit/build-angular:dev-server",
          "options": {
            "proxyConfig": "proxy.config.json" // add this line
          }
```


## Configuring Angular to use ssl support

```json
{
   "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
   "projects": {
       "<PROJECT-NAME>": {
           "architect": {
               "serve": {
                   "options": {
                       "sslKey": "<relative path from angular.json>/server.key",
                       "sslCert": "<relative path from angular.json>/server.crt"
                   }
               }
           }
       }
   }
}
```

And then you can run (or add --ssl argument to npm run in package.json):

    ng serve --ssl

or add --ssl argument to npm start command in package.json

    "start": "ng serve -ssl",

--ssl true --ssl-cert cert.crt --ssl-key cert.key
