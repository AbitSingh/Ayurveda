const server_url = "http://localhost:5000";

const api_url = "https://jsonplaceholder.typicode.com/users";

const arr = [10, 20, 30, 40, 50];

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

export { api_url, arr, server_url, getCookie}; // named export
