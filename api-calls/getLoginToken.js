import fetch from "node-fetch";
export const getLoginToken = async (username, password) => {
    if (!username || !password) {
        throw new Error(`Username and password are required. Got username: ${username}, password: ${password ? '[PROVIDED]' : '[MISSING]'}`);
    }
    const response = await fetch("http://localhost:2221/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username, password: password }),
    });
    if (response.status !== 200) {
        const errorBody = await response.text();
        throw new Error(`Failed to fetch login token. Status: ${response.status}, Response: ${errorBody}`);
    }
    const body = await response.json();
    return body.token;
}
