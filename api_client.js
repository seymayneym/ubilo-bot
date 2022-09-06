const axios = require('axios');

class JdoodleAPI{

    constructor(credentials){
        this.credentials = credentials;
        this.client = axios.create({
            baseURL:"https://api.jdoodle.com/v1/execute",
            timeout:10000,
        });
    }

    call = (script, success_cb, error_cb) => {
        this.client.post("/", {
            script:script,
            language:"c",
            versionIndex:"0",
            clientId:this.credentials.clientId,
            clientSecret:this.credentials.clientSecret,
        }).then(response => {
            success_cb(response);
        }).catch(error => {
            error_cb(error);
        });
    }

}

module.exports = JdoodleAPI;