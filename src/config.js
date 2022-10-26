export default {
    // BASEURL: "http://172.16.32.46:8008"
	BASEURL: (process.env.NODE_ENV == 'prerelease') ? 'http://pre-shucang-backend.msyidai.com' : 'https://shucang.msyidai.com/'
}