####setup
```bash
cd auSolution
npm install
npm start
```

login api
```bash
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"username":"xyz","password":"xyz"}' \
  http://localhost:3000/login
```

response
```json
{
  "success":true,
  "token":"token value"
}
```

patch api
```bash
curl --location \
    --request POST \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QiLCJpYXQiOjE1OTU3MDM3MzF9.i3OTQ7XosThBB0-c7EPlH5w6EiqEPwRfUxCn2CVoRFE' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "obj":{
            "a":"b"
        },
        "patch":{
             "op": "replace", "path": "/a", "value": "boo" 
        }
    }' \
    'localhost:3000/actions/jsonpatch'
```

response 
```json
{
  "success":true,
  "data":{"a":"boo"}
}
```

resize api
```bash
curl --location --request POST 'localhost:3000/actions/resize' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QiLCJpYXQiOjE1OTU3MDM3MzF9.i3OTQ7XosThBB0-c7EPlH5w6EiqEPwRfUxCn2CVoRFE' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'url=https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png'
```

Possible improvements
1.image link provided for resize api might not respond with content-type header. 'mmmagic' module can be used to detect mimetype after the file is downloaded and then can be checked if the file is an image
2.Error messages can be more specific. 